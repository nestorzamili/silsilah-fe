import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface GenderDistributionCardProps {
  maleCount: number;
  femaleCount: number;
  totalMembers: number;
}

export function GenderDistributionCard({ 
  maleCount, 
  femaleCount, 
  totalMembers 
}: GenderDistributionCardProps) {
  return (
    <Card className="p-6 bg-white border-slate-200 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Distribusi Gender</h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Perbandingan anggota berdasarkan jenis kelamin</p>
      </div>
      
      {totalMembers > 0 ? (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded border-2 border-blue-500 bg-blue-100" />
                <span className="text-sm font-medium text-slate-700">Laki-laki</span>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {maleCount} <span className="text-slate-500 font-medium">({((maleCount / totalMembers) * 100).toFixed(1)}%)</span>
              </span>
            </div>
            <Progress value={(maleCount / totalMembers) * 100} className="h-2.5 bg-blue-100 [&>div]:bg-blue-500" />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded border-2 border-pink-500 bg-pink-100" />
                <span className="text-sm font-medium text-slate-700">Perempuan</span>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {femaleCount} <span className="text-slate-500 font-medium">({((femaleCount / totalMembers) * 100).toFixed(1)}%)</span>
              </span>
            </div>
            <Progress value={(femaleCount / totalMembers) * 100} className="h-2.5 bg-pink-100 [&>div]:bg-pink-500" />
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic text-center py-8">Belum ada data anggota</p>
      )}
    </Card>
  );
}
