"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MultiSelectFilterProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

export function MultiSelectFilter({ label, options, selected, onChange }: MultiSelectFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [tempSelected, setTempSelected] = useState<string[]>(selected);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            setTempSelected(selected);
        }
    };

    const isAllOption = (opt: string) => opt.toLowerCase().startsWith("all ");

    const handleToggle = (option: string, checked: boolean) => {
        if (isAllOption(option)) {
            if (checked) {
                setTempSelected(options);
            } else {
                setTempSelected([]);
            }
        } else {
            if (checked) {
                const nextSelected = [...tempSelected, option];
                // Check if all other normal options are selected now
                const nonAllOptions = options.filter(opt => !isAllOption(opt));
                const allSelected = nonAllOptions.every(opt => nextSelected.includes(opt));

                if (allSelected) {
                    setTempSelected(options);
                } else {
                    setTempSelected(nextSelected);
                }
            } else {
                // If unchecking a normal option, make sure 'All' is also unchecked
                setTempSelected(tempSelected.filter((item) => item !== option && !isAllOption(item)));
            }
        }
    };

    const handleClear = () => {
        setTempSelected([]);
        onChange([]);
        setIsOpen(false);
    };

    const handleSave = () => {
        onChange(tempSelected);
        setIsOpen(false);
    };

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <button className="flex h-11 w-full md:w-64 items-center justify-between rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                    <span className="font-medium">{label}</span>
                    {isOpen ? <ChevronUp className="h-4 w-4 opacity-50" /> : <ChevronDown className="h-4 w-4 opacity-50" />}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-2rem)] md:w-64 p-0 rounded-xl shadow-lg border border-border" align="start">
                <div className="max-h-60 overflow-y-auto p-2 space-y-1 pt-3 pb-3">
                    {options.map((option) => (
                        <div key={option} className="flex flex-row items-center space-x-3 px-2 py-1.5 hover:bg-muted/50 rounded-md">
                            <Checkbox
                                id={`${label}-${option}`}
                                checked={tempSelected.includes(option)}
                                onCheckedChange={(checked) => handleToggle(option, !!checked)}
                            />
                            <label
                                htmlFor={`${label}-${option}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                            >
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="flex border-t border-border overflow-hidden rounded-b-xl">
                    <button
                        onClick={handleClear}
                        className="flex-1 py-3 text-sm font-medium text-primary bg-background hover:bg-muted transition-colors"
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-3 text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
                    >
                        Save
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
