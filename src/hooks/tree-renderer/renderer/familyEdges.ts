import * as d3 from 'd3';
import type { NodePosition } from '../types';
import type { FamilyUnit } from '../layout/types';
import { MIN_NODE_WIDTH, NODE_HEIGHT } from '../constants';

export function renderParentEdgesWithFamilyUnits(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  familyUnits: FamilyUnit[],
  nodePositions: Map<string, NodePosition>,
  nodeWidths: Map<string, number>,
) {
  const familyGroupsByParent = new Map<string, FamilyUnit[]>();

  familyUnits.forEach((unit) => {
    if (unit.children.length === 0) return;
    if (unit.parents.length === 0) return;

    const primaryParent = unit.parents[0];
    if (!familyGroupsByParent.has(primaryParent)) {
      familyGroupsByParent.set(primaryParent, []);
    }
    familyGroupsByParent.get(primaryParent)!.push(unit);
  });

  familyGroupsByParent.forEach((units, primaryParentId) => {
    units.sort((a, b) => a.spouseOrder - b.spouseOrder);

    const primaryPos = nodePositions.get(primaryParentId);
    const primaryWidth = nodeWidths.get(primaryParentId) || MIN_NODE_WIDTH;
    if (!primaryPos) return;

    const primaryCenterX = primaryPos.x + primaryWidth / 2;
    const primaryBottomY = primaryPos.y + NODE_HEIGHT;

    if (units.length === 1) {
      renderSingleFamilyUnit(g, units[0], nodePositions, nodeWidths);
      return;
    }

    const allChildPositions: Array<{
      id: string;
      centerX: number;
      topY: number;
      spouseOrder: number;
      lineColor: string;
    }> = [];

    units.forEach((unit) => {
      const lineColor = unit.spouseOrder >= 2 ? '#eab308' : '#10b981';
      unit.children.forEach((childId) => {
        const pos = nodePositions.get(childId);
        const width = nodeWidths.get(childId) || MIN_NODE_WIDTH;
        if (pos) {
          allChildPositions.push({
            id: childId,
            centerX: pos.x + width / 2,
            topY: pos.y,
            spouseOrder: unit.spouseOrder,
            lineColor,
          });
        }
      });
    });

    if (allChildPositions.length === 0) return;

    const childTopY = allChildPositions[0].topY;
    const branchY = primaryBottomY + 20;
    const midY = (branchY + childTopY) / 2;

    g.append('line')
      .attr('x1', primaryCenterX)
      .attr('y1', primaryBottomY)
      .attr('x2', primaryCenterX)
      .attr('y2', branchY)
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round');

    units.forEach((unit) => {
      const lineColor = unit.spouseOrder >= 2 ? '#eab308' : '#10b981';

      const unitChildPositions = allChildPositions.filter((c) =>
        unit.children.includes(c.id),
      );

      if (unitChildPositions.length === 0) return;

      const leftMostX = Math.min(...unitChildPositions.map((c) => c.centerX));
      const rightMostX = Math.max(...unitChildPositions.map((c) => c.centerX));
      const familyChildrenCenterX = (leftMostX + rightMostX) / 2;

      g.append('line')
        .attr('x1', primaryCenterX)
        .attr('y1', branchY)
        .attr('x2', familyChildrenCenterX)
        .attr('y2', branchY)
        .attr('stroke', '#10b981')
        .attr('stroke-width', 2)
        .attr('stroke-linecap', 'round');

      g.append('line')
        .attr('x1', familyChildrenCenterX)
        .attr('y1', branchY)
        .attr('x2', familyChildrenCenterX)
        .attr('y2', midY)
        .attr('stroke', lineColor)
        .attr('stroke-width', 2)
        .attr('stroke-linecap', 'round');

      if (
        unitChildPositions.length > 1 ||
        Math.abs(leftMostX - familyChildrenCenterX) > 1
      ) {
        g.append('line')
          .attr('x1', leftMostX)
          .attr('y1', midY)
          .attr('x2', rightMostX)
          .attr('y2', midY)
          .attr('stroke', lineColor)
          .attr('stroke-width', 2)
          .attr('stroke-linecap', 'round');
      }

      unitChildPositions.forEach(({ centerX, topY }) => {
        g.append('line')
          .attr('x1', centerX)
          .attr('y1', midY)
          .attr('x2', centerX)
          .attr('y2', topY - 6)
          .attr('stroke', lineColor)
          .attr('stroke-width', 2)
          .attr('stroke-linecap', 'round');

        g.append('polygon')
          .attr(
            'points',
            `${centerX - 4},${topY - 6} ${centerX + 4},${topY - 6} ${centerX},${topY}`,
          )
          .attr('fill', lineColor);
      });

      if (unit.parents.length >= 2) {
        const spouseId = unit.parents[1];
        const spousePos = nodePositions.get(spouseId);
        const spouseWidth = nodeWidths.get(spouseId) || MIN_NODE_WIDTH;
        if (spousePos) {
          const spouseCenterX = spousePos.x + spouseWidth / 2;
          const spouseBottomY = spousePos.y + NODE_HEIGHT;

          g.append('line')
            .attr('x1', spouseCenterX)
            .attr('y1', spouseBottomY)
            .attr('x2', spouseCenterX)
            .attr('y2', branchY)
            .attr('stroke', '#10b981')
            .attr('stroke-width', 2)
            .attr('stroke-linecap', 'round');

          g.append('line')
            .attr('x1', spouseCenterX)
            .attr('y1', branchY)
            .attr('x2', familyChildrenCenterX)
            .attr('y2', branchY)
            .attr('stroke', '#10b981')
            .attr('stroke-width', 2)
            .attr('stroke-linecap', 'round');
        }
      }
    });
  });

  familyUnits.forEach((unit) => {
    if (unit.children.length === 0) return;
    if (unit.parents.length === 1) {
      renderSingleFamilyUnit(g, unit, nodePositions, nodeWidths);
    }
  });
}

function renderSingleFamilyUnit(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  unit: FamilyUnit,
  nodePositions: Map<string, NodePosition>,
  nodeWidths: Map<string, number>,
) {
  if (unit.children.length === 0) return;

  const lineColor = unit.spouseOrder >= 2 ? '#eab308' : '#10b981';
  let familyCenterX: number;
  let parentBottomY: number;

  if (unit.parents.length >= 2) {
    const pos1 = nodePositions.get(unit.parents[0]);
    const pos2 = nodePositions.get(unit.parents[1]);
    const width1 = nodeWidths.get(unit.parents[0]) || MIN_NODE_WIDTH;
    const width2 = nodeWidths.get(unit.parents[1]) || MIN_NODE_WIDTH;

    if (!pos1 || !pos2) return;

    const center1 = pos1.x + width1 / 2;
    const center2 = pos2.x + width2 / 2;
    familyCenterX = (center1 + center2) / 2;
    parentBottomY = Math.max(pos1.y, pos2.y) + NODE_HEIGHT;

    const connectionY = parentBottomY + 15;

    g.append('line')
      .attr('x1', center1)
      .attr('y1', pos1.y + NODE_HEIGHT)
      .attr('x2', center1)
      .attr('y2', connectionY)
      .attr('stroke', lineColor)
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round');

    g.append('line')
      .attr('x1', center2)
      .attr('y1', pos2.y + NODE_HEIGHT)
      .attr('x2', center2)
      .attr('y2', connectionY)
      .attr('stroke', lineColor)
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round');

    g.append('line')
      .attr('x1', Math.min(center1, center2))
      .attr('y1', connectionY)
      .attr('x2', Math.max(center1, center2))
      .attr('y2', connectionY)
      .attr('stroke', lineColor)
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round');

    parentBottomY = connectionY;
  } else if (unit.parents.length === 1) {
    const pos = nodePositions.get(unit.parents[0]);
    const width = nodeWidths.get(unit.parents[0]) || MIN_NODE_WIDTH;

    if (!pos) return;

    familyCenterX = pos.x + width / 2;
    parentBottomY = pos.y + NODE_HEIGHT;
  } else {
    return;
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

  const childTopY = childPositions[0].topY;
  const midY = (parentBottomY + childTopY) / 2;

  g.append('line')
    .attr('x1', familyCenterX)
    .attr('y1', parentBottomY)
    .attr('x2', familyCenterX)
    .attr('y2', midY)
    .attr('stroke', lineColor)
    .attr('stroke-width', 2)
    .attr('stroke-linecap', 'round');

  const leftMostX = Math.min(...childPositions.map((c) => c.centerX));
  const rightMostX = Math.max(...childPositions.map((c) => c.centerX));

  if (childPositions.length > 1 || Math.abs(leftMostX - familyCenterX) > 1) {
    g.append('line')
      .attr('x1', Math.min(leftMostX, familyCenterX))
      .attr('y1', midY)
      .attr('x2', Math.max(rightMostX, familyCenterX))
      .attr('y2', midY)
      .attr('stroke', lineColor)
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round');
  }

  childPositions.forEach(({ centerX, topY }) => {
    g.append('line')
      .attr('x1', centerX)
      .attr('y1', midY)
      .attr('x2', centerX)
      .attr('y2', topY - 6)
      .attr('stroke', lineColor)
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round');

    g.append('polygon')
      .attr(
        'points',
        `${centerX - 4},${topY - 6} ${centerX + 4},${topY - 6} ${centerX},${topY}`,
      )
      .attr('fill', lineColor);
  });
}
