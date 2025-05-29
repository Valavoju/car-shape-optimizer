import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Zap, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import ModelViewer from './ModelViewer';
import ErgonomicsTab from './ErgonomicsTab';
import NvhTab from './NvhTab';
import MaterialOptimizerTab from './MaterialOptimizerTab';

const Dashboard = () => {
  const [uploadedModel, setUploadedModel] = useState<string | null>(null);
  const [dragCoefficient, setDragCoefficient] = useState<number | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
      const url = URL.createObjectURL(file);
      setUploadedModel(url);
      setIsAnalyzing(true);
      setAnalysisComplete(false);
      setDragCoefficient(null);
      
      // Simulate analysis delay
      setTimeout(() => {
        const randomDrag = 0.30 + Math.random() * 0.15;
        setDragCoefficient(Number(randomDrag.toFixed(3)));
        setAnalysisComplete(true);
        setIsAnalyzing(false);
      }, 2000);
    }
  };

  const improvements = [
    { 
      area: "Front Spoiler", 
      impact: "High", 
      description: "Add front air dam to reduce airflow under vehicle",
      reduction: "0.025"
    },
    { 
      area: "Rear Slope", 
      impact: "Medium", 
      description: "Reduce rear window angle by 5-8 degrees",
      reduction: "0.018"
    },
    { 
      area: "Side Mirrors", 
      impact: "Low", 
      description: "Streamline mirror housings and reduce frontal area",
      reduction: "0.008"
    },
    { 
      area: "Wheel Wells", 
      impact: "Medium", 
      description: "Add wheel well covers and optimize tire geometry",
      reduction: "0.012"
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Automotive CFD Analysis Suite
          </h1>
          <p className="text-blue-200 text-lg">
            Advanced aerodynamic optimization for automotive design
          </p>
        </div>

        {/* Upload Section */}
        {!uploadedModel && (
          <Card className="mb-8 bg-white/10 border-blue-300/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="h-6 w-6" />
                Upload 3D Model
              </CardTitle>
              <CardDescription className="text-blue-200">
                Upload your .glb or .gltf car model to begin aerodynamic analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-blue-300/50 rounded-lg p-12 text-center hover:border-blue-300/70 transition-colors">
                <input
                  type="file"
                  accept=".glb,.gltf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="model-upload"
                />
                <label htmlFor="model-upload" className="cursor-pointer">
                  <Upload className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                  <p className="text-xl text-white mb-2">Drop your 3D model here</p>
                  <p className="text-blue-200">Supports .GLB and .GLTF formats</p>
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                    Browse Files
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Dashboard */}
        {uploadedModel && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* 3D Viewer */}
            <div className="lg:col-span-2">
              <Card className="bg-white/10 border-blue-300/30 backdrop-blur-sm h-96">
                <CardHeader>
                  <CardTitle className="text-white">3D Model Viewer</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ModelViewer modelUrl={uploadedModel} />
                </CardContent>
              </Card>
            </div>

            {/* Analysis Results */}
            <div className="space-y-4">
              <Card className="bg-white/10 border-blue-300/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Drag Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isAnalyzing ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                      <p className="text-blue-200">Analyzing aerodynamics...</p>
                    </div>
                  ) : analysisComplete && dragCoefficient ? (
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">
                        {dragCoefficient}
                      </div>
                      <p className="text-blue-200 mb-4">Coefficient of Drag (Cd)</p>
                      <Badge 
                        variant={dragCoefficient < 0.35 ? "default" : "destructive"}
                        className="text-sm"
                      >
                        {dragCoefficient < 0.35 ? "Excellent" : "Needs Improvement"}
                      </Badge>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-blue-200">Upload a model to begin analysis</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-blue-300/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">CATIA Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in CATIA V6
                  </Button>
                  <p className="text-sm text-blue-200 mt-2">
                    Export optimized geometry for detailed CAD modeling
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Improvement Suggestions */}
        {analysisComplete && dragCoefficient && (
          <Card className="mb-8 bg-white/10 border-blue-300/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Aerodynamic Improvements
              </CardTitle>
              <CardDescription className="text-blue-200">
                AI-powered suggestions to reduce drag coefficient
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {improvements.map((improvement, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg bg-white/5 border border-blue-300/20 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{improvement.area}</h4>
                      <Badge className={`${getImpactColor(improvement.impact)} text-white`}>
                        {improvement.impact}
                      </Badge>
                    </div>
                    <p className="text-blue-200 text-sm mb-3">{improvement.description}</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm font-medium">
                        -Cd {improvement.reduction}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Tabs */}
        {uploadedModel && (
          <Tabs defaultValue="ergonomics" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 border-blue-300/30">
              <TabsTrigger 
                value="ergonomics" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200"
              >
                Ergonomics
              </TabsTrigger>
              <TabsTrigger 
                value="nvh" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200"
              >
                NVH Analysis
              </TabsTrigger>
              <TabsTrigger 
                value="materials" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200"
              >
                Material Optimizer
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ergonomics">
              <ErgonomicsTab />
            </TabsContent>
            
            <TabsContent value="nvh">
              <NvhTab />
            </TabsContent>
            
            <TabsContent value="materials">
              <MaterialOptimizerTab />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
