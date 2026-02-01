import type { UseFormReturn } from 'react-hook-form';
import type { PersonFormData } from '../schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface AdditionalInfoCardProps {
  form: UseFormReturn<PersonFormData>;
}

export function AdditionalInfoCard({ form }: AdditionalInfoCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pekerjaan</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Guru, Dokter" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="religion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agama</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Islam, Kristen" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pendidikan</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: S1 Teknik" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kewarganegaraan</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Indonesia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Biografi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ceritakan tentang orang ini..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
