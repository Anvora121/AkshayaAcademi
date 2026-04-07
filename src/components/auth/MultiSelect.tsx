import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Search, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MultiSelectProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    maxItems?: number;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    label,
    options,
    selected,
    onChange,
    placeholder = 'Select options...',
    maxItems,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filtered = options.filter(
        (o) => o.toLowerCase().includes(search.toLowerCase()) && !selected.includes(o)
    );

    const toggle = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter((s) => s !== option));
        } else {
            if (maxItems && selected.length >= maxItems) return;
            onChange([...selected, option]);
        }
    };

    return (
        <div className="flex flex-col gap-2 relative" ref={ref}>
            <label className="text-sm font-bold text-foreground/80 ml-1">{label}</label>

            {/* Selected pills */}
            <div className="flex flex-wrap gap-2 min-h-[40px]">
                <AnimatePresence mode="popLayout">
                    {selected.map((item) => (
                        <motion.span
                            key={item}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold bg-accent/10 text-accent border border-accent/20 rounded-full px-3 py-1.5 shadow-sm"
                        >
                            {item}
                            <button
                                type="button"
                                onClick={() => toggle(item)}
                                className="hover:bg-accent/20 rounded-full p-0.5 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </motion.span>
                    ))}
                    {selected.length === 0 && (
                        <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-muted-foreground/60 font-medium py-2 ml-1"
                        >
                            No selections yet
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Dropdown trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between bg-secondary/30 backdrop-blur-sm border border-border rounded-2xl px-5 py-4 text-base text-left transition-all hover:border-accent/50 focus:outline-none focus:ring-4 focus:ring-accent/10 font-medium group",
                    isOpen && "border-accent ring-4 ring-accent/10"
                )}
            >
                <span className={selected.length === 0 ? 'text-muted-foreground/60' : 'text-foreground'}>
                    {selected.length === 0 ? placeholder : `${selected.length} Selected`}
                </span>
                <ChevronDown
                    className={cn(
                        "w-5 h-5 text-muted-foreground/60 transition-transform duration-300 group-hover:text-accent",
                        isOpen ? 'rotate-180 text-accent' : ''
                    )}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-50 mt-2 w-full bg-white/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden"
                        style={{ top: '100%' }}
                    >
                        {/* Search */}
                        <div className="p-3 border-b border-border/30">
                            <div className="flex items-center gap-3 px-4 py-3 bg-secondary/20 rounded-xl">
                                <Search className="w-4 h-4 text-muted-foreground/60" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search options..."
                                    className="flex-1 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/50 font-medium"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                            {filtered.length === 0 ? (
                                <div className="px-4 py-8 text-center">
                                    <p className="text-sm text-muted-foreground/60 font-medium italic">No options found</p>
                                </div>
                            ) : (
                                filtered.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => toggle(option)}
                                        className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-accent/10 hover:text-accent rounded-xl transition-all duration-200 flex items-center justify-between group font-medium"
                                    >
                                        {option}
                                        <Check className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
