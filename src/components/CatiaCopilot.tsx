
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Upload, Image, Key, Bot } from 'lucide-react';

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
      content: "Hello! I'm your AI-powered CATIA Copilot with Gemini integration. I can help you with CATIA tools, analyze your designs, and provide expert suggestions. You can ask me about any CATIA functionality, upload images for analysis, or get detailed information about specific tools.",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedTool, setSelectedTool] = useState<CatiaTool | null>(null);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const callGeminiAPI = async (prompt: string): Promise<string> => {
    if (!geminiApiKey) {
      return "Please enter your Gemini API key to use AI-powered responses. You can get one from Google AI Studio.";
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a CATIA expert assistant. Answer the following question about CATIA tools, workflows, or design optimization: ${prompt}`
            }]
          }]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Gemini API');
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      return "I'm having trouble connecting to the AI service. Please check your API key and try again.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: CatiaMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Get AI response
    const aiResponse = await callGeminiAPI(inputMessage);
    
    const assistantMessage: CatiaMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
    setInputMessage('');
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setIsLoading(true);

      const analysisPrompt = "Analyze this engineering/design image and suggest relevant CATIA tools and workflows that could be used to create or improve this design. Focus on specific CATIA workbenches and features.";
      const aiResponse = await callGeminiAPI(analysisPrompt);
      
      const assistantMessage: CatiaMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }
  };

  const handleToolSelection = (tool: CatiaTool) => {
    setSelectedTool(tool);
    const message = `Tell me more about ${tool.name} and provide advanced tips for using it effectively`;
    setInputMessage(message);
  };

  return (
    <div className="space-y-6">
      {/* API Key Input */}
      <Card className="bg-white/10 border-orange-300/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Key className="h-5 w-5" />
            Gemini API Configuration
          </CardTitle>
          <CardDescription className="text-orange-200">
            Enter your Gemini API key to enable AI-powered CATIA assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="bg-white/5 border-orange-300/30 text-white placeholder-orange-300/70"
            />
            <Button
              onClick={() => window.open('https://makersuite.google.com/app/apikey', '_blank')}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Get API Key
            </Button>
          </div>
        </CardContent>
      </Card>

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

      {/* AI Chat Interface */}
      <Card className="bg-white/10 border-orange-300/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI-Powered CATIA Assistant
          </CardTitle>
          <CardDescription className="text-orange-200">
            Ask me anything about CATIA tools, upload images for analysis, or get expert design suggestions
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
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-orange-100 max-w-[80%] p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-400"></div>
                    <p className="text-sm">AI is thinking...</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              placeholder="Ask about CATIA tools, workflows, or best practices..."
              className="flex-1 p-3 rounded-lg bg-white/5 border border-orange-300/30 text-white placeholder-orange-300/70 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isLoading}
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
              disabled={isLoading}
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSendMessage}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6"
              disabled={isLoading || !inputMessage.trim()}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("What are the advanced features of Part Design workbench?")}
              className="border-orange-300/30 text-orange-200 hover:bg-orange-600/20"
              disabled={isLoading}
            >
              Advanced Part Design
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("How do I optimize assembly performance in CATIA?")}
              className="border-orange-300/30 text-orange-200 hover:bg-orange-600/20"
              disabled={isLoading}
            >
              Assembly Optimization
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("Best practices for surface modeling workflow")}
              className="border-orange-300/30 text-orange-200 hover:bg-orange-600/20"
              disabled={isLoading}
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
