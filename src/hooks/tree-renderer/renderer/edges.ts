import * as d3 from 'd3';
import type { GraphEdge } from '@/types';
import type { NodePosition, SpouseEdgeInfo } from '../types';
import { MIN_NODE_WIDTH, NODE_HEIGHT } from '../constants';

export function renderSpouseEdges(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  spouseEdges: GraphEdge[],
  nodePositions: Map<string, NodePosition>,
  nodeWidths: Map<string, number>,
  spouseEdgeInfo: Map<string, SpouseEdgeInfo>,
) {
  const nodeSpouses = new Map<string, Array<{ id: string; index: number }>>();

  spouseEdges.forEach((edge) => {
    const edgeKey = [edge.source, edge.target].sort().join('-');
    const info = spouseEdgeInfo.get(edgeKey);
    const index = info?.index ?? 0;

    if (!nodeSpouses.has(edge.source)) nodeSpouses.set(edge.source, []);
    if (!nodeSpouses.has(edge.target)) nodeSpouses.set(edge.target, []);

    nodeSpouses.get(edge.source)!.push({ id: edge.target, index });
    nodeSpouses.get(edge.target)!.push({ id: edge.source, index });
  });

  spouseEdges.forEach((edge) => {
    const edgeKey = [edge.source, edge.target].sort().join('-');
    const edgeInfo = spouseEdgeInfo.get(edgeKey);
    const index = edgeInfo?.index ?? 0;
    const isSubsequentSpouse = index > 0;
    const isConsanguineous = edge.metadata?.is_consanguineous;

    const sourceSpouses = nodeSpouses.get(edge.source) || [];
    const targetSpouses = nodeSpouses.get(edge.target) || [];

    let rootId = edge.source;
    let spouseId = edge.target;
    let rootSpouseList = sourceSpouses;

    if (targetSpouses.length > sourceSpouses.length) {
      rootId = edge.target;
      spouseId = edge.source;
      rootSpouseList = targetSpouses;
    }

    let startNodeId = rootId;
    const endNodeId = spouseId;
    let strokeColor = '#fb7185';

    if (isConsanguineous) {
      strokeColor = '#ef4444';
    } else if (isSubsequentSpouse) {
      strokeColor = '#eab308';

      const prevSpouse = rootSpouseList.find((s) => s.index === index - 1);
      if (prevSpouse) {
        startNodeId = prevSpouse.id;
      }
    }

    const start = nodePositions.get(startNodeId);
    const end = nodePositions.get(endNodeId);
    if (!start || !end) return;

    const startWidth = nodeWidths.get(startNodeId) || MIN_NODE_WIDTH;
    const endWidth = nodeWidths.get(endNodeId) || MIN_NODE_WIDTH;

    const line = g
      .append('line')
      .attr('x1', start.x + startWidth / 2)
      .attr('y1', start.y + NODE_HEIGHT / 2)
      .attr('x2', end.x + endWidth / 2)
      .attr('y2', end.y + NODE_HEIGHT / 2)
      .attr('stroke', strokeColor)
      .attr('stroke-width', 2);

    if (isSubsequentSpouse) {
      line.attr('stroke-dasharray', '6,4');
    } else {
      line.attr('stroke-dasharray', null);
    }
  });
}

export function renderParentEdges(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  parentEdges: GraphEdge[],
  nodePositions: Map<string, NodePosition>,
  nodeWidths: Map<string, number>,
) {
  parentEdges.forEach((edge) => {
    const childPos = nodePositions.get(edge.source);
    const parentPos = nodePositions.get(edge.target);
    if (!childPos || !parentPos) return;

    const parentWidth = nodeWidths.get(edge.target) || MIN_NODE_WIDTH;
    const childWidth = nodeWidths.get(edge.source) || MIN_NODE_WIDTH;

    const parentCenterX = parentPos.x + parentWidth / 2;
    const parentBottomY = parentPos.y + NODE_HEIGHT;
    const childCenterX = childPos.x + childWidth / 2;
    const childTopY = childPos.y;
    const midY = (parentBottomY + childTopY) / 2;

    g.append('path')
      .attr(
        'd',
        `M ${parentCenterX} ${parentBottomY} L ${parentCenterX} ${midY} L ${childCenterX} ${midY} L ${childCenterX} ${childTopY - 6}`,
      )
      .attr('fill', 'none')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round');

    g.append('polygon')
      .attr(
        'points',
        `${childCenterX - 4},${childTopY - 6} ${childCenterX + 4},${childTopY - 6} ${childCenterX},${childTopY}`,
      )
      .attr('fill', '#10b981');
  });
}
