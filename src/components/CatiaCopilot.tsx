
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Upload, Image, FileImage } from 'lucide-react';

interface CatiaMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
}

interface CatiaTool {
  name: string;
  category: string;
  description: string;
  usage: string;
  benefits: string[];
}

const CATIA_TOOLS: CatiaTool[] = [
  {
    name: "Part Design Workbench",
    category: "Modeling",
    description: "The Part Design workbench is used for creating solid parts using sketch-based features. It's the foundation for most CATIA modeling work.",
    usage: "Create sketches on planes, then use operations like Pad, Pocket, Shaft, Groove, and more to build 3D geometry from 2D sketches.",
    benefits: ["Parametric modeling", "Feature-based design", "History tree management", "Design intent capture"]
  },
  {
    name: "Assembly Design Workbench",
    category: "Assembly",
    description: "Assembly Design allows you to create and manage complex assemblies with multiple parts, constraints, and motion studies.",
    usage: "Insert parts and sub-assemblies, apply constraints (coincidence, contact, offset), create exploded views, and analyze assembly motion.",
    benefits: ["Constraint-based assembly", "Interference detection", "Motion simulation", "Bill of materials generation"]
  },
  {
    name: "Generative Shape Design",
    category: "Surface",
    description: "GSD is a powerful surface modeling workbench for creating complex curved surfaces and wireframe geometry.",
    usage: "Create surfaces using sweep, loft, fill, blend operations. Build wireframe elements like splines, curves, and points for advanced geometry.",
    benefits: ["Complex surface creation", "Class-A surfacing", "Wireframe modeling", "Advanced curve operations"]
  },
  {
    name: "Sketcher Workbench",
    category: "2D Design",
    description: "The Sketcher is the foundation for creating 2D profiles that serve as the basis for 3D features in Part Design.",
    usage: "Draw lines, arcs, circles, splines. Apply geometric and dimensional constraints to fully define sketch geometry.",
    benefits: ["Constraint-based sketching", "Parametric 2D design", "Geometric relationships", "Robust sketch solving"]
  },
  {
    name: "DMU Kinematics",
    category: "Simulation",
    description: "DMU Kinematics allows you to simulate and analyze the motion of mechanical assemblies and mechanisms.",
    usage: "Define joints between parts, create kinematic mechanisms, simulate motion, detect collisions, and generate motion studies.",
    benefits: ["Motion simulation", "Collision detection", "Mechanism analysis", "Animation creation"]
  }
];

const CatiaCopilot = () => {
  const [messages, setMessages] = useState<CatiaMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your CATIA Copilot. I can help you with CATIA tools, analyze your designs, and provide suggestions. You can ask me about any CATIA functionality, upload images for analysis, or get detailed information about specific tools.",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedTool, setSelectedTool] = useState<CatiaTool | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: CatiaMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const response = generateCatiaResponse(inputMessage);
      const assistantMessage: CatiaMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);

    setInputMessage('');
  };

  const generateCatiaResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('part design')) {
      return "Part Design is CATIA's core solid modeling workbench. Key features include: Sketcher for 2D profiles, Pad/Pocket for extrusions, Shaft/Groove for revolutions, Boolean operations, Fillets/Chamfers, Patterns, and the Feature Tree for parametric history. Would you like me to explain any specific Part Design operation?";
    }
    
    if (lowerQuestion.includes('assembly')) {
      return "Assembly Design in CATIA manages complex product structures. Key capabilities: Constraint-based assembly (Coincidence, Contact, Offset, Angle, Fix), Interference detection, Exploded views, Section cuts, DMU Navigator for large assemblies, and Bills of Materials. Need help with specific assembly constraints?";
    }
    
    if (lowerQuestion.includes('surface') || lowerQuestion.includes('gsd')) {
      return "Generative Shape Design (GSD) creates complex surfaces and wireframes. Main tools: Sweep, Loft, Fill, Blend for surfaces; Spline, Helix, Intersection for curves; Join, Healing, Extrapolate for surface operations. Essential for automotive and aerospace Class-A surfacing.";
    }
    
    if (lowerQuestion.includes('sketch')) {
      return "Sketcher is fundamental to CATIA modeling. Core elements: Geometric elements (lines, arcs, circles, splines), Constraints (horizontal, vertical, parallel, perpendicular, tangent), Dimensions (length, radius, angle), and Operations (trim, extend, offset). Fully constrained sketches ensure robust parametric models.";
    }
    
    if (lowerQuestion.includes('simulation') || lowerQuestion.includes('analysis')) {
      return "CATIA offers multiple simulation tools: DMU Kinematics for motion analysis, GPS for tolerance analysis, CATIA Analysis for FEA, Interference Detection, Clash Detection, and DMU Review for design validation. Which type of analysis are you interested in?";
    }
    
    return `I understand you're asking about "${question}". CATIA has extensive capabilities in this area. Could you be more specific about what aspect you'd like to explore? I can provide detailed guidance on any CATIA workbench, tool, or workflow.`;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      const userMessage: CatiaMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: "I've uploaded an image for analysis. Can you help me identify potential improvements or CATIA tools that could be useful?",
        image: url,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);

      // Simulate AI image analysis response
      setTimeout(() => {
        const assistantMessage: CatiaMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "Based on your uploaded image, I can suggest several CATIA approaches: 1) If this is a mechanical part, use Part Design for solid modeling. 2) For complex curves, consider Generative Shape Design. 3) For assembly components, plan your constraint strategy in Assembly Design. 4) Consider using Sketcher to recreate key profiles. Would you like specific guidance on any of these approaches?",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }, 1500);
    }
  };

  const handleToolSelection = (tool: CatiaTool) => {
    setSelectedTool(tool);
    const message = `Tell me more about ${tool.name}`;
    setInputMessage(message);
  };

  return (
    <div className="space-y-6">
      {/* CATIA Tools Overview */}
      <Card className="bg-white/10 border-orange-300/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            🔧 CATIA Tools Overview
          </CardTitle>
          <CardDescription className="text-orange-200">
            Explore 5 essential CATIA workbenches and their capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATIA_TOOLS.map((tool, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg bg-white/5 border border-orange-300/20 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => handleToolSelection(tool)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white text-sm">{tool.name}</h4>
                  <Badge className="bg-orange-600 text-white text-xs">
                    {tool.category}
                  </Badge>
                </div>
                <p className="text-orange-200 text-xs mb-3">{tool.description}</p>
                <div className="space-y-1">
                  {tool.benefits.slice(0, 2).map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                      <span className="text-orange-300 text-xs">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="bg-white/10 border-orange-300/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            🤖 CATIA Copilot Chat
          </CardTitle>
          <CardDescription className="text-orange-200">
            Ask me anything about CATIA tools, upload images for analysis, or get design suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Messages */}
          <div className="h-64 overflow-y-auto mb-4 space-y-3 bg-black/20 rounded-lg p-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-white/10 text-orange-100'
                }`}>
                  {message.image && (
                    <img 
                      src={message.image} 
                      alt="Uploaded" 
                      className="max-w-full h-32 object-cover rounded mb-2"
                    />
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about CATIA tools, workflows, or best practices..."
              className="flex-1 p-3 rounded-lg bg-white/5 border border-orange-300/30 text-white placeholder-orange-300/70 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4"
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSendMessage}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("What are the best practices for Part Design?")}
              className="border-orange-300/30 text-orange-200 hover:bg-orange-600/20"
            >
              Part Design Tips
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("How do I create complex assemblies?")}
              className="border-orange-300/30 text-orange-200 hover:bg-orange-600/20"
            >
              Assembly Guide
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("Surface modeling workflow in CATIA")}
              className="border-orange-300/30 text-orange-200 hover:bg-orange-600/20"
            >
              Surface Modeling
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tool Detail Modal */}
      {selectedTool && (
        <Card className="bg-white/10 border-orange-300/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">{selectedTool.name}</CardTitle>
            <Badge className="bg-orange-600 text-white w-fit">
              {selectedTool.category}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-orange-300 font-semibold mb-2">Description</h4>
                <p className="text-orange-100 text-sm">{selectedTool.description}</p>
              </div>
              <div>
                <h4 className="text-orange-300 font-semibold mb-2">Usage</h4>
                <p className="text-orange-100 text-sm">{selectedTool.usage}</p>
              </div>
              <div>
                <h4 className="text-orange-300 font-semibold mb-2">Key Benefits</h4>
                <ul className="space-y-1">
                  {selectedTool.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-orange-100 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                onClick={() => setSelectedTool(null)}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CatiaCopilot;
