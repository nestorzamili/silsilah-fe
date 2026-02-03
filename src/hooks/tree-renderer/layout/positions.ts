import type { GraphNode } from '@/types';
import type { NodePosition } from '../types';
import type { FamilyUnit } from './types';
import {
  MIN_NODE_WIDTH,
  VERTICAL_GAP,
  HORIZONTAL_GAP,
  SPOUSE_GAP,
} from '../constants';

function calculateGroupWidth(
  group: string[],
  nodeWidths: Map<string, number>,
): number {
  return group.reduce((width, personId, i) => {
    const personWidth = nodeWidths.get(personId) || MIN_NODE_WIDTH;
    return width + personWidth + (i < group.length - 1 ? SPOUSE_GAP : 0);
  }, 0);
}

export function calculatePositions(
  nodes: GraphNode[],
  nodeMap: Map<string, GraphNode>,
  nodeWidths: Map<string, number>,
  nodeGenerations: Map<string, number>,
  familyUnits: FamilyUnit[],
  spouseMap: Map<string, string[]>,
  spouseOrderMap: Map<string, number>,
  marryingInNodes: Set<string>,
): Map<string, NodePosition> {
  const nodePositions = new Map<string, NodePosition>();

  const generations = new Map<number, GraphNode[]>();
  for (const node of nodes) {
    const gen = nodeGenerations.get(node.id) ?? 0;
    if (!generations.has(gen)) generations.set(gen, []);
    generations.get(gen)!.push(node);
  }

  const childToFamilyUnit = new Map<string, FamilyUnit>();
  const parentToChildren = new Map<string, string[]>();
  for (const unit of familyUnits) {
    for (const childId of unit.children) {
      childToFamilyUnit.set(childId, unit);
    }
    for (const parentId of unit.parents) {
      const existing = parentToChildren.get(parentId) || [];
      parentToChildren.set(parentId, [...existing, ...unit.children]);
    }
  }

  const sortedGensBottomUp = Array.from(generations.keys()).sort(
    (a, b) => b - a,
  );

  const lowestGen = sortedGensBottomUp[0];

  if (generations.has(lowestGen)) {
    const nodesInGen = generations.get(lowestGen)!;
    const coupleGroups = buildCoupleGroups(
      nodesInGen,
      nodeMap,
      spouseMap,
      spouseOrderMap,
      nodeGenerations,
      lowestGen,
      marryingInNodes,
    );
    const sortedGroups = sortGroupsByChildOrder(
      coupleGroups,
      childToFamilyUnit,
    );

    let xOffset = 0;
    const processed = new Set<string>();
    sortedGroups.forEach((group) => {
      let currentX = xOffset;
      group.forEach((personId) => {
        if (processed.has(personId)) return;
        const personWidth = nodeWidths.get(personId) || MIN_NODE_WIDTH;
        nodePositions.set(personId, {
          x: currentX,
          y: lowestGen * VERTICAL_GAP,
        });
        processed.add(personId);
        currentX += personWidth + SPOUSE_GAP;
      });
      xOffset = currentX - SPOUSE_GAP + HORIZONTAL_GAP;
    });
  }

  for (let i = 0; i < sortedGensBottomUp.length; i++) {
    const gen = sortedGensBottomUp[i];
    if (gen === lowestGen) continue;

    const nodesInGen = generations.get(gen)!;
    const processed = new Set<string>();

    const coupleGroups = buildCoupleGroups(
      nodesInGen,
      nodeMap,
      spouseMap,
      spouseOrderMap,
      nodeGenerations,
      gen,
      marryingInNodes,
    );

    const groupsWithChildren: {
      group: string[];
      childrenBounds: { minX: number; maxX: number };
    }[] = [];
    const groupsWithoutChildren: {
      group: string[];
      childOrder: number;
      parentUnitId: string;
    }[] = [];

    coupleGroups.forEach((group) => {
      const allChildrenIds: string[] = [];
      for (const personId of group) {
        const children = parentToChildren.get(personId);
        if (children) allChildrenIds.push(...children);
      }

      const uniqueChildren = [...new Set(allChildrenIds)];

      if (uniqueChildren.length > 0) {
        let childrenMinX = Infinity;
        let childrenMaxX = -Infinity;
        uniqueChildren.forEach((childId) => {
          const pos = nodePositions.get(childId);
          const width = nodeWidths.get(childId) || MIN_NODE_WIDTH;
          if (pos) {
            childrenMinX = Math.min(childrenMinX, pos.x);
            childrenMaxX = Math.max(childrenMaxX, pos.x + width);
          }
        });

        if (childrenMinX !== Infinity) {
          groupsWithChildren.push({
            group,
            childrenBounds: { minX: childrenMinX, maxX: childrenMaxX },
          });
        }
      } else {
        let childOrder = 999;
        let parentUnitId = '';
        for (const personId of group) {
          const unit = childToFamilyUnit.get(personId);
          if (unit) {
            const idx = unit.children.indexOf(personId);
            if (idx >= 0) {
              childOrder = idx;
              parentUnitId = unit.id;
              break;
            }
          }
        }
        groupsWithoutChildren.push({ group, childOrder, parentUnitId });
      }
    });

    groupsWithChildren.forEach(({ group, childrenBounds }) => {
      const allChildrenCenterX =
        (childrenBounds.minX + childrenBounds.maxX) / 2;

      const rootId = group[0];
      const rootWidth = nodeWidths.get(rootId) || MIN_NODE_WIDTH;

      const getUnitAndCenter = (p1: string, p2?: string) => {
        const unit = familyUnits.find(
          (u) =>
            u.parents.includes(p1) &&
            (!p2 || u.parents.includes(p2)) &&
            u.parents.length === (p2 ? 2 : 1),
        );

        if (!unit || unit.children.length === 0) return null;

        let minC = Infinity;
        let maxC = -Infinity;
        unit.children.forEach((cId) => {
          const pos = nodePositions.get(cId);
          const w = nodeWidths.get(cId) || MIN_NODE_WIDTH;
          if (pos) {
            minC = Math.min(minC, pos.x);
            maxC = Math.max(maxC, pos.x + w);
          }
        });

        if (minC === Infinity) return null;
        return (minC + maxC) / 2;
      };

      const spouse1Id = group.length > 1 ? group[1] : undefined;
      const spouse1Width = spouse1Id
        ? nodeWidths.get(spouse1Id) || MIN_NODE_WIDTH
        : 0;

      const center1 = getUnitAndCenter(rootId, spouse1Id);

      const targetCenter = center1 ?? allChildrenCenterX;

      const pairWidth = rootWidth + (spouse1Id ? SPOUSE_GAP + spouse1Width : 0);
      const rootX = targetCenter - pairWidth / 2;

      if (!processed.has(rootId)) {
        nodePositions.set(rootId, { x: rootX, y: gen * VERTICAL_GAP });
        processed.add(rootId);
      }

      let currentRightX = rootX + rootWidth;

      if (spouse1Id && !processed.has(spouse1Id)) {
        const s1X = currentRightX + SPOUSE_GAP;
        nodePositions.set(spouse1Id, { x: s1X, y: gen * VERTICAL_GAP });
        processed.add(spouse1Id);
        currentRightX = s1X + spouse1Width;
      }

      for (let i = 2; i < group.length; i++) {
        const sId = group[i];
        if (processed.has(sId)) continue;

        const sWidth = nodeWidths.get(sId) || MIN_NODE_WIDTH;

        const sCenter = getUnitAndCenter(rootId, sId);

        let sX: number;
        if (sCenter !== null) {
          const desiredX = sCenter - sWidth / 2;
          sX = Math.max(desiredX, currentRightX + SPOUSE_GAP);
        } else {
          sX = currentRightX + SPOUSE_GAP;
        }

        nodePositions.set(sId, { x: sX, y: gen * VERTICAL_GAP });
        processed.add(sId);
        currentRightX = sX + sWidth;
      }
    });

    groupsWithoutChildren.sort((a, b) => a.childOrder - b.childOrder);

    groupsWithoutChildren.forEach(({ group, childOrder, parentUnitId }) => {
      const siblingPositions: {
        minX: number;
        maxX: number;
        childOrder: number;
      }[] = [];

      groupsWithChildren.forEach(({ group: sibGroup }) => {
        sibGroup.forEach((personId) => {
          const unit = childToFamilyUnit.get(personId);
          if (unit && unit.id === parentUnitId) {
            const pos = nodePositions.get(personId);
            const width = nodeWidths.get(personId) || MIN_NODE_WIDTH;
            if (pos) {
              const idx = unit.children.indexOf(personId);
              siblingPositions.push({
                minX: pos.x,
                maxX: pos.x + width,
                childOrder: idx,
              });
            }
          }
        });
      });

      groupsWithoutChildren.forEach(({ group: sibGroup }) => {
        sibGroup.forEach((personId) => {
          if (!processed.has(personId)) return;
          const unit = childToFamilyUnit.get(personId);
          if (unit && unit.id === parentUnitId) {
            const pos = nodePositions.get(personId);
            const width = nodeWidths.get(personId) || MIN_NODE_WIDTH;
            if (pos) {
              const idx = unit.children.indexOf(personId);
              siblingPositions.push({
                minX: pos.x,
                maxX: pos.x + width,
                childOrder: idx,
              });
            }
          }
        });
      });

      const groupWidth = calculateGroupWidth(group, nodeWidths);

      let targetX: number;

      if (siblingPositions.length === 0) {
        targetX = 0;
      } else {
        const sortedSiblings = siblingPositions.sort(
          (a, b) => a.childOrder - b.childOrder,
        );

        const siblingsBefore = sortedSiblings.filter(
          (s) => s.childOrder < childOrder,
        );
        const siblingsAfter = sortedSiblings.filter(
          (s) => s.childOrder > childOrder,
        );

        if (siblingsBefore.length === 0) {
          const firstSibling = sortedSiblings[0];
          targetX = firstSibling.minX - HORIZONTAL_GAP - groupWidth;
        } else if (siblingsAfter.length === 0) {
          const lastSibling = siblingsBefore[siblingsBefore.length - 1];
          targetX = lastSibling.maxX + HORIZONTAL_GAP;
        } else {
          const leftSibling = siblingsBefore[siblingsBefore.length - 1];
          const rightSibling = siblingsAfter[0];
          const gapCenter = (leftSibling.maxX + rightSibling.minX) / 2;
          targetX = gapCenter - groupWidth / 2;
        }
      }

      let currentX = targetX;
      group.forEach((personId) => {
        if (processed.has(personId)) return;
        const personWidth = nodeWidths.get(personId) || MIN_NODE_WIDTH;
        nodePositions.set(personId, { x: currentX, y: gen * VERTICAL_GAP });
        processed.add(personId);
        currentX += personWidth + SPOUSE_GAP;
      });
    });

    resolveGenerationOverlaps(
      nodesInGen,
      nodePositions,
      nodeWidths,
      spouseMap,
      nodeGenerations,
      gen,
    );
  }

  let minX = Infinity;
  let maxX = -Infinity;
  nodePositions.forEach((pos, nodeId) => {
    const width = nodeWidths.get(nodeId) || MIN_NODE_WIDTH;
    minX = Math.min(minX, pos.x);
    maxX = Math.max(maxX, pos.x + width);
  });

  if (minX !== Infinity && maxX !== -Infinity) {
    const treeWidth = maxX - minX;
    const centerOffset = -minX - treeWidth / 2;
    nodePositions.forEach((pos, nodeId) => {
      nodePositions.set(nodeId, { x: pos.x + centerOffset, y: pos.y });
    });
  }

  return nodePositions;
}

function resolveGenerationOverlaps(
  nodesInGen: GraphNode[],
  nodePositions: Map<string, NodePosition>,
  nodeWidths: Map<string, number>,
  spouseMap: Map<string, string[]>,
  nodeGenerations: Map<string, number>,
  gen: number,
) {
  const processed = new Set<string>();
  const coupleGroups: string[][] = [];

  nodesInGen.forEach((node) => {
    if (processed.has(node.id)) return;

    const spouses = (spouseMap.get(node.id) || []).filter(
      (sId) => nodeGenerations.get(sId) === gen,
    );

    const group = [node.id, ...spouses.filter((s) => !processed.has(s))];
    group.forEach((id) => processed.add(id));
    coupleGroups.push(group);
  });

  const groupBounds = coupleGroups.map((group) => {
    let minX = Infinity;
    let maxX = -Infinity;
    group.forEach((personId) => {
      const pos = nodePositions.get(personId);
      const width = nodeWidths.get(personId) || MIN_NODE_WIDTH;
      if (pos) {
        minX = Math.min(minX, pos.x);
        maxX = Math.max(maxX, pos.x + width);
      }
    });
    return { group, minX, maxX };
  });

  groupBounds.sort((a, b) => a.minX - b.minX);

  for (let i = 1; i < groupBounds.length; i++) {
    const prev = groupBounds[i - 1];
    const curr = groupBounds[i];

    const minGap = HORIZONTAL_GAP / 2;
    if (curr.minX < prev.maxX + minGap) {
      const shift = prev.maxX + minGap - curr.minX;

      for (let j = i; j < groupBounds.length; j++) {
        const g = groupBounds[j];
        g.group.forEach((personId) => {
          const pos = nodePositions.get(personId);
          if (pos) {
            nodePositions.set(personId, { x: pos.x + shift, y: pos.y });
          }
        });
        g.minX += shift;
        g.maxX += shift;
      }
    }
  }
}

function sortGroupsByChildOrder(
  coupleGroups: string[][],
  childToFamilyUnit: Map<string, FamilyUnit>,
): string[][] {
  const groupsWithOrder = coupleGroups.map((group) => {
    let childOrder = 999;
    let parentFamilyUnitId = '';

    for (const personId of group) {
      const unit = childToFamilyUnit.get(personId);
      if (unit) {
        const idx = unit.children.indexOf(personId);
        if (idx >= 0) {
          childOrder = idx;
          parentFamilyUnitId = unit.id;
          break;
        }
      }
    }

    return { group, childOrder, parentFamilyUnitId };
  });

  groupsWithOrder.sort((a, b) => {
    if (a.parentFamilyUnitId && a.parentFamilyUnitId === b.parentFamilyUnitId) {
      return a.childOrder - b.childOrder;
    }
    return 0;
  });

  return groupsWithOrder.map((g) => g.group);
}

export function buildCoupleGroups(
  nodesInGen: GraphNode[],
  nodeMap: Map<string, GraphNode>,
  spouseMap: Map<string, string[]>,
  spouseOrderMap: Map<string, number>,
  nodeGenerations: Map<string, number>,
  gen: number,
  marryingInNodes: Set<string>,
): string[][] {
  const processed = new Set<string>();
  const groups: string[][] = [];
  const nodeIdSet = new Set(nodesInGen.map((n) => n.id));

  const rootMembers = nodesInGen.filter((n) => !marryingInNodes.has(n.id));

  rootMembers.forEach((node) => {
    if (processed.has(node.id)) return;

    const allSpouses = (spouseMap.get(node.id) || []).filter(
      (sId) =>
        nodeGenerations.get(sId) === gen &&
        nodeMap.has(sId) &&
        nodeIdSet.has(sId),
    );

    const group = [node.id];
    allSpouses.forEach((spouseId) => {
      if (!processed.has(spouseId)) {
        group.push(spouseId);
      }
    });

    if (group.length > 1) {
      group.sort((a, b) => {
        const nodeA = nodeMap.get(a);
        const nodeB = nodeMap.get(b);
        const aIsRoot = a === node.id;
        const bIsRoot = b === node.id;

        if (nodeA?.gender === 'MALE' && nodeB?.gender !== 'MALE') return -1;
        if (nodeA?.gender !== 'MALE' && nodeB?.gender === 'MALE') return 1;

        if (aIsRoot && !bIsRoot) return -1;
        if (!aIsRoot && bIsRoot) return 1;

        const keyA = [node.id, a].sort().join('-');
        const keyB = [node.id, b].sort().join('-');
        const orderA = spouseOrderMap.get(keyA) ?? 999;
        const orderB = spouseOrderMap.get(keyB) ?? 999;
        return orderA - orderB;
      });
    }

    group.forEach((id) => processed.add(id));
    groups.push(group);
  });

  nodesInGen.forEach((node) => {
    if (processed.has(node.id)) return;
    processed.add(node.id);
    groups.push([node.id]);
  });

  return groups;
}
