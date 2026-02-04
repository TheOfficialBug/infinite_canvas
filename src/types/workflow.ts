import { Node, Edge } from 'reactflow';

export type NodeStatus = 'idle' | 'running' | 'success' | 'error';

export type NodeType = 'agent' | 'model' | 'chat' | 'file' | 'tool' | 'custom';

export interface Port {
  id: string;
  type: 'input' | 'output';
  label: string;
  dataType?: string;
}

export interface WorkflowNodeData {
  label: string;
  description?: string;
  nodeType: NodeType;
  status: NodeStatus;
  ports: Port[];
  config?: Record<string, any>;
  output?: any;
  error?: string;
}

export type WorkflowNode = Node<WorkflowNodeData>;

export interface ModelConfig {
  systemPrompt?: string;
  userPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
  tools?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface AgentConfig {
  name: string;
  description: string;
  models: string[];
  tools: string[];
  reasoning?: string;
}

export interface FileConfig {
  name: string;
  type: string;
  path?: string;
  content?: string;
}

export interface ToolConfig {
  name: string;
  description: string;
  parameters?: Record<string, any>;
  code?: string;
}

export interface CanvasState {
  nodes: WorkflowNode[];
  edges: Edge[];
  viewport: { x: number; y: number; zoom: number };
}

export interface WorkflowState extends CanvasState {
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
}
