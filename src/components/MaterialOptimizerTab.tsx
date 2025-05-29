
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Layers, Weight, DollarSign, Recycle, Zap, Shield } from 'lucide-react';

const MaterialOptimizerTab = () => {
  const currentMaterials = [
    { 
      component: "Body Panels", 
      material: "Steel", 
      weight: 450, 
      cost: 1200, 
      sustainability: 65,
      strength: 85 
    },
    { 
      component: "Hood", 
      material: "Aluminum", 
      weight: 25, 
      cost: 450, 
      sustainability: 78,
      strength: 72 
    },
    { 
      component: "Interior Trim", 
      material: "ABS Plastic", 
      weight: 15, 
      cost: 200, 
      sustainability: 45,
      strength: 60 
    },
    { 
      component: "Bumper", 
      material: "Polypropylene", 
      weight: 8, 
      cost: 150, 
      sustainability: 55,
      strength: 65 
    }
  ];

  const alternatives = [
    {
      component: "Body Panels",
      current: "Steel",
      alternative: "Carbon Fiber",
      weightSaving: "65%",
      costChange: "+180%",
      strengthImprovement: "+25%",
      sustainabilityChange: "-15%",
      recommended: false
    },
    {
      component: "Body Panels", 
      current: "Steel",
      alternative: "Advanced High-Strength Steel",
      weightSaving: "15%",
      costChange: "+25%", 
      strengthImprovement: "+40%",
      sustainabilityChange: "+10%",
      recommended: true
    },
    {
      component: "Interior Trim",
      current: "ABS Plastic", 
      alternative: "Bio-based Composite",
      weightSaving: "20%",
      costChange: "+15%",
      strengthImprovement: "+10%", 
      sustainabilityChange: "+45%",
      recommended: true
    }
  ];

  const getTotalWeight = () => currentMaterials.reduce((sum, item) => sum + item.weight, 0);
  const getTotalCost = () => currentMaterials.reduce((sum, item) => sum + item.cost, 0);
  const getAvgSustainability = () => 
    currentMaterials.reduce((sum, item) => sum + item.sustainability, 0) / currentMaterials.length;

  return (
    <div className="space-y-6 mt-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 border-blue-300/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Weight className="h-4 w-4 text-blue-400" />
              <span className="text-blue-200 text-sm">Total Weight</span>
            </div>
            <div className="text-2xl font-bold text-white">{getTotalWeight()} kg</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-blue-300/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-blue-200 text-sm">Material Cost</span>
            </div>
            <div className="text-2xl font-bold text-white">${getTotalCost()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-blue-300/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Recycle className="h-4 w-4 text-green-400" />
              <span className="text-blue-200 text-sm">Sustainability</span>
            </div>
            <div className="text-2xl font-bold text-white">{Math.round(getAvgSustainability())}%</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-blue-300/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-blue-200 text-sm">Efficiency Score</span>
            </div>
            <div className="text-2xl font-bold text-white">B+</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Materials */}
        <Card className="bg-white/10 border-blue-300/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Current Material Breakdown
            </CardTitle>
            <CardDescription className="text-blue-200">
              Analysis of existing material selection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentMaterials.map((item, index) => (
              <div key={index} className="p-3 bg-white/5 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-white font-medium">{item.component}</h4>
                    <p className="text-blue-200 text-sm">{item.material}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">{item.weight} kg</div>
                    <div className="text-blue-200 text-sm">${item.cost}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-300">Sustainability</span>
                    <span className="text-white">{item.sustainability}%</span>
                  </div>
                  <Progress value={item.sustainability} className="h-1" />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-300">Strength Rating</span>
                    <span className="text-white">{item.strength}%</span>
                  </div>
                  <Progress value={item.strength} className="h-1" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Optimization Recommendations */}
        <Card className="bg-white/10 border-blue-300/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Optimization Recommendations
            </CardTitle>
            <CardDescription className="text-blue-200">
              AI-suggested material alternatives
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alternatives.map((alt, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg border border-blue-300/20">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-white font-medium">{alt.component}</h4>
                    <p className="text-blue-200 text-sm">
                      {alt.current} → {alt.alternative}
                    </p>
                  </div>
                  {alt.recommended && (
                    <Badge className="bg-green-600 text-white">Recommended</Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-300">Weight:</span>
                    <span className="text-green-400 ml-2">{alt.weightSaving}</span>
                  </div>
                  <div>
                    <span className="text-blue-300">Cost:</span>
                    <span className={`ml-2 ${alt.costChange.startsWith('+') ? 'text-red-400' : 'text-green-400'}`}>
                      {alt.costChange}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-300">Strength:</span>
                    <span className="text-green-400 ml-2">{alt.strengthImprovement}</span>
                  </div>
                  <div>
                    <span className="text-blue-300">Sustainability:</span>
                    <span className={`ml-2 ${alt.sustainabilityChange.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {alt.sustainabilityChange}
                    </span>
                  </div>
                </div>
                
                <Separator className="my-3 bg-blue-300/20" />
                
                <Button 
                  size="sm" 
                  className={`w-full ${alt.recommended ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {alt.recommended ? 'Apply Recommendation' : 'Consider Alternative'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Impact Summary */}
      <Card className="bg-white/10 border-blue-300/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Optimization Impact Summary</CardTitle>
          <CardDescription className="text-blue-200">
            Projected improvements with recommended material changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">-68 kg</div>
              <p className="text-blue-200">Weight Reduction</p>
              <p className="text-xs text-blue-300">14% lighter overall</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">+$480</div>
              <p className="text-blue-200">Cost Increase</p>
              <p className="text-xs text-blue-300">ROI: 18 months</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">+22%</div>
              <p className="text-blue-200">Sustainability</p>
              <p className="text-xs text-blue-300">Carbon footprint reduction</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">A-</div>
              <p className="text-blue-200">New Efficiency Grade</p>
              <p className="text-xs text-blue-300">Industry leading</p>
            </div>
          </div>
          
          <div className="mt-6 flex gap-4">
            <Button className="bg-green-600 hover:bg-green-700">
              Apply All Recommendations
            </Button>
            <Button variant="outline" className="border-blue-300/50 text-blue-200 hover:bg-white/10">
              Generate Cost Analysis
            </Button>
            <Button variant="outline" className="border-blue-300/50 text-blue-200 hover:bg-white/10">
              Export BOM
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialOptimizerTab;
