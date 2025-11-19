import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import * as THREE from 'three';

interface ModelProps {
  url: string;
  fileType: string;
}

const Model = ({ url, fileType }: ModelProps) => {
  const meshRef = useRef<THREE.Group>(null);
  let modelObject: THREE.Group | THREE.Object3D | null = null;

  // Convert Data URL to Blob URL if needed - with cleanup
  const modelUrl = React.useMemo(() => {
    if (url.startsWith('data:')) {
      try {
        const arr = url.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || '';
        const bstr = atob(arr[1]);
        const n = bstr.length;
        const u8arr = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
          u8arr[i] = bstr.charCodeAt(i);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        console.log('Created blob URL for model:', blobUrl);
        return blobUrl;
      } catch (error) {
        console.error('Failed to convert data URL to blob:', error);
        return url;
      }
    }
    return url;
  }, [url]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (modelUrl && modelUrl.startsWith('blob:')) {
        URL.revokeObjectURL(modelUrl);
        console.log('Cleaned up blob URL');
      }
    };
  }, [modelUrl]);

  try {
    if (fileType === 'obj') {
      // Load OBJ file
      const obj = useLoader(OBJLoader, modelUrl);
      modelObject = obj;
    } else {
      // Load GLB/GLTF file
      const gltf = useLoader(GLTFLoader, modelUrl);
      modelObject = gltf.scene;
    }
  } catch (err) {
    console.error(`Failed to load ${fileType.toUpperCase()} model:`, err);
    throw new Error(`Failed to load 3D model. Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  if (!modelObject) {
    return null;
  }

  // Clone the scene to avoid issues with multiple instances
  const clonedScene = modelObject.clone();
  
  // Add default material to OBJ files if they don't have one
  if (fileType === 'obj') {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (!child.material || (Array.isArray(child.material) && child.material.length === 0)) {
          child.material = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc,
            metalness: 0.3,
            roughness: 0.7
          });
        }
      }
    });
  }
  
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
  fileType?: string;
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

const ModelViewer = ({ modelUrl, fileType: propFileType }: ModelViewerProps) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleError = () => {
    console.error('Model loading failed for URL:', modelUrl);
    setHasError(true);
  };

  // Reset error state when model URL changes
  useEffect(() => {
    console.log('ModelViewer received:', { 
      modelUrl: modelUrl?.substring(0, 50), 
      fileType: propFileType 
    });
    setHasError(false);
    setErrorMessage('');
  }, [modelUrl, propFileType]);

  // Resolve file type: prefer prop, else try to infer from URL (works for http(s) but not blob URLs)
  const resolveFileType = (url: string, ft?: string): string => {
    const ext = ft?.toLowerCase?.();
    if (ext) return ext;
    const parts = url.toLowerCase().split('.');
    const maybe = parts.length > 1 ? parts.pop()! : '';
    if (maybe === 'blend') {
      setHasError(true);
      setErrorMessage('BLEND files cannot be loaded directly. Please export from Blender as GLB, GLTF, or OBJ format.');
      return 'unsupported';
    }
    return maybe;
  };

  const fileType = resolveFileType(modelUrl, propFileType);

  if (hasError || fileType === 'unsupported') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-center p-6">
          <p className="text-red-400 mb-2 font-semibold">Model Loading Error</p>
          <p className="text-gray-400 text-sm mb-3">
            {errorMessage || 'Failed to load the 3D model'}
          </p>
          <p className="text-gray-500 text-xs">
            Supported formats: GLB, GLTF, OBJ
          </p>
          <p className="text-yellow-400 text-xs mt-2">
            Note: BLEND files must be exported to GLB/OBJ format first
          </p>
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
            <Model url={modelUrl} fileType={fileType} />
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
