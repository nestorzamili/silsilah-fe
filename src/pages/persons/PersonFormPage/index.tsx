import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { personService, mediaService, changeRequestService } from '@/services';
import { useAuthStore } from '@/stores';
import { Spinner } from '@/components/ui/Spinner';
import { SEO } from '@/components/SEO';
import {
  personSchema,
  defaultFormValues,
  transformFormData,
  type PersonFormData,
} from './schema';
import {
  ProfilePreview,
  PersonFormContent,
} from './components';

export function PersonFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);
  
  const form = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),
    defaultValues: defaultFormValues,
  });

  const { data: person, isLoading: isLoadingPerson } = useQuery({
    queryKey: ['person', id],
    queryFn: () => personService.getById(id!),
    enabled: isEditing,
  });

  const createMutation = useMutation({
    mutationFn: personService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
      queryClient.invalidateQueries({ queryKey: ['graph'] });
      navigate(`/persons/${data.id}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: PersonFormData) =>
      personService.update(id!, transformFormData(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', id] });
      queryClient.invalidateQueries({ queryKey: ['persons'] });
      queryClient.invalidateQueries({ queryKey: ['graph'] });
      navigate(`/persons/${id}`);
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: changeRequestService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['change-requests'] });
      toast.success('Pengajuan berhasil dikirim', {
        description: 'Permintaan penambahan orang baru akan ditinjau oleh editor',
      });
      navigate('/persons');
    },
    onError: () => {
      toast.error('Pengajuan gagal', {
        description: 'Terjadi kesalahan saat mengirim pengajuan',
      });
    },
  });

  const updateRequestMutation = useMutation({
    mutationFn: changeRequestService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['change-requests'] });
      toast.success('Pengajuan berhasil dikirim', {
        description: 'Permintaan perubahan akan ditinjau oleh editor',
      });
      navigate(`/persons/${id}`);
    },
    onError: () => {
      toast.error('Pengajuan gagal', {
        description: 'Terjadi kesalahan saat mengirim pengajuan',
      });
    },
  });

  const watchedValues = useWatch({ control: form.control });
  
  const canEdit = currentUser?.role === 'editor' || currentUser?.role === 'developer';
  const isMember = currentUser?.role === 'member';
  
  useEffect(() => {
    if (canEdit === false && isMember === false) { 
      navigate(isEditing ? `/persons/${id}` : '/persons', { replace: true });
    }
  }, [canEdit, isMember, navigate, isEditing, id]);
  
  useEffect(() => {
    if (person) {
      form.reset({
        first_name: person.first_name || '',
        last_name: person.last_name || '',
        nickname: person.nickname || '',
        gender: person.gender || '',
        birth_date: person.birth_date?.split('T')[0] || '',
        birth_place: person.birth_place || '',
        death_date: person.death_date?.split('T')[0] || '',
        death_place: person.death_place || '',
        bio: person.bio || '',
        avatar_url: person.avatar_url || '',
        occupation: person.occupation || '',
        religion: person.religion || '',
        nationality: person.nationality || '',
        education: person.education || '',
        phone: person.phone || '',
        email: person.email || '',
        address: person.address || '',
        is_alive: person.is_alive ?? true,
      });
    }
  }, [person, form]);
  
  if (currentUser === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Spinner className="size-8" />
      </div>
    );
  }
  
  if (!canEdit && !isMember) {
    return null;
  }

  const onSubmit = (data: PersonFormData) => {
    const formData = transformFormData(data);
    if (canEdit) {
      if (isEditing) {
        updateMutation.mutate(data);
      } else {
        createMutation.mutate(formData);
      }
    }
  };

  const onSubmitRequest = (data: PersonFormData) => {
    const formData = transformFormData(data);
    if (isEditing) {
      updateRequestMutation.mutate({
        entity_type: 'PERSON',
        entity_id: id,
        action: 'UPDATE',
        payload: formData as unknown as Record<string, unknown>,
      });
    } else {
      createRequestMutation.mutate({
        entity_type: 'PERSON',
        action: 'CREATE',
        payload: formData as unknown as Record<string, unknown>,
      });
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const media = await mediaService.upload(file, id || 'temp', 'Profile Photo');
      form.setValue('avatar_url', media.url);
    } catch {
      console.error('Failed to upload photo');
    }
  };

  const isLoading = isLoadingPerson && isEditing;
  const isSubmitting = canEdit 
    ? (createMutation.isPending || updateMutation.isPending)
    : (createRequestMutation.isPending || updateRequestMutation.isPending);
  const {
    is_alive: isAlive = true,
    avatar_url: avatarUrl,
    first_name: firstName,
    last_name: lastName,
    nickname,
    gender,
    birth_date: birthDate,
    birth_place: birthPlace,
    occupation,
    religion,
    phone,
    email,
  } = watchedValues;
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Nama';

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <SEO
        title={isEditing ? "Edit Orang - Silsilah Keluarga" : "Tambah Orang - Silsilah Keluarga"}
        description={isEditing 
          ? "Edit informasi anggota keluarga di sistem silsilah keluarga." 
          : "Tambahkan anggota keluarga baru ke sistem silsilah keluarga."}
        keywords={['tambah orang', 'edit orang', 'keluarga', 'silsilah', 'profil']}
        noIndex={true}
        robots="noindex, follow"
      />
      <div className="flex h-screen flex-col bg-white lg:flex-row overflow-hidden">
        <ProfilePreview
          isEditing={isEditing}
          id={id}
          fullName={fullName}
          avatarUrl={avatarUrl}
          nickname={nickname}
          gender={gender}
          isAlive={isAlive}
          birthDate={birthDate}
          birthPlace={birthPlace}
          occupation={occupation}
          religion={religion}
          phone={phone}
          email={email}
          onPhotoUpload={handlePhotoUpload}
        />

        <PersonFormContent
          form={form}
          onSubmit={canEdit ? onSubmit : onSubmitRequest}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          isAlive={isAlive}
          id={id}
          isMember={isMember}
        />
      </div>
    </>
  );
}

export default PersonFormPage;
