import type { GraphEdge } from '@/types';
import type { SpouseEdgeInfo } from '../types';

export interface ParentChildMaps {
  childToParents: Map<string, string[]>;
  parentToChildren: Map<string, string[]>;
  childOrderMap: Map<string, number>;
}

export interface SpouseMaps {
  spouseMap: Map<string, string[]>;
  spouseOrderMap: Map<string, number>;
  spouseEdgeInfo: Map<string, SpouseEdgeInfo>;
}

export function buildParentChildMaps(
  parentEdges: GraphEdge[],
): ParentChildMaps {
  const childToParents = new Map<string, string[]>();
  const parentToChildren = new Map<string, string[]>();
  const childOrderMap = new Map<string, number>();

  parentEdges.forEach((edge) => {
    const childId = edge.source;
    const parentId = edge.target;

    if (!childToParents.has(childId)) childToParents.set(childId, []);
    if (!childToParents.get(childId)!.includes(parentId)) {
      childToParents.get(childId)!.push(parentId);
    }

    if (!parentToChildren.has(parentId)) parentToChildren.set(parentId, []);
    if (!parentToChildren.get(parentId)!.includes(childId)) {
      parentToChildren.get(parentId)!.push(childId);
    }

    const existingOrder = childOrderMap.get(childId) ?? 999;
    const newOrder = edge.child_order ?? 999;
    if (newOrder < existingOrder) {
      childOrderMap.set(childId, newOrder);
    }
  });

  return { childToParents, parentToChildren, childOrderMap };
}

export function buildSpouseMaps(spouseEdges: GraphEdge[]): SpouseMaps {
  const spouseMap = new Map<string, string[]>();
  const spouseOrderMap = new Map<string, number>();
  const spouseEdgeInfo = new Map<string, SpouseEdgeInfo>();

  const sortedEdges = [...spouseEdges].sort(
    (a, b) => (a.spouse_order ?? 1) - (b.spouse_order ?? 1),
  );

  sortedEdges.forEach((edge) => {
    const order = edge.spouse_order ?? 1;
    const key = [edge.source, edge.target].sort().join('-');

    if (!spouseMap.has(edge.source)) spouseMap.set(edge.source, []);
    if (!spouseMap.has(edge.target)) spouseMap.set(edge.target, []);

    if (!spouseMap.get(edge.source)!.includes(edge.target)) {
      spouseMap.get(edge.source)!.push(edge.target);
    }
    if (!spouseMap.get(edge.target)!.includes(edge.source)) {
      spouseMap.get(edge.target)!.push(edge.source);
    }

    spouseOrderMap.set(key, order);

    const sourceSpouses = spouseMap.get(edge.source)!;
    spouseEdgeInfo.set(key, {
      index: Math.max(0, order - 1),
      total: sourceSpouses.length,
    });
  });

  return { spouseMap, spouseOrderMap, spouseEdgeInfo };
}
