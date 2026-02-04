'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@radix-ui/react-label';
import { Slider } from '@radix-ui/react-slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { useWorkflowStore } from '@/store/workflowStore';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Settings, 
  MessageSquare, 
  X,
  Sparkles
} from 'lucide-react';
import type { ModelConfig, ChatMessage } from '@/types/workflow';

interface ModelPanelProps {
  nodeId: string;
  onClose: () => void;
}

export function ModelPanel({ nodeId, onClose }: ModelPanelProps) {
  const node = useWorkflowStore((state) => state.getNode(nodeId));
  const updateNode = useWorkflowStore((state) => state.updateNode);
  const updateNodeStatus = useWorkflowStore((state) => state.updateNodeStatus);
  const updateNodeOutput = useWorkflowStore((state) => state.updateNodeOutput);

  const [config, setConfig] = useState<ModelConfig>(
    node?.data.config as ModelConfig || {
      systemPrompt: '',
      userPrompt: '',
      temperature: 0.7,
      maxTokens: 2000,
      model: 'gpt-4',
      tools: [],
    }
  );

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleConfigChange = (key: keyof ModelConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    updateNode(nodeId, { config: newConfig });
  };

  const handleRun = async () => {
    setIsRunning(true);
    updateNodeStatus(nodeId, 'running');

    try {
      // Simulate AI model call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const response = `This is a simulated response to: "${config.userPrompt}"\n\nModel: ${config.model}\nTemperature: ${config.temperature}`;
      
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      setMessages([...messages, newMessage]);
      updateNodeOutput(nodeId, response);
      updateNodeStatus(nodeId, 'success');
    } catch (error) {
      updateNodeStatus(nodeId, 'error', 'Failed to run model');
    } finally {
      setIsRunning(false);
    }
  };

  if (!node) return null;

  return (
    <Card className="w-96 h-full shadow-2xl border-l flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3 border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <CardTitle className="text-lg">{node.data.label}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <Tabs defaultValue="config" className="h-full flex flex-col">
          <TabsList className="border-b px-4">
            <TabsTrigger value="config" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Settings className="w-4 h-4 mr-2" />
              Config
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <MessageSquare className="w-4 h-4 mr-2" />
              Output
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="flex-1 overflow-hidden mt-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Model</Label>
                  <select 
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={config.model}
                    onChange={(e) => handleConfigChange('model', e.target.value)}
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3">Claude 3</option>
                    <option value="gemini-pro">Gemini Pro</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">System Prompt</Label>
                  <Textarea
                    placeholder="Set the model's behavior and context..."
                    value={config.systemPrompt}
                    onChange={(e) => handleConfigChange('systemPrompt', e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">User Prompt</Label>
                  <Textarea
                    placeholder="Your prompt to the model..."
                    value={config.userPrompt}
                    onChange={(e) => handleConfigChange('userPrompt', e.target.value)}
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-sm font-medium">Temperature</Label>
                    <span className="text-sm text-muted-foreground">
                      {config.temperature?.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={config.temperature}
                    onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Max Tokens</Label>
                  <Input
                    type="number"
                    value={config.maxTokens}
                    onChange={(e) => handleConfigChange('maxTokens', parseInt(e.target.value))}
                  />
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleRun}
                  disabled={isRunning || !config.userPrompt}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isRunning ? 'Running...' : 'Run Model'}
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="chat" className="flex-1 overflow-hidden mt-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-[--color-muted-foreground] text-sm py-8">
                    No output yet. Run the model to see results.
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{message.role}</Badge>
                        <span className="text-xs text-[--color-muted-foreground]">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-[--color-muted] text-sm whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
