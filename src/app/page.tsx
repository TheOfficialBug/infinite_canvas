'use client';

import React, { useState } from 'react';
import { Canvas } from '@/components/canvas/Canvas';
import { NodeSidebar } from '@/components/sidebar/NodeSidebar';
import { ModelPanel } from '@/components/panels/ModelPanel';
import { useWorkflowStore } from '@/store/workflowStore';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function WorkflowPage() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const { theme, setTheme } = useTheme();

  // Open panel when a model node is selected
  React.useEffect(() => {
    if (selectedNodeId) {
      const node = useWorkflowStore.getState().getNode(selectedNodeId);
      if (node?.data.nodeType === 'model') {
        setShowPanel(true);
      }
    }
  }, [selectedNodeId]);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-background">
      {/* Top Header */}
      <header className="h-14 border-b border-[--color-border] flex items-center justify-between px-4 bg-[--color-card]/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Infinite Canvas
          </h1>
          <span className="text-sm text-[--color-muted-foreground]">AI Workflow Builder</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {showSidebar && (
          <aside className="w-64 border-r border-[--color-border] flex-shrink-0">
            <NodeSidebar />
          </aside>
        )}

        {/* Canvas */}
        <main className="flex-1 relative">
          <Canvas />
        </main>

        {/* Right Panel */}
        {showPanel && selectedNodeId && (
          <aside className="w-96 border-l border-[--color-border] flex-shrink-0">
            <ModelPanel 
              nodeId={selectedNodeId} 
              onClose={() => setShowPanel(false)} 
            />
          </aside>
        )}
      </div>

      {/* Status Bar */}
      <footer className="h-8 border-t border-[--color-border] flex items-center justify-between px-4 text-xs text-[--color-muted-foreground] bg-[--color-card]/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <span>
            Nodes: {useWorkflowStore.getState().nodes.length}
          </span>
          <span>
            Connections: {useWorkflowStore.getState().edges.length}
          </span>
        </div>
        <div>
          Press <kbd className="px-1.5 py-0.5 rounded bg-[--color-muted]">Ctrl+S</kbd> to save, 
          <kbd className="px-1.5 py-0.5 rounded bg-[--color-muted] ml-1">Del</kbd> to delete,
          <kbd className="px-1.5 py-0.5 rounded bg-[--color-muted] ml-1">Ctrl+D</kbd> to duplicate
        </div>
      </footer>
    </div>
  );
}
