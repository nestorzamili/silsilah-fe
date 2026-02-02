import * as d3 from 'd3';
import type { GraphNode } from '@/types';
import type { NodePosition } from '../types';
import { MIN_NODE_WIDTH, NODE_HEIGHT } from '../constants';
import { getFullName, getGenderColors } from '../utils';

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

    // Adjust vertical position based on whether there's a nickname
    const nameY = hasNickname ? NODE_HEIGHT / 2 - 3 : NODE_HEIGHT / 2 + 4;

    nodeGroup
      .append('text')
      .attr('x', 75)
      .attr('y', nameY)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', '#1e293b')
      .text(fullName);

    // Add nickname below the name if exists
    if (hasNickname) {
      nodeGroup
        .append('text')
        .attr('x', 75)
        .attr('y', NODE_HEIGHT / 2 + 12)
        .attr('font-size', 11)
        .attr('font-style', 'italic')
        .attr('fill', '#64748b')
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
