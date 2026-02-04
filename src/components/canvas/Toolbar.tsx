'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  FolderOpen, 
  Trash2, 
  Undo2, 
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize
} from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { useReactFlow } from 'reactflow';
import { downloadJSON, saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils';
import { toast } from 'react-toastify';

export function Toolbar() {
  const clearWorkflow = useWorkflowStore((state) => state.clearWorkflow);
  const saveWorkflow = useWorkflowStore((state) => state.saveWorkflow);
  const loadWorkflow = useWorkflowStore((state) => state.loadWorkflow);
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const handleSave = () => {
    const workflow = saveWorkflow();
    saveToLocalStorage('workflow', workflow);
    toast.success('Workflow saved!');
  };

  const handleLoad = () => {
    const workflow = loadFromLocalStorage('workflow');
    if (workflow) {
      loadWorkflow(workflow);
      toast.success('Workflow loaded!');
    } else {
      toast.error('No saved workflow found');
    }
  };

  const handleExport = () => {
    const workflow = saveWorkflow();
    downloadJSON(`workflow-${Date.now()}.json`, workflow);
    toast.success('Workflow exported!');
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the canvas?')) {
      clearWorkflow();
      toast.info('Canvas cleared');
    }
  };

  return (
    <Card className="flex items-center gap-2 p-2 shadow-lg">
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleSave}
        title="Save (Ctrl+S)"
      >
        <Save className="w-4 h-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleLoad}
        title="Load"
      >
        <FolderOpen className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border" />

      <Button 
        variant="outline" 
        size="icon"
        onClick={() => zoomIn()}
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => zoomOut()}
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => fitView()}
        title="Fit View"
      >
        <Maximize className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border" />
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleClear}
        title="Clear Canvas"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </Card>
  );
}
