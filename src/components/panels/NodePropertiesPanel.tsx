'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useWorkflowStore } from '@/store/workflowStore';
import { X, Save, Play } from 'lucide-react';
import type { WorkflowNode } from '@/types/workflow';

interface NodePropertiesPanelProps {
  nodeId: string;
  onClose: () => void;
}

export function NodePropertiesPanel({ nodeId, onClose }: NodePropertiesPanelProps) {
  const node = useWorkflowStore((state) => state.getNode(nodeId));
  const updateNode = useWorkflowStore((state) => state.updateNode);

  const [label, setLabel] = useState(node?.data.label || '');
  const [description, setDescription] = useState(node?.data.description || '');

  if (!node) return null;

  const handleSave = () => {
    updateNode(nodeId, { label, description });
    onClose();
  };

  return (
    <Card className="w-80 shadow-lg">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3 border-b">
        <CardTitle className="text-lg">Node Properties</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <Badge>{node.data.nodeType}</Badge>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Label</label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Node label"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Node description"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Badge variant={
            node.data.status === 'success' ? 'success' :
            node.data.status === 'error' ? 'destructive' :
            node.data.status === 'running' ? 'warning' : 'secondary'
          }>
            {node.data.status}
          </Badge>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ports</label>
          <div className="space-y-1">
            {node.data.ports.map((port) => (
              <div key={port.id} className="text-xs flex items-center justify-between">
                <span>{port.label}</span>
                <Badge variant="outline" className="text-xs">
                  {port.type}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
