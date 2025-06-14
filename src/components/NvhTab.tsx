
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Volume2, Vibrate, TrendingDown, AlertCircle } from 'lucide-react';

interface NvhTabProps {
  isDarkMode?: boolean;
}

const NvhTab = ({ isDarkMode = true }: NvhTabProps) => {
  const noiseMetrics = [
    { frequency: "50-200 Hz", level: 45, target: 40, status: "Over Target" },
    { frequency: "200-500 Hz", level: 38, target: 42, status: "Within Target" },
    { frequency: "500-2000 Hz", level: 52, target: 48, status: "Over Target" },
    { frequency: "2000+ Hz", level: 35, target: 38, status: "Within Target" }
  ];

  const vibrationData = [
    { component: "Engine Mount", level: 0.8, threshold: 1.0, status: "Good" },
    { component: "Suspension", level: 1.2, threshold: 1.0, status: "Elevated" },
    { component: "Drivetrain", level: 0.6, threshold: 0.8, status: "Excellent" },
    { component: "Body Panel", level: 0.9, threshold: 0.7, status: "High" }
  ];

  const solutions = [
    {
      issue: "Engine Noise at 150Hz",
      solution: "Add acoustic barrier in firewall",
      reduction: "8 dB",
      cost: "Medium"
    },
    {
      issue: "Road Noise Intrusion", 
      solution: "Improve door seal design",
      reduction: "5 dB",
      cost: "Low"
    },
    {
      issue: "Suspension Vibration",
      solution: "Optimize bushing durometer",
      reduction: "15%",
      cost: "Low"
    }
  ];

  const cardClasses = isDarkMode
    ? 'bg-gray-800 border-gray-700 text-gray-100'
    : 'bg-gray-50 border-gray-200 text-gray-900';

  const textClasses = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const mutedTextClasses = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const subTextClasses = isDarkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={cardClasses}>
          <CardHeader>
            <CardTitle className={`${textClasses} flex items-center gap-2`}>
              <Volume2 className="h-5 w-5" />
              Noise Analysis
            </CardTitle>
            <CardDescription className={mutedTextClasses}>
              Sound pressure levels by frequency band (dB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {noiseMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`${textClasses} text-sm`}>{metric.frequency}</span>
                  <div className="flex items-center gap-2">
                    <span className={`${mutedTextClasses} text-sm`}>{metric.level} dB</span>
                    <Badge 
                      variant={metric.status === "Within Target" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {metric.status}
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={(metric.level / 60) * 100} 
                  className="h-2"
                />
                <div className={`text-xs ${subTextClasses}`}>Target: {metric.target} dB</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={cardClasses}>
          <CardHeader>
            <CardTitle className={`${textClasses} flex items-center gap-2`}>
              <Vibrate className="h-5 w-5" />
              Vibration Analysis
            </CardTitle>
            <CardDescription className={mutedTextClasses}>
              Component vibration levels (m/s²)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {vibrationData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`${textClasses} text-sm`}>{item.component}</span>
                  <div className="flex items-center gap-2">
                    <span className={`${mutedTextClasses} text-sm`}>{item.level} m/s²</span>
                    <Badge 
                      className={`${
                        item.status === 'Excellent' ? 'bg-green-600' :
                        item.status === 'Good' ? 'bg-blue-600' :
                        item.status === 'Elevated' ? 'bg-yellow-600' : 'bg-red-600'
                      } text-white`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={(item.level / 2.0) * 100} 
                  className="h-2"
                />
                <div className={`text-xs ${subTextClasses}`}>Threshold: {item.threshold} m/s²</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className={cardClasses}>
        <CardHeader>
          <CardTitle className={`${textClasses} flex items-center gap-2`}>
            <TrendingDown className="h-5 w-5" />
            NVH Optimization Solutions
          </CardTitle>
          <CardDescription className={mutedTextClasses}>
            Targeted improvements for noise and vibration reduction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {solutions.map((solution, index) => (
              <div key={index} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${textClasses} text-sm`}>{solution.issue}</h4>
                    <p className={`${mutedTextClasses} text-xs mt-1`}>{solution.solution}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Badge className="bg-green-600 text-white">
                    -{solution.reduction}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`${isDarkMode ? 'border-gray-500' : 'border-gray-400'} ${
                      solution.cost === 'Low' ? 'text-green-400' :
                      solution.cost === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}
                  >
                    {solution.cost} Cost
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div className={`mt-6 p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
            <h4 className={`${textClasses} font-semibold mb-2 flex items-center gap-2`}>
              <Volume2 className="h-4 w-4" />
              Overall NVH Score
            </h4>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={73} className="h-3" />
              </div>
              <span className={`${textClasses} font-bold text-lg`}>73/100</span>
            </div>
            <p className={`${mutedTextClasses} text-sm mt-2`}>
              Good performance with room for improvement in suspension and engine isolation
            </p>
          </div>

          <div className="mt-6 flex gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Run Full Simulation
            </Button>
            <Button 
              variant="outline" 
              className={`${isDarkMode ? 'border-gray-500 text-gray-300 hover:bg-gray-700' : 'border-gray-400 text-gray-700 hover:bg-gray-100'}`}
            >
              Export Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NvhTab;
