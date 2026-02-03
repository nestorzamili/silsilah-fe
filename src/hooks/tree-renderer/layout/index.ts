import type { GraphNode, GraphEdge, FamilyGroup } from '@/types';
import type { TreeLayoutResult, FamilyUnit } from './types';
import { calculateNodeWidth } from '../utils';
import { buildParentChildMaps, buildSpouseMaps } from './relationships';
import { calculateGenerations } from './generations';
import { buildFamilyUnits } from './familyUnits';
import { calculatePositions } from './positions';

export type { FamilyUnit, TreeLayoutResult } from './types';

/**
 * Convert backend FamilyGroup to frontend FamilyUnit
 */
function convertGroupsToUnits(groups: FamilyGroup[]): FamilyUnit[] {
  return groups.map((g) => ({
    id: g.id,
    parents: g.parents,
    children: g.children,
    spouseOrder: g.spouse_order,
  }));
}

export function calculateTreeLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  groups?: FamilyGroup[],
): TreeLayoutResult {
  const nodeMap = new Map<string, GraphNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  const nodeWidths = new Map<string, number>();
  nodes.forEach((n) => nodeWidths.set(n.id, calculateNodeWidth(n)));

  const spouseEdges = edges.filter((e) => e.type === 'SPOUSE');
  const parentEdges = edges.filter((e) => e.type === 'PARENT');

  const { childToParents, parentToChildren, childOrderMap } =
    buildParentChildMaps(parentEdges);
  const { spouseMap, spouseOrderMap, spouseEdgeInfo } =
    buildSpouseMaps(spouseEdges);

  const marryingInNodes = new Set<string>();
  nodes.forEach((node) => {
    const parents = childToParents.get(node.id) || [];
    if (parents.length === 0) {
      const spouses = spouseMap.get(node.id) || [];
      const hasSpouseWithParents = spouses.some((sId) => {
        const spouseParents = childToParents.get(sId) || [];
        return spouseParents.length > 0;
      });
      if (hasSpouseWithParents) {
        marryingInNodes.add(node.id);
      }
    }
  });

  const nodeGenerations = calculateGenerations(
    nodes,
    childToParents,
    parentToChildren,
    spouseMap,
  );

  // Use backend groups if available, otherwise compute locally
  const familyUnits =
    groups && groups.length > 0
      ? convertGroupsToUnits(groups)
      : buildFamilyUnits(
          nodes,
          nodeMap,
          childToParents,
          parentToChildren,
          childOrderMap,
          spouseOrderMap,
        );

  const nodePositions = calculatePositions(
    nodes,
    nodeMap,
    nodeWidths,
    nodeGenerations,
    familyUnits,
    spouseMap,
    spouseOrderMap,
    marryingInNodes,
  );

  return { nodePositions, nodeWidths, familyUnits, spouseEdgeInfo };
}
