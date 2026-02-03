import * as d3 from 'd3';
import type { NodePosition } from '../types';
import type { FamilyUnit } from '../layout/types';
import { MIN_NODE_WIDTH, NODE_HEIGHT } from '../constants';

function rangesOverlap(
  left1: number,
  right1: number,
  left2: number,
  right2: number,
): boolean {
  return left1 <= right2 && left2 <= right1;
}

interface FamilyBounds {
  unit: FamilyUnit;
  familyCenterX: number;
  leftX: number;
  rightX: number;
  parentY: number;
}

export function renderParentEdgesWithFamilyUnits(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  familyUnits: FamilyUnit[],
  nodePositions: Map<string, NodePosition>,
  nodeWidths: Map<string, number>,
) {
  const unitPrevSpouse = new Map<string, string>();

  const personUnits = new Map<string, FamilyUnit[]>();
  familyUnits.forEach((u) => {
    u.parents.forEach((p) => {
      if (!personUnits.has(p)) personUnits.set(p, []);
      personUnits.get(p)!.push(u);
    });
  });

  personUnits.forEach((units, personId) => {
    if (units.length <= 1) return;

    units.sort((a, b) => a.spouseOrder - b.spouseOrder);

    for (let i = 1; i < units.length; i++) {
      const curr = units[i];
      const prev = units[i - 1];

      const prevSpouse = prev.parents.find((p) => p !== personId);
      if (prevSpouse) {
        unitPrevSpouse.set(curr.id, prevSpouse);
      }
    }
  });

  const familyBounds: FamilyBounds[] = familyUnits
    .filter((unit) => unit.children.length > 0 && unit.parents.length > 0)
    .map((unit) => {
      const parent1Pos = nodePositions.get(unit.parents[0]);
      const parent1Width = nodeWidths.get(unit.parents[0]) || MIN_NODE_WIDTH;
      if (!parent1Pos) return null;

      let familyCenterX = parent1Pos.x + parent1Width / 2;
      let parentY = parent1Pos.y + NODE_HEIGHT;

      if (unit.parents.length >= 2) {
        const parent2Pos = nodePositions.get(unit.parents[1]);
        const parent2Width = nodeWidths.get(unit.parents[1]) || MIN_NODE_WIDTH;
        if (parent2Pos) {
          const prevSpouseId = unitPrevSpouse.get(unit.id);
          const prevSpousePos = prevSpouseId
            ? nodePositions.get(prevSpouseId)
            : undefined;
          const prevSpouseWidth = prevSpouseId
            ? nodeWidths.get(prevSpouseId) || MIN_NODE_WIDTH
            : 0;

          const p1Center = parent1Pos.x + parent1Width / 2;
          const p2Center = parent2Pos.x + parent2Width / 2;

          let startX = Math.min(p1Center, p2Center);
          let endX = Math.max(p1Center, p2Center);

          if (prevSpousePos) {
            const prevCenter = prevSpousePos.x + prevSpouseWidth / 2;
            const d1 = Math.abs(p1Center - prevCenter);
          const d2 = Math.abs(p2Center - prevCenter);

          const targetX = d1 > d2 ? p1Center : p2Center;
          startX = prevCenter;
          endX = targetX;
        }

        const minX = Math.min(startX, endX);
        const maxX = Math.max(startX, endX);
        const desiredCenter = (p1Center + p2Center) / 2;
        familyCenterX = Math.max(minX, Math.min(maxX, desiredCenter));
        
        parentY = Math.max(parent1Pos.y, parent2Pos.y) + NODE_HEIGHT;
        }
      }

      const childPositions = unit.children
        .map((childId) => {
          const pos = nodePositions.get(childId);
          const width = nodeWidths.get(childId) || MIN_NODE_WIDTH;
          return pos ? pos.x + width / 2 : null;
        })
        .filter((x): x is number => x !== null);

      if (childPositions.length === 0) return null;

      const leftX = Math.min(familyCenterX, ...childPositions);
      const rightX = Math.max(familyCenterX, ...childPositions);

      return { unit, familyCenterX, leftX, rightX, parentY };
    })
    .filter((fc): fc is FamilyBounds => fc !== null);

  const generationGroups = new Map<number, FamilyBounds[]>();
  familyBounds.forEach((fb) => {
    const generationKey = Math.round(fb.parentY / 50) * 50;
    const group = generationGroups.get(generationKey) || [];
    group.push(fb);
    generationGroups.set(generationKey, group);
  });

  const unitOffsetMap = new Map<string, number>();

  generationGroups.forEach((group) => {
    group.sort((a, b) => a.leftX - b.leftX);

    group.forEach((fb, i) => {
      let offsetIndex = 0;

      for (let j = 0; j < i; j++) {
        const prev = group[j];
        if (rangesOverlap(fb.leftX, fb.rightX, prev.leftX, prev.rightX)) {
          const prevOffset = unitOffsetMap.get(prev.unit.id) ?? 0;
          offsetIndex = Math.max(offsetIndex, prevOffset + 1);
        }
      }

      unitOffsetMap.set(fb.unit.id, offsetIndex);
    });
  });

  familyUnits.forEach((unit) => {
    if (unit.children.length === 0 || unit.parents.length === 0) return;
    const offsetIndex = unitOffsetMap.get(unit.id) ?? 0;
    const prevSpouseId = unitPrevSpouse.get(unit.id);
    renderFamilyUnit(
      g,
      unit,
      nodePositions,
      nodeWidths,
      offsetIndex,
      prevSpouseId,
    );
  });
}

function renderFamilyUnit(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  unit: FamilyUnit,
  nodePositions: Map<string, NodePosition>,
  nodeWidths: Map<string, number>,
  offsetIndex: number,
  prevSpouseId?: string,
) {
  const isSecondPlus = unit.spouseOrder >= 2;
  const childLineColor = isSecondPlus ? '#eab308' : '#10b981';

  const parent1Pos = nodePositions.get(unit.parents[0]);
  const parent1Width = nodeWidths.get(unit.parents[0]) || MIN_NODE_WIDTH;
  if (!parent1Pos) return;

  const parent1CenterX = parent1Pos.x + parent1Width / 2;
  const parent1BottomY = parent1Pos.y + NODE_HEIGHT;

  let familyCenterX: number;
  let connectionY: number;

  if (unit.parents.length >= 2) {
    const parent2Pos = nodePositions.get(unit.parents[1]);
    const parent2Width = nodeWidths.get(unit.parents[1]) || MIN_NODE_WIDTH;

    if (!parent2Pos) {
      familyCenterX = parent1CenterX;
      connectionY = parent1BottomY;
    } else {
      const parent2CenterX = parent2Pos.x + parent2Width / 2;
      const parent2BottomY = parent2Pos.y + NODE_HEIGHT;

      let startX = parent1CenterX;
      let endX = parent2CenterX;

      if (prevSpouseId) {
        const prevPos = nodePositions.get(prevSpouseId);
        const prevWidth = nodeWidths.get(prevSpouseId) || MIN_NODE_WIDTH;

        if (prevPos) {
          const prevCenterX = prevPos.x + prevWidth / 2;

          const d1 = Math.abs(parent1CenterX - prevCenterX);
          const d2 = Math.abs(parent2CenterX - prevCenterX);

          const targetX = d1 > d2 ? parent1CenterX : parent2CenterX;
          startX = prevCenterX;
          endX = targetX;
        }
      }

      const minX = Math.min(startX, endX);
      const maxX = Math.max(startX, endX);

      const desiredCenter = (parent1CenterX + parent2CenterX) / 2;
      familyCenterX = Math.max(minX, Math.min(maxX, desiredCenter));

      connectionY = Math.max(parent1BottomY, parent2BottomY) + 15;

      const d1 = Math.abs(
        parent1CenterX -
          (prevSpouseId ? nodePositions.get(prevSpouseId)?.x || 0 : -99999),
      );
      const d2 = Math.abs(
        parent2CenterX -
          (prevSpouseId ? nodePositions.get(prevSpouseId)?.x || 0 : -99999),
      );
      const currParentX = d1 > d2 ? parent1CenterX : parent2CenterX;
      const currParentY = d1 > d2 ? parent1BottomY : parent2BottomY;
      const rootParentX = d1 > d2 ? parent2CenterX : parent1CenterX;

      g.append('line')
        .attr('x1', minX)
        .attr('y1', connectionY)
        .attr('x2', maxX)
        .attr('y2', connectionY)
        .attr('stroke', childLineColor)
        .attr('stroke-width', 2)
        .attr('stroke-linecap', 'round');

      g.append('line')
        .attr('x1', currParentX)
        .attr('y1', currParentY)
        .attr('x2', currParentX)
        .attr('y2', connectionY)
        .attr('stroke', childLineColor)
        .attr('stroke-width', 2)
        .attr('stroke-linecap', 'round');

      if (!prevSpouseId) {
        g.append('line')
          .attr('x1', rootParentX)
          .attr('y1', parent1BottomY)
          .attr('x2', rootParentX)
          .attr('y2', connectionY)
          .attr('stroke', childLineColor)
          .attr('stroke-width', 2)
          .attr('stroke-linecap', 'round');
      }
    }
  } else {
    familyCenterX = parent1CenterX;
    connectionY = parent1BottomY;
  }

  const childPositions = unit.children
    .map((childId) => {
      const pos = nodePositions.get(childId);
      const width = nodeWidths.get(childId) || MIN_NODE_WIDTH;
      return pos
        ? { id: childId, centerX: pos.x + width / 2, topY: pos.y }
        : null;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  if (childPositions.length === 0) return;

  const childTopY = Math.min(...childPositions.map((c) => c.topY));
  const baseMidY = (connectionY + childTopY) / 2;

  const overlapOffset = offsetIndex * 18;

  const midY = baseMidY + overlapOffset;

  const leftMostChildX = Math.min(...childPositions.map((c) => c.centerX));
  const rightMostChildX = Math.max(...childPositions.map((c) => c.centerX));

  const horizontalLeft = Math.min(familyCenterX, leftMostChildX);
  const horizontalRight = Math.max(familyCenterX, rightMostChildX);

  g.append('line')
    .attr('x1', familyCenterX)
    .attr('y1', connectionY)
    .attr('x2', familyCenterX)
    .attr('y2', midY)
    .attr('stroke', childLineColor)
    .attr('stroke-width', 2)
    .attr('stroke-linecap', 'round');

  g.append('line')
    .attr('x1', horizontalLeft)
    .attr('y1', midY)
    .attr('x2', horizontalRight)
    .attr('y2', midY)
    .attr('stroke', childLineColor)
    .attr('stroke-width', 2)
    .attr('stroke-linecap', 'round');

  childPositions.forEach(({ centerX, topY }) => {
    g.append('line')
      .attr('x1', centerX)
      .attr('y1', midY)
      .attr('x2', centerX)
      .attr('y2', topY - 6)
      .attr('stroke', childLineColor)
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round');

    g.append('polygon')
      .attr(
        'points',
        `${centerX - 4},${topY - 6} ${centerX + 4},${topY - 6} ${centerX},${topY}`,
      )
      .attr('fill', childLineColor);
  });
}
