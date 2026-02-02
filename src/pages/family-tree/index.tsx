import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { graphService, personService } from '@/services';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useTreeViewStore } from '@/stores';
import { useTreeRenderer } from '@/hooks/useTreeRenderer';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { SEO } from '@/components/SEO';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import type { PersonWithRelationships } from '@/types';
import { TreeControls } from './components/TreeControls';
import { TreeLegend } from './components/TreeLegend';
import { FamilyTreeSidePanel } from './components/FamilyTreeSidePanel';

export function FamilyTreePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidePanelPerson, setSidePanelPerson] =
    useState<PersonWithRelationships | null>(null);
  const [sidePanelLoading, setSidePanelLoading] = useState(false);

  const { selectedNodeId, selectNode } = useTreeViewStore();

  const {
    data: graph,
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.GRAPH,
    queryFn: () => graphService.getFullGraph(),
  });

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
  }, [location.pathname, selectNode]);

  const {
    svgRef,
    containerRef,
    transform,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
  } = useTreeRenderer({
    graph,
    selectedNodeId,
    onNodeClick: handleNodeClick,
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <EmptyState
          icon={ChartBarIcon}
          title="Gagal memuat silsilah"
          description="Terjadi kesalahan saat memuat data silsilah keluarga Anda."
        />
      </div>
    );
  }

  if (!graph || graph.nodes.length === 0) {
    return (
      <>
        <SEO
          title="Pohon Keluarga - Silsilah Keluarga"
          description="Bangun pohon keluarga Anda. Tambahkan anggota keluarga pertama untuk memulai membuat silsilah keluarga secara digital."
          keywords={[
            'pohon keluarga',
            'silsilah',
            'keluarga',
            'grafik keluarga',
            'visualisasi keluarga',
          ]}
          canonical="https://silsilah.zamili.dev/tree"
        />
        <div className="flex flex-1 items-center justify-center p-6">
          <EmptyState
            icon={ChartBarIcon}
            title="Belum ada anggota keluarga"
            description="Mulai bangun silsilah keluarga Anda dengan menambahkan anggota pertama."
            action={{
              label: 'Tambah Orang Pertama',
              onClick: () => navigate('/persons/new'),
            }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Pohon Keluarga - Silsilah Keluarga"
        description="Jelajahi pohon keluarga Anda secara interaktif. Visualisasikan hubungan keluarga dan silsilah keluarga secara digital."
        keywords={[
          'pohon keluarga',
          'silsilah',
          'keluarga',
          'grafik keluarga',
          'visualisasi keluarga',
          'hubungan keluarga',
        ]}
        canonical="https://silsilah.zamili.dev/tree"
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="relative flex-1 overflow-hidden" ref={containerRef}>
          <svg
            ref={svgRef}
            className="h-full w-full bg-white"
            style={{ cursor: 'grab' }}
          />

          <TreeLegend />

          <TreeControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onFit={handleResetView}
            zoomLevel={transform.k}
          />
        </div>

        {selectedNodeId && (
          <FamilyTreeSidePanel
            person={sidePanelPerson}
            loading={sidePanelLoading}
            onClose={closeSidePanel}
          />
        )}
      </div>
    </>
  );
}

export default FamilyTreePage;
