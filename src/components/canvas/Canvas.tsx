'use client';

import React, { useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '@/store/workflowStore';
import { WorkflowNode } from './WorkflowNode';
import { Toolbar } from './Toolbar';
import { useShallow } from 'zustand/react/shallow';

const nodeTypes = {
  default: WorkflowNode,
};

const selector = (state: any) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setViewport: state.setViewport,
});

function CanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setViewport } = 
    useWorkflowStore(useShallow(selector));
  
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      useWorkflowStore.getState().addNode(type as any, position);
    },
    [screenToFlowPosition]
  );

  const onViewportChange = useCallback((viewport: any) => {
    setViewport(viewport);
  }, [setViewport]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected nodes
      if ((e.key === 'Delete' || e.key === 'Backspace') && !e.repeat) {
        const selectedNode = nodes.find((node) => node.selected);
        if (selectedNode) {
          useWorkflowStore.getState().deleteNode(selectedNode.id);
        }
      }

      // Copy selected node
      if (e.ctrlKey && e.key === 'd' && !e.repeat) {
        e.preventDefault();
        const selectedNode = nodes.find((node) => node.selected);
        if (selectedNode) {
          useWorkflowStore.getState().duplicateNode(selectedNode.id);
        }
      }

      // Save workflow
      if (e.ctrlKey && e.key === 's' && !e.repeat) {
        e.preventDefault();
        const workflow = useWorkflowStore.getState().saveWorkflow();
        console.log('Workflow saved:', workflow);
        // You can implement actual save logic here
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes]);

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onViewportChange={onViewportChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={['Delete', 'Backspace']}
        multiSelectionKeyCode="Shift"
        className="bg-background"
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="currentColor"
          className="text-[--color-muted-foreground]/20"
        />
        <Controls 
          className="bg-[--color-card] border border-[--color-border] rounded-lg shadow-lg"
          showInteractive={false}
        />
        <MiniMap 
          className="bg-[--color-card] border border-[--color-border] rounded-lg shadow-lg"
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              agent: '#a855f7',
              model: '#3b82f6',
              chat: '#10b981',
              file: '#f97316',
              tool: '#eab308',
              custom: '#6b7280',
            };
            return colors[node.data.nodeType] || '#6b7280';
          }}
          maskColor="rgb(0, 0, 0, 0.5)"
        />
        <Panel position="top-left">
          <Toolbar />
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
