import { useState } from 'react';
import type { RelationshipInfo } from '@/types';
import { AddRelationshipModal } from './AddRelationshipModal';
import { RelationshipPersonCard } from './RelationshipPersonCard';
import { usePermissions } from '@/hooks/usePermissions';
import { PlusIcon } from '@heroicons/react/24/outline';

interface RelationshipsPanelProps {
  personId: string;
  relationships: RelationshipInfo[];
}

const CATEGORY_CONFIG = {
  PARENT: { label: 'Orang Tua', color: 'bg-amber-500' },
  SPOUSE: { label: 'Pasangan', color: 'bg-rose-500' },
  CHILD: { label: 'Anak', color: 'bg-sky-500' },
  SIBLING: { label: 'Saudara', color: 'bg-violet-500' },
} as const;

function getRelationshipLabel(rel: RelationshipInfo): string {
  switch (rel.type) {
    case 'PARENT':
      return rel.role === 'FATHER'
        ? 'Ayah'
        : rel.role === 'MOTHER'
          ? 'Ibu'
          : 'Orang Tua';
    case 'CHILD':
      return 'Anak';
    case 'SPOUSE':
      return 'Pasangan';
    case 'SIBLING':
      return rel.role === 'FULL' ? 'Saudara Kandung' : 'Saudara Tiri';
    default:
      return rel.type;
  }
}

function categorizeRelationships(relationships: RelationshipInfo[]) {
  const grouped = relationships.reduce(
    (acc, rel) => {
      if (!acc[rel.type]) acc[rel.type] = [];
      acc[rel.type].push(rel);
      return acc;
    },
    {} as Record<string, RelationshipInfo[]>,
  );

  return Object.entries(CATEGORY_CONFIG)
    .filter(([type]) => grouped[type]?.length > 0)
    .map(([type, config]) => ({
      type,
      ...config,
      items: grouped[type],
    }));
}

export function RelationshipsPanel({
  personId,
  relationships,
}: RelationshipsPanelProps) {
  const { canEdit } = usePermissions();
  const categories = categorizeRelationships(relationships);
  const totalRelations = relationships.length;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-slate-900">
            Hubungan Keluarga
          </h2>
          {totalRelations > 0 && (
            <p className="mt-0.5 text-sm text-slate-600">
              {totalRelations} orang terhubung
            </p>
          )}
        </div>
        <button
          onClick={() => {}}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${canEdit ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'}`}
        >
          <PlusIcon className="h-4 w-4" />
          Tambah
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="py-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <svg
              className="h-6 w-6 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-slate-600">Belum ada hubungan keluarga</p>
          <button
            onClick={() => {}}
            className={`mt-2 text-sm font-medium ${canEdit ? 'text-emerald-600 hover:text-emerald-700 cursor-pointer' : 'text-slate-400 cursor-not-allowed opacity-50'}`}
          >
            + Tambah hubungan pertama
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.type}>
              <div className="mb-3 flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${category.color}`} />
                <span className="text-sm font-medium text-slate-700">
                  {category.label}
                </span>
                <span className="text-sm text-slate-400">
                  {category.items.length}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {category.items.map((rel, index) => {
                  if (!rel.related_person) return null;
                  return (
                    <RelationshipPersonCard
                      key={`${rel.type}-${rel.related_person.id}-${index}`}
                      person={rel.related_person}
                      label={getRelationshipLabel(rel)}
                      relationshipId={
                        rel.type !== 'SIBLING' ? rel.id : undefined
                      }
                      personId={personId}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

interface RelationshipsPanelWithAddModalProps {
  personId: string;
  relationships: RelationshipInfo[];
  personName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  existingData?: any;
}

export function RelationshipsPanelWithAddModal({
  personId,
  relationships,
  personName,
  existingData,
}: RelationshipsPanelWithAddModalProps) {
  const { canModify } = usePermissions();
  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-slate-900">
              Hubungan Keluarga
            </h2>
            {relationships.length > 0 && (
              <p className="mt-0.5 text-sm text-slate-600">
                {relationships.length} orang terhubung
              </p>
            )}
          </div>
          {canModify && (
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
            >
              <PlusIcon className="h-4 w-4" />
              Tambah
            </button>
          )}
        </div>

        {relationships.length === 0 ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <svg
                className="h-6 w-6 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-slate-600">
              Belum ada hubungan keluarga
            </p>
            {canModify && (
              <button
                onClick={() => setAddModalOpen(true)}
                className="mt-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                + Tambah hubungan pertama
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {categorizeRelationships(relationships).map((category) => (
              <div key={category.type}>
                <div className="mb-3 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${category.color}`} />
                  <span className="text-sm font-medium text-slate-700">
                    {category.label}
                  </span>
                  <span className="text-sm text-slate-400">
                    {category.items.length}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {category.items.map((rel, index) => {
                    if (!rel.related_person) return null;
                    return (
                      <RelationshipPersonCard
                        key={`${rel.type}-${rel.related_person.id}-${index}`}
                        person={rel.related_person}
                        label={getRelationshipLabel(rel)}
                        relationshipId={
                          rel.type !== 'SIBLING' ? rel.id : undefined
                        }
                        personId={personId}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <AddRelationshipModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        personId={personId}
        personName={personName}
        existingData={existingData}
      />
    </>
  );
}
