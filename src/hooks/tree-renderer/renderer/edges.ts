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
  spouseEdges.forEach((edge) => {
    const source = nodePositions.get(edge.source);
    const target = nodePositions.get(edge.target);
    if (!source || !target) return;

    const sourceWidth = nodeWidths.get(edge.source) || MIN_NODE_WIDTH;
    const targetWidth = nodeWidths.get(edge.target) || MIN_NODE_WIDTH;

    const isConsanguineous = edge.metadata?.is_consanguineous;
    const edgeKey = [edge.source, edge.target].sort().join('-');
    const edgeInfo = spouseEdgeInfo.get(edgeKey);
    const isSubsequentSpouse = edgeInfo && edgeInfo.index > 0;

    let strokeColor = '#fb7185';
    if (isConsanguineous) {
      strokeColor = '#ef4444';
    } else if (isSubsequentSpouse) {
      strokeColor = '#eab308';
    }

    const line = g
      .append('line')
      .attr('x1', source.x + sourceWidth / 2)
      .attr('y1', source.y + NODE_HEIGHT / 2)
      .attr('x2', target.x + targetWidth / 2)
      .attr('y2', target.y + NODE_HEIGHT / 2)
      .attr('stroke', strokeColor)
      .attr('stroke-width', 2);

    if (isSubsequentSpouse) {
      line.attr('stroke-dasharray', '6,4');
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
