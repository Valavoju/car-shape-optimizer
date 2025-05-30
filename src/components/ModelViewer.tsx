
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { AlertTriangle } from 'lucide-react';

interface ModelProps {
  url: string;
  onError: (error: string) => void;
}

const Model = ({ url, onError }: ModelProps) => {
  try {
    const { scene } = useGLTF(url);
    return <primitive object={scene} scale={[1, 1, 1]} />;
  } catch (error) {
    console.error('Model loading error:', error);
    onError(error instanceof Error ? error.message : 'Failed to load model');
    return null;
  }
};

interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer = ({ modelUrl }: ModelViewerProps) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset error when modelUrl changes
    setError(null);
  }, [modelUrl]);

  const handleError = (errorMessage: string) => {
    console.error('ModelViewer error:', errorMessage);
    setError(errorMessage);
  };

  const handleCanvasError = (event: any) => {
    console.error('Canvas error:', event);
    handleError('3D rendering error occurred');
  };

  if (error) {
    return (
      <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-b from-red-900 to-slate-800 flex items-center justify-center">
        <div className="text-center p-6">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-200 text-sm mb-2">Model Loading Error</p>
          <p className="text-red-300 text-xs">
            The uploaded model may be corrupted or contain external references that cannot be loaded.
            Try uploading a self-contained GLB file instead.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-b from-blue-900 to-slate-800">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        className="w-full h-full"
        onError={handleCanvasError}
      >
        <Suspense 
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#3b82f6" />
            </mesh>
          }
        >
          <Environment preset="studio" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Model url={modelUrl} onError={handleError} />
          <ContactShadows 
            opacity={0.4} 
            scale={10} 
            blur={1} 
            far={10} 
            resolution={256} 
            color="#000000" 
          />
          <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ModelViewer;
