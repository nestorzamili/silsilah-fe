import type { UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { FormSection } from './FormSection';
import {
  BasicInfoCard,
  BirthInfoCard,
  AdditionalInfoCard,
  ContactInfoCard,
} from './index';
import type { PersonFormData } from '../schema';

interface PersonFormContentProps {
  form: UseFormReturn<PersonFormData>;
  onSubmit: (data: PersonFormData) => void;
  isEditing: boolean;
  isSubmitting: boolean;
  isAlive: boolean;
  id?: string;
  isMember?: boolean;
}

export function PersonFormContent({
  form,
  onSubmit,
  isEditing,
  isSubmitting,
  isAlive,
  id,
  isMember = false,
}: PersonFormContentProps) {
  const navigate = useNavigate();

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 lg:bg-white">
      <div className="mx-auto max-w-6xl p-4 lg:p-8">
        {/* Header - Hidden on mobile since ProfilePreview shows title */}
        <div className="hidden lg:block mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {isMember
              ? isEditing
                ? 'Ajukan Perubahan Profil'
                : 'Ajukan Penambahan Orang Baru'
              : isEditing
                ? 'Edit Profil'
                : 'Tambah Orang Baru'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isMember
              ? isEditing
                ? 'Ajukan perubahan informasi profil orang ini untuk ditinjau oleh editor'
                : 'Ajukan penambahan orang baru ke silsilah untuk ditinjau oleh editor'
              : isEditing
                ? 'Perbarui informasi profil orang ini'
                : 'Isi informasi untuk menambahkan orang baru ke silsilah'}
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 lg:space-y-8"
          >
            {/* Mobile: Stack all sections, Desktop: 2 columns */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
              <div className="space-y-6 lg:space-y-8">
                <FormSection
                  title="Informasi Dasar"
                  description="Nama dan identitas dasar"
                >
                  <BasicInfoCard form={form} />
                </FormSection>

                <FormSection
                  title="Tanggal & Tempat"
                  description="Informasi kelahiran dan kematian"
                >
                  <BirthInfoCard form={form} isAlive={isAlive} />
                </FormSection>
              </div>

              <div className="space-y-6 lg:space-y-8">
                <FormSection
                  title="Kontak"
                  description="Informasi kontak yang bisa dihubungi"
                >
                  <ContactInfoCard form={form} />
                </FormSection>

                <FormSection
                  title="Informasi Tambahan"
                  description="Pekerjaan, agama, dan lainnya"
                >
                  <AdditionalInfoCard form={form} />
                </FormSection>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() =>
                    navigate(isEditing ? `/persons/${id}` : '/persons')
                  }
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      {isMember ? 'Mengirim...' : 'Menyimpan...'}
                    </>
                  ) : isMember ? (
                    isEditing ? (
                      'Ajukan Perubahan'
                    ) : (
                      'Ajukan Penambahan'
                    )
                  ) : isEditing ? (
                    'Simpan Perubahan'
                  ) : (
                    'Tambah Orang'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
