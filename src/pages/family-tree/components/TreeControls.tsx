import { Button } from '@/components/ui/button';
import {
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline';

interface TreeControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  zoomLevel: number;
}

export function TreeControls({
  onZoomIn,
  onZoomOut,
  onFit,
  zoomLevel,
}: TreeControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2 rounded-lg bg-white p-2 shadow-lg">
      <Button variant="secondary" size="sm" onClick={onZoomIn} title="Perbesar">
        <MagnifyingGlassPlusIcon className="h-5 w-5" />
      </Button>
      <div className="text-center text-xs text-slate-500">
        {Math.round(zoomLevel * 100)}%
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={onZoomOut}
        title="Perkecil"
      >
        <MagnifyingGlassMinusIcon className="h-5 w-5" />
      </Button>
      <div className="my-1 border-t border-slate-200" />
      <Button variant="secondary" size="sm" onClick={onFit} title="Sesuaikan">
        <ArrowsPointingOutIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}
