import type { UseFormReturn } from 'react-hook-form';
import type { PersonFormData } from '../schema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface BasicInfoCardProps {
  form: UseFormReturn<PersonFormData>;
}

export function BasicInfoCard({ form }: BasicInfoCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nama Depan <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Ahmad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Belakang</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Santoso" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Panggilan</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Mad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Jenis Kelamin <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                key={field.value}
                onValueChange={field.onChange}
                value={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MALE">Laki-laki</SelectItem>
                  <SelectItem value="FEMALE">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_alive"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 pt-2 sm:col-span-2">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <Label className="mt-0! cursor-pointer">
                Orang ini masih hidup
              </Label>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
