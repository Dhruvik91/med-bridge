'use client';

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface SearchableSelectItem {
    id: string;
    name: string;
}

interface SearchableSelectProps {
    items: SearchableSelectItem[];
    onSelect: (id: string) => void;
    onOthersClick: () => void;
    placeholder?: string;
    noResultsMessage?: string;
    className?: string;
    fullWidth?: boolean;
}

export function SearchableSelect({
    items,
    onSelect,
    onOthersClick,
    placeholder = "Search...",
    noResultsMessage = "No results found.",
    className,
    fullWidth = true
}: SearchableSelectProps) {
    const [open, setOpen] = useState(false);

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
                    <span className="truncate text-muted-foreground">
                        {placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder={placeholder} />
                    <CommandList>
                        <CommandEmpty>{noResultsMessage}</CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={item.name}
                                    onSelect={() => {
                                        onSelect(item.id);
                                        setOpen(false);
                                    }}
                                >
                                    {item.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <div className="p-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-start font-medium text-primary hover:text-primary hover:bg-secondary/50 h-9 px-2"
                            onClick={() => {
                                onOthersClick();
                                setOpen(false);
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Others
                        </Button>
                    </div>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
