import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { University } from '@/hooks/useUniversities';

const MAX_COMPARE = 4;

interface ComparisonContextType {
    compareList: University[];
    addToCompare: (university: University) => void;
    removeFromCompare: (universityId: string) => void;
    clearCompare: () => void;
    isInCompare: (universityId: string) => boolean;
    isFull: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [compareList, setCompareList] = useState<University[]>([]);

    const addToCompare = (university: University) => {
        setCompareList((prev) => {
            if (prev.find((u) => u.id === university.id)) return prev;
            if (prev.length >= MAX_COMPARE) return prev;
            return [...prev, university];
        });
    };

    const removeFromCompare = (universityId: string) => {
        setCompareList((prev) => prev.filter((u) => u.id !== universityId));
    };

    const clearCompare = () => setCompareList([]);

    const isInCompare = (universityId: string) =>
        compareList.some((u) => u.id === universityId);

    const isFull = compareList.length >= MAX_COMPARE;

    return (
        <ComparisonContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare, isFull }}>
            {children}
        </ComparisonContext.Provider>
    );
};

export const useComparison = () => {
    const ctx = useContext(ComparisonContext);
    if (!ctx) throw new Error('useComparison must be used within ComparisonProvider');
    return ctx;
};
