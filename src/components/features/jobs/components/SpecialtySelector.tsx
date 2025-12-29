'use client';

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useGetSpecialties } from "@/hooks/get/useGetSpecialties";
import { Badge } from "@/components/ui/badge";

interface SpecialtySelectorProps {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    className?: string;
    fullWidth?: boolean;
}

export function SpecialtySelector({ selectedIds, onChange, className, fullWidth }: SpecialtySelectorProps) {
    const [open, setOpen] = useState(false);
    const { data: specialtiesData } = useGetSpecialties();
    const specialties = specialtiesData?.items ?? [];

    const toggleSpecialty = (id: string) => {
        const newIds = selectedIds.includes(id)
            ? selectedIds.filter((i) => i !== id)
            : [...selectedIds, id];
        onChange(newIds);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "justify-between h-10",
                        fullWidth ? "w-full" : "w-full md:w-[200px]",
                        className,
                    )}
                >
                    <span className="truncate">
                        {selectedIds.length === 0
                            ? "Select Specialties"
                            : `${selectedIds.length} selected`}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search specialty..." />
                    <CommandList>
                        <CommandEmpty>No specialty found.</CommandEmpty>
                        <CommandGroup>
                            {specialties.map((specialty) => (
                                <CommandItem
                                    key={specialty.id}
                                    value={specialty.name}
                                    onSelect={() => {
                                        toggleSpecialty(specialty.id);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedIds.includes(specialty.id) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {specialty.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
