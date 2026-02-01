import { useEffect, useRef, useCallback, useState } from 'react';
import * as d3 from 'd3';
import type { GraphNode } from '@/types';
import type {
  UseTreeRendererProps,
  TreeRendererReturn,
} from './tree-renderer/types';
import { calculateTreeLayout } from './tree-renderer/layout';
import {
  renderSpouseEdges,
  renderParentEdgesWithFamilyUnits,
  renderNodes,
} from './tree-renderer/renderer';

export type { UseTreeRendererProps, TreeRendererReturn };

export function useTreeRenderer({
  graph,
  selectedNodeId,
  onNodeClick,
}: UseTreeRendererProps): TreeRendererReturn {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const gRef = useRef<d3.Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  > | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });

  const renderDataRef = useRef<{
    filteredNodes: GraphNode[];
    nodePositions: Map<string, { x: number; y: number }>;
    nodeWidths: Map<string, number>;
  } | null>(null);

  const handleZoomIn = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 1.3);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 0.7);
    }
  }, []);

  const handleResetView = useCallback(() => {
    if (svgRef.current && zoomRef.current && containerRef.current) {
      const width = containerRef.current.clientWidth;
      d3.select(svgRef.current)
        .transition()
        .duration(500)
        .call(
          zoomRef.current.transform,
          d3.zoomIdentity.translate(width / 2, 50).scale(1),
        );
    }
  }, []);

  useEffect(() => {
    if (!graph || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const filteredNodes = graph.nodes;
    const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
    const filteredEdges = graph.edges.filter(
      (e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target),
    );

    const { nodePositions, nodeWidths, familyUnits, spouseEdgeInfo } =
      calculateTreeLayout(filteredNodes, filteredEdges);

    const spouseEdges = filteredEdges.filter((e) => e.type === 'SPOUSE');

    renderDataRef.current = {
      filteredNodes,
      nodePositions,
      nodeWidths,
    };

    const g = svg.append('g');
    gRef.current = g;

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
        setTransform({
          x: event.transform.x,
          y: event.transform.y,
          k: event.transform.k,
        });
      });

    zoomRef.current = zoom;
    svg
      .attr('width', width)
      .attr('height', height)
      .call(zoom)
      .call(zoom.transform, d3.zoomIdentity.translate(width / 2, 80).scale(1));

    renderSpouseEdges(
      g,
      spouseEdges,
      nodePositions,
      nodeWidths,
      spouseEdgeInfo,
    );
    renderParentEdgesWithFamilyUnits(g, familyUnits, nodePositions, nodeWidths);
    renderNodes(
      g,
      filteredNodes,
      nodePositions,
      nodeWidths,
      selectedNodeId,
      onNodeClick,
    );

    const svgElement = svgRef.current;

    return () => {
      if (svgElement) {
        d3.select(svgElement).on('.zoom', null);
        d3.select(svgElement).selectAll('*').remove();
      }
      renderDataRef.current = null;
      gRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph]);

  useEffect(() => {
    if (!gRef.current || !renderDataRef.current) return;

    const { filteredNodes, nodePositions, nodeWidths } = renderDataRef.current;

    gRef.current.selectAll('.nodes-group').remove();

    renderNodes(
      gRef.current,
      filteredNodes,
      nodePositions,
      nodeWidths,
      selectedNodeId,
      onNodeClick,
    );
  }, [selectedNodeId, onNodeClick]);

  return {
    svgRef,
    containerRef,
    transform,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
  };
}
