import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges, Connection, NodeChange, EdgeChange, XYPosition } from 'reactflow';
import { nanoid } from 'nanoid';
import type { WorkflowNode, WorkflowState, NodeType, Port, WorkflowNodeData, NodeStatus } from '@/types/workflow';

interface WorkflowStore {
  // State
  nodes: WorkflowNode[];
  edges: any[];
  selectedNodeId: string | null;
  viewport: { x: number; y: number; zoom: number };
  
  // Node actions
  addNode: (type: NodeType, position: XYPosition) => void;
  updateNode: (id: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  updateNodeStatus: (id: string, status: NodeStatus, error?: string) => void;
  updateNodeOutput: (id: string, output: any) => void;
  
  // Edge actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  deleteEdge: (id: string) => void;
  
  // Viewport
  setViewport: (viewport: { x: number; y: number; zoom: number }) => void;
  
  // Persistence
  saveWorkflow: () => WorkflowState;
  loadWorkflow: (state: WorkflowState) => void;
  clearWorkflow: () => void;
  
  // Utilities
  getNode: (id: string) => WorkflowNode | undefined;
  getConnectedNodes: (nodeId: string) => { inputs: WorkflowNode[]; outputs: WorkflowNode[] };
}

const createDefaultPorts = (type: NodeType): Port[] => {
  switch (type) {
    case 'model':
      return [
        { id: 'input-prompt', type: 'input', label: 'Prompt', dataType: 'string' },
        { id: 'input-context', type: 'input', label: 'Context', dataType: 'any' },
        { id: 'output-response', type: 'output', label: 'Response', dataType: 'string' },
      ];
    case 'agent':
      return [
        { id: 'input-task', type: 'input', label: 'Task', dataType: 'string' },
        { id: 'input-tools', type: 'input', label: 'Tools', dataType: 'array' },
        { id: 'output-result', type: 'output', label: 'Result', dataType: 'any' },
        { id: 'output-reasoning', type: 'output', label: 'Reasoning', dataType: 'string' },
      ];
    case 'chat':
      return [
        { id: 'input-message', type: 'input', label: 'Message', dataType: 'string' },
        { id: 'output-response', type: 'output', label: 'Response', dataType: 'string' },
      ];
    case 'file':
      return [
        { id: 'output-content', type: 'output', label: 'Content', dataType: 'string' },
      ];
    case 'tool':
      return [
        { id: 'input-params', type: 'input', label: 'Parameters', dataType: 'object' },
        { id: 'output-result', type: 'output', label: 'Result', dataType: 'any' },
      ];
    default:
      return [
        { id: 'input-data', type: 'input', label: 'Input', dataType: 'any' },
        { id: 'output-data', type: 'output', label: 'Output', dataType: 'any' },
      ];
  }
};

const createNodeLabel = (type: NodeType): string => {
  const labels: Record<NodeType, string> = {
    agent: 'AI Agent',
    model: 'AI Model',
    chat: 'Chat',
    file: 'File',
    tool: 'Tool',
    custom: 'Custom Node',
  };
  return labels[type];
};

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  viewport: { x: 0, y: 0, zoom: 1 },

  addNode: (type: NodeType, position: XYPosition) => {
    const newNode: WorkflowNode = {
      id: nanoid(),
      type: 'default',
      position,
      data: {
        label: createNodeLabel(type),
        description: '',
        nodeType: type,
        status: 'idle',
        ports: createDefaultPorts(type),
        config: {},
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  updateNode: (id: string, data: Partial<WorkflowNodeData>) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });
  },

  deleteNode: (id: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
      edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },

  duplicateNode: (id: string) => {
    const node = get().nodes.find((n) => n.id === id);
    if (!node) return;

    const newNode: WorkflowNode = {
      ...node,
      id: nanoid(),
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
      data: {
        ...node.data,
        label: `${node.data.label} (Copy)`,
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  setSelectedNode: (id: string | null) => {
    set({ selectedNodeId: id });
  },

  updateNodeStatus: (id: string, status: NodeStatus, error?: string) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, status, error: error || undefined } }
          : node
      ),
    });
  },

  updateNodeOutput: (id: string, output: any) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, output } } : node
      ),
    });
  },

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          id: nanoid(),
          type: 'smoothstep',
          animated: true,
        },
        get().edges
      ),
    });
  },

  deleteEdge: (id: string) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== id),
    });
  },

  setViewport: (viewport: { x: number; y: number; zoom: number }) => {
    set({ viewport });
  },

  saveWorkflow: () => {
    const state = get();
    return {
      name: 'Workflow',
      nodes: state.nodes,
      edges: state.edges,
      viewport: state.viewport,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  },

  loadWorkflow: (state: WorkflowState) => {
    set({
      nodes: state.nodes,
      edges: state.edges,
      viewport: state.viewport,
      selectedNodeId: null,
    });
  },

  clearWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      viewport: { x: 0, y: 0, zoom: 1 },
    });
  },

  getNode: (id: string) => {
    return get().nodes.find((node) => node.id === id);
  },

  getConnectedNodes: (nodeId: string) => {
    const edges = get().edges;
    const nodes = get().nodes;
    
    const inputEdges = edges.filter((edge) => edge.target === nodeId);
    const outputEdges = edges.filter((edge) => edge.source === nodeId);
    
    return {
      inputs: inputEdges
        .map((edge) => nodes.find((node) => node.id === edge.source))
        .filter(Boolean) as WorkflowNode[],
      outputs: outputEdges
        .map((edge) => nodes.find((node) => node.id === edge.target))
        .filter(Boolean) as WorkflowNode[],
    };
  },
}));
