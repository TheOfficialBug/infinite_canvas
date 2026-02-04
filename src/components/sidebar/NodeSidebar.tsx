'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { 
  Brain, 
  MessageSquare, 
  FileText, 
  Wrench, 
  Bot,
  Circle
} from 'lucide-react';
import type { NodeType } from '@/types/workflow';

const nodeCategories = [
  {
    title: 'AI Components',
    nodes: [
      {
        type: 'agent' as NodeType,
        label: 'AI Agent',
        icon: <Bot className="w-5 h-5" />,
        description: 'Autonomous agent with reasoning',
        color: 'text-purple-500',
      },
      {
        type: 'model' as NodeType,
        label: 'AI Model',
        icon: <Brain className="w-5 h-5" />,
        description: 'Language model for prompts',
        color: 'text-blue-500',
      },
      {
        type: 'chat' as NodeType,
        label: 'Chat',
        icon: <MessageSquare className="w-5 h-5" />,
        description: 'Interactive conversation',
        color: 'text-green-500',
      },
    ],
  },
  {
    title: 'Data & Tools',
    nodes: [
      {
        type: 'file' as NodeType,
        label: 'File',
        icon: <FileText className="w-5 h-5" />,
        description: 'Document or data source',
        color: 'text-orange-500',
      },
      {
        type: 'tool' as NodeType,
        label: 'Tool',
        icon: <Wrench className="w-5 h-5" />,
        description: 'Custom function or API',
        color: 'text-yellow-500',
      },
      {
        type: 'custom' as NodeType,
        label: 'Custom',
        icon: <Circle className="w-5 h-5" />,
        description: 'Custom node type',
        color: 'text-gray-500',
      },
    ],
  },
];

export function NodeSidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card className="w-64 h-full shadow-lg border-r">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Nodes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="space-y-4 p-4">
            {nodeCategories.map((category) => (
              <div key={category.title}>
                <h3 className="text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wider mb-2">
                  {category.title}
                </h3>
                <div className="space-y-2">
                  {category.nodes.map((node) => (
                    <div
                      key={node.type}
                      draggable
                      onDragStart={(e) => onDragStart(e, node.type)}
                      className="flex items-start gap-3 p-3 rounded-lg border border-[--color-border] bg-[--color-card] hover:bg-[--color-accent] transition-colors cursor-move group"
                    >
                      <div className={`${node.color} group-hover:scale-110 transition-transform`}>
                        {node.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{node.label}</div>
                        <div className="text-xs text-[--color-muted-foreground] line-clamp-2">
                          {node.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
