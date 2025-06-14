
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Layers, Weight, DollarSign, Recycle, Zap, Shield } from 'lucide-react';

interface MaterialOptimizerTabProps {
  isDarkMode?: boolean;
}

const MaterialOptimizerTab = ({ isDarkMode = true }: MaterialOptimizerTabProps) => {
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

  const cardClasses = isDarkMode
    ? 'bg-gray-800 border-gray-700 text-gray-100'
    : 'bg-gray-50 border-gray-200 text-gray-900';

  const textClasses = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const mutedTextClasses = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const subTextClasses = isDarkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className="space-y-6 mt-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={cardClasses}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Weight className="h-4 w-4 text-blue-400" />
              <span className={`${mutedTextClasses} text-sm`}>Total Weight</span>
            </div>
            <div className={`text-2xl font-bold ${textClasses}`}>{getTotalWeight()} kg</div>
          </CardContent>
        </Card>
        
        <Card className={cardClasses}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className={`${mutedTextClasses} text-sm`}>Material Cost</span>
            </div>
            <div className={`text-2xl font-bold ${textClasses}`}>${getTotalCost()}</div>
          </CardContent>
        </Card>
        
        <Card className={cardClasses}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Recycle className="h-4 w-4 text-green-400" />
              <span className={`${mutedTextClasses} text-sm`}>Sustainability</span>
            </div>
            <div className={`text-2xl font-bold ${textClasses}`}>{Math.round(getAvgSustainability())}%</div>
          </CardContent>
        </Card>
        
        <Card className={cardClasses}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className={`${mutedTextClasses} text-sm`}>Efficiency Score</span>
            </div>
            <div className={`text-2xl font-bold ${textClasses}`}>B+</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Materials */}
        <Card className={cardClasses}>
          <CardHeader>
            <CardTitle className={`${textClasses} flex items-center gap-2`}>
              <Layers className="h-5 w-5" />
              Current Material Breakdown
            </CardTitle>
            <CardDescription className={mutedTextClasses}>
              Analysis of existing material selection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentMaterials.map((item, index) => (
              <div key={index} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className={`${textClasses} font-medium`}>{item.component}</h4>
                    <p className={`${mutedTextClasses} text-sm`}>{item.material}</p>
                  </div>
                  <div className="text-right">
                    <div className={`${textClasses} font-semibold`}>{item.weight} kg</div>
                    <div className={`${mutedTextClasses} text-sm`}>${item.cost}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={subTextClasses}>Sustainability</span>
                    <span className={textClasses}>{item.sustainability}%</span>
                  </div>
                  <Progress value={item.sustainability} className="h-1" />
                  
                  <div className="flex justify-between text-sm">
                    <span className={subTextClasses}>Strength Rating</span>
                    <span className={textClasses}>{item.strength}%</span>
                  </div>
                  <Progress value={item.strength} className="h-1" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Optimization Recommendations */}
        <Card className={cardClasses}>
          <CardHeader>
            <CardTitle className={`${textClasses} flex items-center gap-2`}>
              <Shield className="h-5 w-5" />
              Optimization Recommendations
            </CardTitle>
            <CardDescription className={mutedTextClasses}>
              AI-suggested material alternatives
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alternatives.map((alt, index) => (
              <div key={index} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className={`${textClasses} font-medium`}>{alt.component}</h4>
                    <p className={`${mutedTextClasses} text-sm`}>
                      {alt.current} → {alt.alternative}
                    </p>
                  </div>
                  {alt.recommended && (
                    <Badge className="bg-green-600 text-white">Recommended</Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className={subTextClasses}>Weight:</span>
                    <span className="text-green-400 ml-2">{alt.weightSaving}</span>
                  </div>
                  <div>
                    <span className={subTextClasses}>Cost:</span>
                    <span className={`ml-2 ${alt.costChange.startsWith('+') ? 'text-red-400' : 'text-green-400'}`}>
                      {alt.costChange}
                    </span>
                  </div>
                  <div>
                    <span className={subTextClasses}>Strength:</span>
                    <span className="text-green-400 ml-2">{alt.strengthImprovement}</span>
                  </div>
                  <div>
                    <span className={subTextClasses}>Sustainability:</span>
                    <span className={`ml-2 ${alt.sustainabilityChange.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {alt.sustainabilityChange}
                    </span>
                  </div>
                </div>
                
                <Separator className={`my-3 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                
                <Button 
                  size="sm" 
                  className={`w-full ${alt.recommended ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                >
                  {alt.recommended ? 'Apply Recommendation' : 'Consider Alternative'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Impact Summary */}
      <Card className={cardClasses}>
        <CardHeader>
          <CardTitle className={textClasses}>Optimization Impact Summary</CardTitle>
          <CardDescription className={mutedTextClasses}>
            Projected improvements with recommended material changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">-68 kg</div>
              <p className={mutedTextClasses}>Weight Reduction</p>
              <p className={`text-xs ${subTextClasses}`}>14% lighter overall</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">+$480</div>
              <p className={mutedTextClasses}>Cost Increase</p>
              <p className={`text-xs ${subTextClasses}`}>ROI: 18 months</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">+22%</div>
              <p className={mutedTextClasses}>Sustainability</p>
              <p className={`text-xs ${subTextClasses}`}>Carbon footprint reduction</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">A-</div>
              <p className={mutedTextClasses}>New Efficiency Grade</p>
              <p className={`text-xs ${subTextClasses}`}>Industry leading</p>
            </div>
          </div>
          
          <div className="mt-6 flex gap-4">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Apply All Recommendations
            </Button>
            <Button 
              variant="outline" 
              className={`${isDarkMode ? 'border-gray-500 text-gray-300 hover:bg-gray-700' : 'border-gray-400 text-gray-700 hover:bg-gray-100'}`}
            >
              Generate Cost Analysis
            </Button>
            <Button 
              variant="outline" 
              className={`${isDarkMode ? 'border-gray-500 text-gray-300 hover:bg-gray-700' : 'border-gray-400 text-gray-700 hover:bg-gray-100'}`}
            >
              Export BOM
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialOptimizerTab;
