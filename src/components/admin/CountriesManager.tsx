import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '@/config';
import { Search, Plus, Trash2, Globe } from 'lucide-react';
import { format } from 'date-fns';

export const CountriesManager = () => {
    const [countries, setCountries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Form State
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/country`, { credentials: 'include' });
            if (res.ok) setCountries(await res.json());
        } catch (error) {
            console.error("Failed to fetch countries", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCountry = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/country`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, code }),
                credentials: 'include'
            });

            if (res.ok) {
                const newCountry = await res.json();
                setCountries(prev => [...prev, newCountry]);
                setName('');
                setCode('');
            }
        } catch (error) {
            console.error("Failed to add country", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this country?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/admin/country/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                setCountries(prev => prev.filter(c => c._id !== id));
            }
        } catch (error) {
            console.error("Deletion failed", error);
        }
    };

    const filteredCountries = countries.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative max-w-sm w-full">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input 
                            type="text" placeholder="Search countries..." 
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-black border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-black border border-border rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold tracking-wider">Country Name</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Code</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Added On</th>
                                <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr><td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">Loading...</td></tr>
                            ) : filteredCountries.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">No countries found.</td></tr>
                            ) : filteredCountries.map((country) => (
                                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={country._id} className="hover:bg-secondary/20 transition-colors">
                                    <td className="px-6 py-4 font-medium flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-muted-foreground"/> {country.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-secondary rounded text-xs font-mono">{country.code}</span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{format(new Date(country.createdAt), 'MMM dd, yyyy')}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDelete(country._id)} className="p-1.5 rounded-md hover:bg-red-500/10 text-red-500 transition-colors tooltip">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Form */}
            <div className="bg-white dark:bg-black border border-border rounded-xl p-6 h-fit shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5"/> Add Country</h3>
                <form onSubmit={handleAddCountry} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Country Name</label>
                        <input 
                            required type="text" value={name} onChange={e => setName(e.target.value)}
                            className="w-full px-3 py-2 bg-transparent border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. United Kingdom"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">ISO Code (2-letter)</label>
                        <input 
                            required type="text" maxLength={2} value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                            className="w-full px-3 py-2 bg-transparent border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono"
                            placeholder="e.g. UK"
                        />
                    </div>
                    <button 
                        type="submit" disabled={isSubmitting}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Country'}
                    </button>
                </form>
            </div>
        </div>
    );
};
