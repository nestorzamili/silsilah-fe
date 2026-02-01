import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface LifeStatusCardProps {
  livingMembers: number;
  deceasedMembers: number;
  totalMembers: number;
}

export function LifeStatusCard({ 
  livingMembers, 
  deceasedMembers, 
  totalMembers 
}: LifeStatusCardProps) {
  const livingPercentage = totalMembers > 0 ? (livingMembers / totalMembers) * 100 : 0;
  
  return (
    <Card className="p-6 bg-white border-slate-200 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Status Kehidupan</h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Anggota yang masih hidup dan yang telah meninggal</p>
      </div>
      
      {totalMembers > 0 ? (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-3 w-3 rounded border-2 border-emerald-500 bg-emerald-100" />
              <span className="text-sm font-medium text-slate-700">Hidup</span>
              <span className="ml-auto text-sm font-bold text-slate-900">
                {livingMembers} <span className="text-slate-500 font-medium">({livingPercentage.toFixed(1)}%)</span>
              </span>
            </div>
            <Progress value={livingPercentage} className="h-2.5 bg-emerald-100 [&>div]:bg-emerald-500" />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-3 w-3 rounded border-2 border-slate-500 bg-slate-100" />
              <span className="text-sm font-medium text-slate-700">Meninggal</span>
              <span className="ml-auto text-sm font-bold text-slate-900">
                {deceasedMembers} <span className="text-slate-500 font-medium">({(100 - livingPercentage).toFixed(1)}%)</span>
              </span>
            </div>
            <Progress value={100 - livingPercentage} className="h-2.5 bg-slate-200 [&>div]:bg-slate-500" />
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic text-center py-8">Belum ada data anggota</p>
      )}
    </Card>
  );
}
