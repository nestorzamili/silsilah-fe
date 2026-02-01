import type { UseFormReturn } from 'react-hook-form';
import type { PersonFormData } from '../schema';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface BirthInfoCardProps {
  form: UseFormReturn<PersonFormData>;
  isAlive: boolean;
}

export function BirthInfoCard({ form, isAlive }: BirthInfoCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="birth_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Lahir</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birth_place"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tempat Lahir</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Jakarta" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isAlive && (
          <>
            <FormField
              control={form.control}
              name="death_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Meninggal</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="death_place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempat Meninggal</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Bandung" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </div>
    </div>
  );
}
