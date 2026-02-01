import type { GraphNode } from '@/types';
import type { NodePosition } from '../types';
import type { FamilyUnit } from './types';
import {
  MIN_NODE_WIDTH,
  VERTICAL_GAP,
  HORIZONTAL_GAP,
  SPOUSE_GAP,
} from '../constants';

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
  nodes.forEach((node) => {
    const gen = nodeGenerations.get(node.id) ?? 0;
    if (!generations.has(gen)) generations.set(gen, []);
    generations.get(gen)!.push(node);
  });

  const sortedGens = Array.from(generations.keys()).sort((a, b) => a - b);

  sortedGens.forEach((gen) => {
    const nodesInGen = generations.get(gen)!;
    const processed = new Set<string>();
    let xOffset = 0;

    const coupleGroups = buildCoupleGroups(
      nodesInGen,
      nodeMap,
      spouseMap,
      spouseOrderMap,
      nodeGenerations,
      gen,
      marryingInNodes,
    );

    coupleGroups.forEach((group) => {
      group.forEach((personId) => {
        if (processed.has(personId)) return;
        const personWidth = nodeWidths.get(personId) || MIN_NODE_WIDTH;
        nodePositions.set(personId, { x: xOffset, y: gen * VERTICAL_GAP });
        processed.add(personId);
        xOffset += personWidth + SPOUSE_GAP;
      });
      xOffset = xOffset - SPOUSE_GAP + HORIZONTAL_GAP;
    });

    const totalWidth = xOffset - HORIZONTAL_GAP;
    const centerOffset = -totalWidth / 2;
    nodesInGen.forEach((node) => {
      const pos = nodePositions.get(node.id);
      if (pos) {
        nodePositions.set(node.id, { x: pos.x + centerOffset, y: pos.y });
      }
    });
  });

  familyUnits.forEach((unit) => {
    if (unit.children.length === 0) return;

    let familyCenterX: number;
    if (unit.parents.length === 2) {
      const pos1 = nodePositions.get(unit.parents[0]);
      const pos2 = nodePositions.get(unit.parents[1]);
      const width1 = nodeWidths.get(unit.parents[0]) || MIN_NODE_WIDTH;
      const width2 = nodeWidths.get(unit.parents[1]) || MIN_NODE_WIDTH;

      if (pos1 && pos2) {
        const center1 = pos1.x + width1 / 2;
        const center2 = pos2.x + width2 / 2;
        familyCenterX = (center1 + center2) / 2;
      } else {
        return;
      }
    } else if (unit.parents.length === 1) {
      const pos = nodePositions.get(unit.parents[0]);
      const width = nodeWidths.get(unit.parents[0]) || MIN_NODE_WIDTH;
      if (pos) {
        familyCenterX = pos.x + width / 2;
      } else {
        return;
      }
    } else {
      return;
    }

    if (unit.children.length === 1) {
      const childId = unit.children[0];
      const childPos = nodePositions.get(childId);
      if (!childPos) return;

      const childSpouses = spouseMap.get(childId) || [];
      let groupWidth = nodeWidths.get(childId) || MIN_NODE_WIDTH;
      childSpouses.forEach((spouseId) => {
        if (nodePositions.has(spouseId)) {
          groupWidth +=
            SPOUSE_GAP + (nodeWidths.get(spouseId) || MIN_NODE_WIDTH);
        }
      });

      let minX = childPos.x;
      childSpouses.forEach((spouseId) => {
        const spousePos = nodePositions.get(spouseId);
        if (spousePos && spousePos.x < minX) {
          minX = spousePos.x;
        }
      });

      const newGroupStartX = familyCenterX - groupWidth / 2;
      const deltaX = newGroupStartX - minX;

      nodePositions.set(childId, { x: childPos.x + deltaX, y: childPos.y });

      childSpouses.forEach((spouseId) => {
        const spousePos = nodePositions.get(spouseId);
        if (spousePos) {
          nodePositions.set(spouseId, {
            x: spousePos.x + deltaX,
            y: spousePos.y,
          });
        }
      });
    } else {
      let totalChildWidth = 0;
      unit.children.forEach((childId, i) => {
        totalChildWidth += nodeWidths.get(childId) || MIN_NODE_WIDTH;

        const childSpouses = spouseMap.get(childId) || [];
        childSpouses.forEach((spouseId) => {
          if (nodePositions.has(spouseId)) {
            totalChildWidth +=
              SPOUSE_GAP + (nodeWidths.get(spouseId) || MIN_NODE_WIDTH);
          }
        });

        if (i < unit.children.length - 1) {
          totalChildWidth += HORIZONTAL_GAP;
        }
      });

      let childX = familyCenterX - totalChildWidth / 2;
      unit.children.forEach((childId) => {
        const childWidth = nodeWidths.get(childId) || MIN_NODE_WIDTH;
        const pos = nodePositions.get(childId);
        if (pos) {
          const childSpouses = spouseMap.get(childId) || [];
          let groupMinX = pos.x;
          childSpouses.forEach((spouseId) => {
            const spousePos = nodePositions.get(spouseId);
            if (spousePos && spousePos.x < groupMinX) {
              groupMinX = spousePos.x;
            }
          });

          const deltaX = childX - groupMinX;

          nodePositions.set(childId, { x: pos.x + deltaX, y: pos.y });

          childSpouses.forEach((spouseId) => {
            const spousePos = nodePositions.get(spouseId);
            if (spousePos) {
              nodePositions.set(spouseId, {
                x: spousePos.x + deltaX,
                y: spousePos.y,
              });
            }
          });

          let groupWidth = childWidth;
          childSpouses.forEach((spouseId) => {
            if (nodePositions.has(spouseId)) {
              groupWidth +=
                SPOUSE_GAP + (nodeWidths.get(spouseId) || MIN_NODE_WIDTH);
            }
          });

          childX += groupWidth + HORIZONTAL_GAP;
        }
      });
    }
  });

  sortedGens.forEach((gen) => {
    const nodesInGen = generations.get(gen)!;
    resolveOverlaps(nodesInGen, nodePositions, nodeWidths);
  });

  return nodePositions;
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

export function resolveOverlaps(
  nodesInGen: GraphNode[],
  nodePositions: Map<string, NodePosition>,
  nodeWidths: Map<string, number>,
) {
  const sorted = nodesInGen
    .map((node) => ({
      node,
      pos: nodePositions.get(node.id),
      width: nodeWidths.get(node.id) || MIN_NODE_WIDTH,
    }))
    .filter((item) => item.pos !== undefined)
    .sort((a, b) => a.pos!.x - b.pos!.x);

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];

    const prevRight = prev.pos!.x + prev.width;
    const currLeft = curr.pos!.x;
    const minGap = HORIZONTAL_GAP / 2;

    if (currLeft < prevRight + minGap) {
      const shift = prevRight + minGap - currLeft;
      nodePositions.set(curr.node.id, {
        x: curr.pos!.x + shift,
        y: curr.pos!.y,
      });
      curr.pos = nodePositions.get(curr.node.id);
    }
  }
}
