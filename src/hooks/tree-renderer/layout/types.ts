import type { NodePosition, SpouseEdgeInfo } from '../types';

export interface FamilyUnit {
  id: string;
  parents: string[];
  children: string[];
  spouseOrder: number;
}

export interface TreeLayoutResult {
  nodePositions: Map<string, NodePosition>;
  nodeWidths: Map<string, number>;
  familyUnits: FamilyUnit[];
  spouseEdgeInfo: Map<string, SpouseEdgeInfo>;
}
