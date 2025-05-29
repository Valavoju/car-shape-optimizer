
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Volume2, Vibrate, TrendingDown, AlertCircle } from 'lucide-react';

const NvhTab = () => {
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

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 border-blue-300/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Noise Analysis
            </CardTitle>
            <CardDescription className="text-blue-200">
              Sound pressure levels by frequency band (dB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {noiseMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm">{metric.frequency}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-200 text-sm">{metric.level} dB</span>
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
                <div className="text-xs text-blue-300">Target: {metric.target} dB</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-blue-300/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Vibrate className="h-5 w-5" />
              Vibration Analysis
            </CardTitle>
            <CardDescription className="text-blue-200">
              Component vibration levels (m/s²)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {vibrationData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm">{item.component}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-200 text-sm">{item.level} m/s²</span>
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
                <div className="text-xs text-blue-300">Threshold: {item.threshold} m/s²</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/10 border-blue-300/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            NVH Optimization Solutions
          </CardTitle>
          <CardDescription className="text-blue-200">
            Targeted improvements for noise and vibration reduction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {solutions.map((solution, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg border border-blue-300/20">
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-sm">{solution.issue}</h4>
                    <p className="text-blue-200 text-xs mt-1">{solution.solution}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Badge className="bg-green-600 text-white">
                    -{solution.reduction}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`border-blue-300/50 ${
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
          
          <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-400/30">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Overall NVH Score
            </h4>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={73} className="h-3" />
              </div>
              <span className="text-white font-bold text-lg">73/100</span>
            </div>
            <p className="text-blue-200 text-sm mt-2">
              Good performance with room for improvement in suspension and engine isolation
            </p>
          </div>

          <div className="mt-6 flex gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Run Full Simulation
            </Button>
            <Button variant="outline" className="border-blue-300/50 text-blue-200 hover:bg-white/10">
              Export Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NvhTab;
