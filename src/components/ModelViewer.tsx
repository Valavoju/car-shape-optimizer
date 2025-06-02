
import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

interface ModelProps {
  url: string;
}

const Model = ({ url }: ModelProps) => {
  const meshRef = useRef<THREE.Group>(null);

  let gltf;
  try {
    gltf = useLoader(GLTFLoader, url);
  } catch (err) {
    console.error('Failed to load GLTF model:', err);
    throw new Error('Failed to load 3D model. Please try using a GLB file format.');
  }

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  if (!gltf || !gltf.scene) {
    return null;
  }

  // Clone the scene to avoid issues with multiple instances
  const clonedScene = gltf.scene.clone();
  
  // Scale and center the model
  const box = new THREE.Box3().setFromObject(clonedScene);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 2 / maxDim;
  
  clonedScene.scale.setScalar(scale);
  clonedScene.position.sub(center.multiplyScalar(scale));

  return (
    <group ref={meshRef}>
      <primitive object={clonedScene} />
    </group>
  );
};

const LoadingSpinner = () => (
  <mesh>
    <boxGeometry args={[0.5, 0.5, 0.5]} />
    <meshStandardMaterial color="#3b82f6" />
  </mesh>
);

const ErrorModel = () => (
  <group>
    <mesh>
      <boxGeometry args={[2, 1, 0.5]} />
      <meshStandardMaterial color="#ef4444" />
    </mesh>
    <mesh position={[0, 1.2, 0]}>
      <boxGeometry args={[0.1, 0.3, 0.1]} />
      <meshStandardMaterial color="#fbbf24" />
    </mesh>
  </group>
);

interface ModelViewerProps {
  modelUrl: string;
}

class ModelErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Model error boundary caught:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Model loading error:', error, errorInfo);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

const ModelViewer = ({ modelUrl }: ModelViewerProps) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    console.error('Model loading failed for URL:', modelUrl);
    setHasError(true);
  };

  // Reset error state when model URL changes
  React.useEffect(() => {
    setHasError(false);
  }, [modelUrl]);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-center">
          <p className="text-red-400 mb-2">Model Loading Error</p>
          <p className="text-gray-400 text-sm">Please try uploading a GLB file</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={<LoadingSpinner />}>
          <ModelErrorBoundary fallback={<ErrorModel />} onError={handleError}>
            <Model url={modelUrl} />
          </ModelErrorBoundary>
        </Suspense>
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={10}
          minDistance={1}
        />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
