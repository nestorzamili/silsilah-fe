import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { getFullName } from '@/utils/person';
import type { Person, RelationshipType } from '@/types';

interface PersonSearchBoxProps {
  currentType: RelationshipType;
  searchResults: Person[];
  isSearching: boolean;
  searchQuery: string;
  onSearch: (query: string) => void;
  onAddPerson: (person: Person) => void;
  selectedPersonIds: string[];
}

export function PersonSearchBox({
  currentType,
  searchResults,
  isSearching,
  searchQuery,
  onSearch,
  onAddPerson,
  selectedPersonIds,
}: PersonSearchBoxProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-slate-700 mb-3">
        Cari {currentType === 'PARENT' ? 'Orang Tua' : 'Pasangan'}
      </h3>
      <div className="space-y-3">
        <div className="relative">
          <Input
            placeholder={`Cari ${currentType === 'PARENT' ? 'orang tua' : 'pasangan'}...`}
            onChange={async (e) => {
              const query = e.target.value;
              await onSearch(query);
            }}
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Spinner size="sm" />
            </div>
          )}
        </div>

        <div className="h-40 overflow-y-auto rounded-lg border border-slate-200">
          {isSearching ? (
            <div className="flex h-full items-center justify-center p-3 text-slate-500">
              Mencari...
            </div>
          ) : (
            <>
              {searchResults.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                  {searchResults.map((person: Person) => (
                    <li key={person.id} className="p-3 hover:bg-slate-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-200" />
                          <span className="font-medium">{getFullName(person)}</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onAddPerson(person)}
                          disabled={selectedPersonIds.includes(person.id)}
                        >
                          Tambah
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex h-full items-center justify-center p-3 text-slate-500">
                  {searchQuery ? 'Tidak ditemukan hasil' : 'Masukkan nama untuk mencari'}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
