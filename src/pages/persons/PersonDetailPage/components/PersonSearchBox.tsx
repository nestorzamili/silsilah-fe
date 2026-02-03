import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getFullName } from '@/utils/person';
import type { Person, RelationshipType } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';

interface PersonSearchBoxProps {
  currentType: RelationshipType;
  searchResults: Person[];
  isSearching: boolean;
  searchQuery: string;
  onSearch: (query: string) => void;
  onAddPerson: (person: Person) => void;
  selectedPersonIds: string[];
  inputValue?: string;
  onInputChange?: (value: string) => void;
}

export function PersonSearchBox({
  currentType,
  searchResults,
  isSearching,
  onSearch,
  onAddPerson,
  selectedPersonIds,
  inputValue,
  onInputChange,
}: PersonSearchBoxProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState('');

  const debouncedSearch = useDebounce(internalValue, 300);

  useEffect(() => {
    if (debouncedSearch) {
      onSearch(debouncedSearch);
      if (onInputChange) {
        onInputChange(debouncedSearch);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const getTypeLabel = () => {
    switch (currentType) {
      case 'PARENT':
        return 'orang tua';
      case 'SPOUSE':
        return 'pasangan';
      default:
        return 'orang';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-slate-700">
        Cari {getTypeLabel()}
      </h3>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {inputValue ? inputValue : `Cari ${getTypeLabel()}...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={`Ketik nama ${getTypeLabel()}...`}
              value={internalValue}
              onValueChange={setInternalValue}
            />
            <CommandList>
              {isSearching ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Mencari...
                </div>
              ) : (
                <CommandEmpty>
                  {internalValue.length < 2
                    ? 'Ketik minimal 2 karakter'
                    : 'Tidak ditemukan.'}
                </CommandEmpty>
              )}

              {searchResults.length > 0 && (
                <CommandGroup heading="Hasil Pencarian">
                  {searchResults.map((person) => (
                    <CommandItem
                      key={person.id}
                      value={person.id}
                      onSelect={() => {
                        onAddPerson(person);
                        setOpen(false);
                        setInternalValue(''); // Reset search after selection
                      }}
                      disabled={selectedPersonIds.includes(person.id)}
                      className="flex items-center gap-3 py-2 cursor-pointer"
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage
                          src={person.avatar_url}
                          alt={getFullName(person)}
                        />
                        <AvatarFallback className="text-xs">
                          {getFullName(person).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {getFullName(person)}
                        </span>
                        {person.nickname && (
                          <span className="text-xs text-muted-foreground italic">
                            "{person.nickname}"
                          </span>
                        )}
                      </div>
                      {selectedPersonIds.includes(person.id) && (
                        <Check className="ml-auto h-4 w-4 opacity-50" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
