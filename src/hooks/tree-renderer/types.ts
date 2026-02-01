import type { FamilyGraph } from '@/types';

export interface UseTreeRendererProps {
  graph: FamilyGraph | undefined;
  selectedNodeId: string | null;
  onNodeClick: (nodeId: string) => void;
}

export interface TreeRendererReturn {
  svgRef: React.RefObject<SVGSVGElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  transform: { x: number; y: number; k: number };
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetView: () => void;
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface SpouseEdgeInfo {
  index: number;
  total: number;
}

export interface TreeLayoutData {
  nodePositions: Map<string, NodePosition>;
  nodeWidths: Map<string, number>;
  nodeGenerations: Map<string, number>;
  spousesMap: Map<string, string[]>;
  spouseEdgeInfo: Map<string, SpouseEdgeInfo>;
  parentToChildren: Map<string, string[]>;
  childToParents: Map<string, string[]>;
}
