
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Eye, Hand, Zap } from 'lucide-react';

interface ErgonomicsTabProps {
  isDarkMode?: boolean;
}

const ErgonomicsTab = ({ isDarkMode = true }: ErgonomicsTabProps) => {
  const ergonomicsData = [
    { metric: "Driver Visibility", score: 85, status: "Good", color: "bg-green-500" },
    { metric: "Seat Comfort", score: 92, status: "Excellent", color: "bg-blue-500" },
    { metric: "Control Reach", score: 78, status: "Adequate", color: "bg-yellow-500" },
    { metric: "Entry/Exit Ease", score: 71, status: "Needs Work", color: "bg-red-500" }
  ];

  const recommendations = [
    {
      area: "Dashboard Layout",
      suggestion: "Relocate climate controls 2cm closer to driver",
      impact: "Medium",
      icon: <Hand className="h-4 w-4" />
    },
    {
      area: "Seat Position", 
      suggestion: "Adjust lumbar support angle by 3 degrees",
      impact: "High",
      icon: <User className="h-4 w-4" />
    },
    {
      area: "Mirror Positioning",
      suggestion: "Optimize blind spot coverage with wider mirrors", 
      impact: "High",
      icon: <Eye className="h-4 w-4" />
    }
  ];

  const cardClasses = isDarkMode
    ? 'bg-gray-800 border-gray-700 text-gray-100'
    : 'bg-gray-50 border-gray-200 text-gray-900';

  const textClasses = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const mutedTextClasses = isDarkMode ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={cardClasses}>
          <CardHeader>
            <CardTitle className={`${textClasses} flex items-center gap-2`}>
              <User className="h-5 w-5" />
              Ergonomic Scores
            </CardTitle>
            <CardDescription className={mutedTextClasses}>
              Human factors analysis based on SAE standards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ergonomicsData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`${textClasses} text-sm font-medium`}>{item.metric}</span>
                  <Badge variant="outline" className={`${isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-400 text-gray-700'}`}>
                    {item.score}%
                  </Badge>
                </div>
                <Progress value={item.score} className="h-2" />
                <span className={`text-xs px-2 py-1 rounded ${item.color} text-white`}>
                  {item.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={cardClasses}>
          <CardHeader>
            <CardTitle className={textClasses}>Anthropometric Analysis</CardTitle>
            <CardDescription className={mutedTextClasses}>
              Fit analysis for 5th-95th percentile users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`flex justify-between items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <span className={mutedTextClasses}>95th Percentile Male</span>
                <Badge className="bg-green-600 text-white">Compatible</Badge>
              </div>
              <div className={`flex justify-between items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <span className={mutedTextClasses}>5th Percentile Female</span>
                <Badge className="bg-yellow-600 text-white">Marginal</Badge>
              </div>
              <div className={`flex justify-between items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <span className={mutedTextClasses}>Wheelchair Access</span>
                <Badge className="bg-red-600 text-white">Not Assessed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className={cardClasses}>
        <CardHeader>
          <CardTitle className={`${textClasses} flex items-center gap-2`}>
            <Zap className="h-5 w-5" />
            Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {rec.icon}
                  <h4 className={`font-semibold ${textClasses}`}>{rec.area}</h4>
                </div>
                <p className={`${mutedTextClasses} text-sm mb-3`}>{rec.suggestion}</p>
                <Badge 
                  className={`${rec.impact === 'High' ? 'bg-red-500' : 'bg-yellow-500'} text-white`}
                >
                  {rec.impact} Impact
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Generate Report
            </Button>
            <Button variant="outline" className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-400 text-gray-700 hover:bg-gray-100'}`}>
              Export to CAD
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErgonomicsTab;
