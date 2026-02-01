import { useState, useCallback, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { graphService, personService } from '@/services';
import { useAuthStore, useTreeViewStore } from '@/stores';
import { useTreeRenderer } from '@/hooks/useTreeRenderer';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { IdentificationIcon, LinkIcon } from '@heroicons/react/24/outline';
import { TreeControls } from '@/pages/family-tree/components/TreeControls';
import { TreeLegend } from '@/pages/family-tree/components/TreeLegend';
import { FamilyTreeSidePanel } from '@/pages/family-tree/components/FamilyTreeSidePanel';
import type { PersonWithRelationships } from '@/types';

interface AncestorsTabProps {
  onSwitchToConnection: () => void;
}

export function AncestorsTab({ onSwitchToConnection }: AncestorsTabProps) {
  const { user } = useAuthStore();
  const { selectedNodeId, selectNode } = useTreeViewStore();
  const [sidePanelPerson, setSidePanelPerson] = useState<PersonWithRelationships | null>(null);
  const [sidePanelLoading, setSidePanelLoading] = useState(false);
  const [lineageSide, setLineageSide] = useState<'paternal' | 'maternal'>('paternal');

  const { data: splitAncestors, isLoading: isLoadingTree } = useQuery({
    queryKey: ['user-profile', 'split-ancestor-tree', user?.person_id],
    queryFn: () => graphService.getSplitAncestors(user!.person_id!),
    enabled: !!user?.person_id,
  });

  const currentTree = useMemo(() => {
    if (!splitAncestors) return undefined;
    return splitAncestors[lineageSide];
  }, [splitAncestors, lineageSide]);

  const ancestorGraph = useMemo(() => currentTree ? {
    nodes: currentTree.ancestors,
    edges: currentTree.edges
  } : undefined, [currentTree]);

  const handleNodeClick = useCallback(
    async (nodeId: string) => {
      selectNode(nodeId);
      setSidePanelLoading(true);
      try {
        const person = await personService.getById(nodeId);
        setSidePanelPerson(person);
      } catch (err) {
        console.error('Gagal memuat detail orang:', err);
      } finally {
        setSidePanelLoading(false);
      }
    },
    [selectNode],
  );

  const closeSidePanel = useCallback(() => {
    selectNode(null);
    setSidePanelPerson(null);
  }, [selectNode]);

  useEffect(() => {
    return () => {
      selectNode(null);
    };
  }, [selectNode]);

  const {
    svgRef,
    containerRef,
    transform,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
  } = useTreeRenderer({
    graph: ancestorGraph,
    selectedNodeId,
    onNodeClick: handleNodeClick,
  });

  if (!user?.person_id) {
    return (
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center p-8 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 border border-emerald-100/50">
          <LinkIcon className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Belum Terhubung</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto mt-2 mb-8 leading-relaxed font-medium">
          Hubungkan akun Anda dengan seseorang di silsilah keluarga untuk melihat garis keturunan Anda secara visual.
        </p>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-8 font-bold transition-all" onClick={onSwitchToConnection}>
          Hubungkan Sekarang
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50">
              <IdentificationIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Garis Keturunan</h2>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Visualisasi leluhur Anda</p>
            </div>
          </div>

          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setLineageSide('paternal')}
              className={`px-4 py-1.5 rounded-md text-[10px] font-bold tracking-wider transition-all ${
                lineageSide === 'paternal' 
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-200' 
                : 'text-slate-500 hover:text-emerald-600'
              }`}
            >
              GARIS AYAH
            </button>
            <button
              onClick={() => setLineageSide('maternal')}
              className={`px-4 py-1.5 rounded-md text-[10px] font-bold tracking-wider transition-all ${
                lineageSide === 'maternal' 
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-200' 
                : 'text-slate-500 hover:text-emerald-600'
              }`}
            >
              GARIS IBU
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          <div className="flex-1 relative bg-white overflow-hidden" ref={containerRef}>
            {isLoadingTree ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Spinner className="mb-4" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Memuat data...</p>
              </div>
            ) : currentTree && currentTree.ancestors.length > 1 ? (
              <>
                <svg 
                  ref={svgRef} 
                  className="h-full w-full" 
                  style={{ cursor: 'grab' }}
                />
                
                <div className="absolute left-4 top-4 rounded-lg border border-slate-200 bg-white/90 px-2.5 py-1 backdrop-blur-sm shadow-sm">
                  <span className="text-[10px] font-bold text-slate-600 tracking-wider">
                    ZOOM: {Math.round(transform.k * 100)}%
                  </span>
                </div>

                <TreeControls
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onFit={handleResetView}
                  zoomLevel={transform.k}
                />

                <TreeLegend />
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
                  <IdentificationIcon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {lineageSide === 'paternal' ? 'Garis Ayah' : 'Garis Ibu'} Belum Tersedia
                </h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto mt-1 leading-relaxed font-medium italic">
                  Data leluhur untuk sisi {lineageSide === 'paternal' ? 'ayah' : 'ibu'} belum ditemukan.
                </p>
              </div>
            )}
          </div>

          {selectedNodeId && (
            <FamilyTreeSidePanel
              person={sidePanelPerson}
              loading={sidePanelLoading}
              onClose={closeSidePanel}
            />
          )}
        </div>
      </div>
    </div>
  );
}
