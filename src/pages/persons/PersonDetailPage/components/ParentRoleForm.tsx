import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ParentRoleFormProps {
  currentParentRole: 'FATHER' | 'MOTHER' | undefined;
  childOrder: string;
  onParentRoleChange: (role: 'FATHER' | 'MOTHER') => void;
  onChildOrderChange: (value: string) => void;
}

export function ParentRoleForm({
  currentParentRole,
  childOrder,
  onParentRoleChange,
  onChildOrderChange,
}: ParentRoleFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-slate-700 mb-3">Peran Orang Tua</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant={currentParentRole === 'FATHER' ? 'default' : 'outline'}
            className={`h-11 ${
              currentParentRole === 'FATHER' ? 'bg-blue-600 hover:bg-blue-700' : ''
            }`}
            onClick={() => onParentRoleChange('FATHER')}
          >
            Ayah
          </Button>
          <Button
            type="button"
            variant={currentParentRole === 'MOTHER' ? 'default' : 'outline'}
            className={`h-11 ${
              currentParentRole === 'MOTHER' ? 'bg-rose-600 hover:bg-rose-700' : ''
            }`}
            onClick={() => onParentRoleChange('MOTHER')}
          >
            Ibu
          </Button>
        </div>
      </div>
                
      <div>
        <label htmlFor="childOrder" className="text-sm font-medium text-slate-700">
          Urutan Anak (Opsional)
        </label>
        <Input
          id="childOrder"
          type="number"
          min="1"
          max="99"
          value={childOrder}
          onChange={(e) => onChildOrderChange(e.target.value)}
          placeholder="Kosongkan untuk otomatis"
        />
        <p className="mt-1 text-xs text-slate-500">
          Urutan kelahiran (1 = sulung, 2 = kedua, dst)
        </p>
      </div>
    </div>
  );
}
