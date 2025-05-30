
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { AlertTriangle } from 'lucide-react';

interface ModelProps {
  url: string;
  onError: (error: string) => void;
  onLoad: () => void;
}

const Model = ({ url, onError, onLoad }: ModelProps) => {
  const [loadingState, setLoadingState] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    console.log('Model component: Starting to load model from URL:', url);
    setLoadingState('loading');

    // Create a promise to handle the GLTF loading
    const loadModel = async () => {
      try {
        console.log('Model component: Attempting to load GLTF...');
        const { scene } = await useGLTF.preload(url);
        console.log('Model component: GLTF loaded successfully');
        setLoadingState('loaded');
        onLoad();
        return scene;
      } catch (error) {
        console.error('Model component: GLTF loading failed:', error);
        setLoadingState('error');
        onError('Failed to load 3D model. Please try uploading a GLB file instead of GLTF for better compatibility.');
        return null;
      }
    };

    loadModel();
  }, [url, onError, onLoad]);

  if (loadingState === 'error') {
    return null;
  }

  try {
    const { scene } = useGLTF(url);
    console.log('Model component: Rendering GLTF scene');
    
    // Apply a fallback material to handle missing textures
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        // If the material has issues loading textures, apply a fallback
        if (child.material.map && !child.material.map.image) {
          console.log('Model component: Applying fallback material for missing texture');
          child.material = new THREE.MeshStandardMaterial({ 
            color: 0x808080,
            metalness: 0.1,
            roughness: 0.8
          });
        }
      }
    });

    return <primitive object={scene} scale={[1, 1, 1]} />;
  } catch (error) {
    console.error('Model component: Error during rendering:', error);
    onError('Model rendering error. Please try a different file format.');
    return null;
  }
};

interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer = ({ modelUrl }: ModelViewerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('ModelViewer: Rendering with URL:', modelUrl);

  useEffect(() => {
    console.log('ModelViewer: Effect triggered, resetting state for new model');
    setError(null);
    setIsLoading(true);
  }, [modelUrl]);

  const handleError = (errorMessage: string) => {
    console.error('ModelViewer: Handling error:', errorMessage);
    setError(errorMessage);
    setIsLoading(false);
  };

  const handleLoad = () => {
    console.log('ModelViewer: Model loaded successfully');
    setIsLoading(false);
    setError(null);
  };

  const handleCanvasError = (event: any) => {
    console.error('ModelViewer: Canvas error:', event);
    handleError('3D rendering initialization failed');
  };

  if (error) {
    return (
      <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-b from-red-900 to-slate-800 flex items-center justify-center">
        <div className="text-center p-6">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-200 text-sm mb-2">Model Loading Error</p>
          <p className="text-red-300 text-xs max-w-sm">
            {error}
          </p>
          <p className="text-red-400 text-xs mt-2">
            Tip: GLB files work better than GLTF files as they contain all textures internally.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-b from-blue-900 to-slate-800 relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-900/50 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
            <p className="text-blue-200 text-sm">Loading 3D model...</p>
          </div>
        </div>
      )}
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        className="w-full h-full"
        onError={handleCanvasError}
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true
        }}
      >
        <Suspense 
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#3b82f6" wireframe />
            </mesh>
          }
        >
          <Environment preset="studio" />
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Model url={modelUrl} onError={handleError} onLoad={handleLoad} />
          <ContactShadows 
            opacity={0.4} 
            scale={10} 
            blur={1} 
            far={10} 
            resolution={256} 
            color="#000000" 
          />
          <OrbitControls 
            enableZoom={true} 
            enablePan={true} 
            enableRotate={true}
            maxDistance={20}
            minDistance={2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ModelViewer;
