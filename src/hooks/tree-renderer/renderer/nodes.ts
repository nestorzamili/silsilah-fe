import * as d3 from 'd3';
import type { GraphNode } from '@/types';
import type { NodePosition } from '../types';
import { MIN_NODE_WIDTH, NODE_HEIGHT, BASE_TEXT_OFFSET } from '../constants';
import { getFullName, getGenderColors } from '../utils';

// Padding from the right edge of the card
const TEXT_RIGHT_PADDING = 12;

export function renderNodes(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  filteredNodes: GraphNode[],
  nodePositions: Map<string, NodePosition>,
  nodeWidths: Map<string, number>,
  selectedNodeId: string | null,
  onNodeClick: (nodeId: string) => void,
) {
  const nodesGroup = g.append('g').attr('class', 'nodes-group');

  filteredNodes.forEach((node) => {
    const pos = nodePositions.get(node.id);
    if (!pos) return;

    const nodeWidth = nodeWidths.get(node.id) || MIN_NODE_WIDTH;
    const { strokeColor, fillColor, avatarFill, textColor } = getGenderColors(
      node.gender,
    );

    const nodeGroup = nodesGroup
      .append('g')
      .attr('transform', `translate(${pos.x}, ${pos.y})`)
      .style('cursor', 'pointer')
      .on('click', () => onNodeClick(node.id));

    nodeGroup
      .append('rect')
      .attr('x', 3)
      .attr('y', 3)
      .attr('width', nodeWidth)
      .attr('height', NODE_HEIGHT)
      .attr('rx', 12)
      .attr('fill', 'rgba(0,0,0,0.1)');

    const isSelected = selectedNodeId === node.id;

    nodeGroup
      .append('rect')
      .attr('width', nodeWidth)
      .attr('height', NODE_HEIGHT)
      .attr('rx', 12)
      .attr('fill', isSelected ? '#ecfdf5' : fillColor)
      .attr('stroke', isSelected ? '#10b981' : strokeColor)
      .attr('stroke-width', isSelected ? 2 : 1);

    nodeGroup
      .append('circle')
      .attr('cx', 40)
      .attr('cy', NODE_HEIGHT / 2)
      .attr('r', 24)
      .attr('fill', avatarFill)
      .attr('stroke', strokeColor)
      .attr('stroke-width', 1.5);

    if (node.avatar_url) {
      const clipId = `clip-${node.id.replace(/-/g, '')}`;
      nodeGroup
        .append('clipPath')
        .attr('id', clipId)
        .append('circle')
        .attr('cx', 40)
        .attr('cy', NODE_HEIGHT / 2)
        .attr('r', 22);

      nodeGroup
        .append('image')
        .attr('x', 40 - 22)
        .attr('y', NODE_HEIGHT / 2 - 22)
        .attr('width', 44)
        .attr('height', 44)
        .attr('href', node.avatar_url)
        .attr('clip-path', `url(#${clipId})`)
        .attr('preserveAspectRatio', 'xMidYMid slice');
    } else {
      const initials = node.first_name.charAt(0).toUpperCase();
      nodeGroup
        .append('text')
        .attr('x', 40)
        .attr('y', NODE_HEIGHT / 2 + 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', 16)
        .attr('font-weight', 'bold')
        .attr('fill', textColor)
        .text(initials);
    }

    const fullName = getFullName(node);
    const hasNickname = node.nickname && node.nickname.trim() !== '';

    // Calculate text area dimensions
    const textAreaWidth = nodeWidth - BASE_TEXT_OFFSET - TEXT_RIGHT_PADDING;
    const textAreaHeight = NODE_HEIGHT - 16; // Padding top and bottom
    const textStartX = BASE_TEXT_OFFSET;
    const textStartY = 8;

    // Use foreignObject to enable text wrapping
    const foreignObject = nodeGroup
      .append('foreignObject')
      .attr('x', textStartX)
      .attr('y', textStartY)
      .attr('width', textAreaWidth)
      .attr('height', textAreaHeight);

    const textContainer = foreignObject
      .append('xhtml:div')
      .style('width', '100%')
      .style('height', '100%')
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('justify-content', 'center')
      .style('overflow', 'hidden');

    // Name with wrapping (max 2 lines)
    textContainer
      .append('xhtml:div')
      .style('font-size', '13px')
      .style('font-weight', '600')
      .style('color', '#1e293b')
      .style('line-height', '1.2')
      .style('overflow', 'hidden')
      .style('word-break', 'break-word')
      .text(fullName);

    // Add nickname below the name if exists
    if (hasNickname) {
      textContainer
        .append('xhtml:div')
        .style('font-size', '11px')
        .style('font-style', 'italic')
        .style('color', '#64748b')
        .style('line-height', '1.2')
        .style('margin-top', '2px')
        .style('overflow', 'hidden')
        .style('word-break', 'break-word')
        .text(`"${node.nickname}"`);
    }

    nodeGroup
      .on('mouseenter', function () {
        d3.select(this)
          .select('rect:nth-child(2)')
          .transition()
          .duration(150)
          .attr('stroke', '#10b981')
          .attr('stroke-width', 2);
      })
      .on('mouseleave', function () {
        if (selectedNodeId !== node.id) {
          d3.select(this)
            .select('rect:nth-child(2)')
            .transition()
            .duration(150)
            .attr('stroke', strokeColor)
            .attr('stroke-width', 1);
        }
      });
  });
}
