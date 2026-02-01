import { Card } from '@/components/ui/card';

interface StatCardProps {
  name: string;
  value: number;
  description: string;
}

export function StatCard({ name, value, description }: StatCardProps) {
  return (
    <Card className="p-5 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        {name}
      </p>
      <p className="text-3xl font-bold text-slate-900 mb-1">
        {value.toLocaleString('id-ID')}
      </p>
      <p className="text-xs text-slate-500 font-medium">{description}</p>
    </Card>
  );
}
