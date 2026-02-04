'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Brain, 
  MessageSquare, 
  FileText, 
  Wrench, 
  Bot,
  Circle,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import type { WorkflowNodeData, NodeType } from '@/types/workflow';

const nodeIcons: Record<NodeType, React.ReactNode> = {
  agent: <Bot className="w-5 h-5" />,
  model: <Brain className="w-5 h-5" />,
  chat: <MessageSquare className="w-5 h-5" />,
  file: <FileText className="w-5 h-5" />,
  tool: <Wrench className="w-5 h-5" />,
  custom: <Circle className="w-5 h-5" />,
};

const statusIcons = {
  idle: <Circle className="w-4 h-4 text-[--color-muted-foreground]" />,
  running: <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />,
  success: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  error: <AlertCircle className="w-4 h-4 text-red-500" />,
};

const nodeColors: Record<NodeType, string> = {
  agent: 'border-purple-500/50 bg-purple-500/10',
  model: 'border-blue-500/50 bg-blue-500/10',
  chat: 'border-green-500/50 bg-green-500/10',
  file: 'border-orange-500/50 bg-orange-500/10',
  tool: 'border-yellow-500/50 bg-yellow-500/10',
  custom: 'border-gray-500/50 bg-gray-500/10',
};

export const WorkflowNode = memo(({ data, selected }: NodeProps<WorkflowNodeData>) => {
  const inputPorts = data.ports.filter((p) => p.type === 'input');
  const outputPorts = data.ports.filter((p) => p.type === 'output');

  return (
    <Card
      className={cn(
        'min-w-[200px] max-w-[300px] border-2 transition-all duration-200',
        nodeColors[data.nodeType],
        selected && 'ring-2 ring-primary shadow-lg'
      )}
    >
      {/* Input Handles */}
      {inputPorts.map((port, index) => (
        <Handle
          key={port.id}
          type="target"
          position={Position.Left}
          id={port.id}
          style={{
            top: `${((index + 1) * 100) / (inputPorts.length + 1)}%`,
            background: '#6366f1',
            width: '12px',
            height: '12px',
            border: '2px solid white',
          }}
          className="transition-all hover:scale-125"
        />
      ))}

      {/* Node Header */}
      <div className="flex items-center gap-2 p-3 border-b border-[--color-border]/50">
        <div className="text-[--color-primary]">{nodeIcons[data.nodeType]}</div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{data.label}</div>
        </div>
        <div>{statusIcons[data.status]}</div>
      </div>

      {/* Node Body */}
      <div className="p-3 space-y-2">
        {data.description && (
          <p className="text-xs text-[--color-muted-foreground] line-clamp-2">
            {data.description}
          </p>
        )}
        
        {/* Port Labels */}
        <div className="space-y-1">
          {inputPorts.length > 0 && (
            <div className="text-xs text-[--color-muted-foreground]">
              {inputPorts.map((port) => (
                <div key={port.id} className="truncate">
                  ← {port.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {data.error && (
          <Badge variant="destructive" className="text-xs w-full justify-center">
            Error
          </Badge>
        )}
      </div>

      {/* Output Handles */}
      {outputPorts.map((port, index) => (
        <Handle
          key={port.id}
          type="source"
          position={Position.Right}
          id={port.id}
          style={{
            top: `${((index + 1) * 100) / (outputPorts.length + 1)}%`,
            background: '#10b981',
            width: '12px',
            height: '12px',
            border: '2px solid white',
          }}
          className="transition-all hover:scale-125"
        />
      ))}
    </Card>
  );
});

WorkflowNode.displayName = 'WorkflowNode';
