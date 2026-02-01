import { create } from 'zustand';
import type { FamilyGraph, GraphNode } from '@/types';

interface TreeViewState {
  graph: FamilyGraph | null;
  isLoading: boolean;
  error: string | null;

  selectedNodeId: string | null;
  hoveredNodeId: string | null;

  zoom: number;
  panX: number;
  panY: number;
  showPhotos: boolean;

  setGraph: (graph: FamilyGraph | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  selectNode: (nodeId: string | null) => void;
  hoverNode: (nodeId: string | null) => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;
  togglePhotos: () => void;

  getSelectedNode: () => GraphNode | null;
}

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.25;

export const useTreeViewStore = create<TreeViewState>((set, get) => ({
  graph: null,
  isLoading: false,
  error: null,
  selectedNodeId: null,
  hoveredNodeId: null,
  zoom: 1,
  panX: 0,
  panY: 0,
  showPhotos: true,

  setGraph: (graph) => set({ graph, error: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  hoverNode: (nodeId) => set({ hoveredNodeId: nodeId }),

  setZoom: (zoom) =>
    set({ zoom: Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM) }),

  zoomIn: () => {
    const { zoom } = get();
    set({ zoom: Math.min(zoom + ZOOM_STEP, MAX_ZOOM) });
  },

  zoomOut: () => {
    const { zoom } = get();
    set({ zoom: Math.max(zoom - ZOOM_STEP, MIN_ZOOM) });
  },

  setPan: (x, y) => set({ panX: x, panY: y }),

  resetView: () =>
    set({
      zoom: 1,
      panX: 0,
      panY: 0,
      selectedNodeId: null,
    }),

  togglePhotos: () => set((state) => ({ showPhotos: !state.showPhotos })),

  getSelectedNode: () => {
    const { graph, selectedNodeId } = get();
    if (!graph || !selectedNodeId) return null;
    return graph.nodes.find((n) => n.id === selectedNodeId) ?? null;
  },
}));
