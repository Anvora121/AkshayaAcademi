import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '@/config';
import { Search, Plus, Trash2, Building2, MapPin, ExternalLink, X } from 'lucide-react';

export const UniversitiesManager = () => {
    const [universities, setUniversities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form
    const [formData, setFormData] = useState({ id: '', name: '', country: '', countryName: '', location: '', ranking: '', rankingSource: 'QS', rankingUpdatedAt: new Date().getFullYear().toString() });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchUniversities();
    }, []);

    const fetchUniversities = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/university`, { credentials: 'include' });
            if (res.ok) setUniversities(await res.json());
        } catch (error) {
            console.error("Failed to fetch universities", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = { ...formData, id: formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') };
            const res = await fetch(`${API_BASE_URL}/admin/university`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });
            if (res.ok) {
                const newUni = await res.json();
                setUniversities(prev => [...prev, newUni]);
                setIsModalOpen(false);
                setFormData({ id: '', name: '', country: '', countryName: '', location: '', ranking: '', rankingSource: 'QS', rankingUpdatedAt: new Date().getFullYear().toString() });
            }
        } catch (error) {
            console.error("Failed to add", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;
        try {
            const res = await fetch(`${API_BASE_URL}/admin/university/${id}`, { method: 'DELETE', credentials: 'include' });
            if (res.ok) setUniversities(prev => prev.filter(c => c._id !== id));
        } catch (error) { console.error("Deletion failed", error); }
    };

    const filtered = universities.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                        type="text" placeholder="Search universities..." 
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-black border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background font-medium rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                    <Plus className="w-4 h-4"/> Add University
                </button>
            </div>

            <div className="bg-white dark:bg-black border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                        <tr>
                            <th className="px-6 py-4 font-semibold tracking-wider">Institution</th>
                            <th className="px-6 py-4 font-semibold tracking-wider">Location</th>
                            <th className="px-6 py-4 font-semibold tracking-wider">Ranking</th>
                            <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {isLoading ? (
                            <tr><td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">No universities found.</td></tr>
                        ) : filtered.map((uni) => (
                            <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={uni._id} className="hover:bg-secondary/20 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-foreground flex items-center gap-2"><Building2 className="w-4 h-4 text-muted-foreground"/> {uni.name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3"/> {uni.location}, {uni.countryName}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 rounded-full text-xs font-bold border border-yellow-500/20">
                                        #{uni.ranking} ({uni.rankingSource})
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleDelete(uni._id, uni.name)} className="p-1.5 rounded-md hover:bg-red-500/10 text-red-500 transition-colors tooltip">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-border">
                                <h2 className="text-xl font-bold">Add University</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                    <X className="w-5 h-5"/>
                                </button>
                            </div>
                            <form onSubmit={handleAdd} className="p-6 space-y-4">
                                <div><label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Name</label>
                                    <input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Country ISO (ex: US)</label>
                                        <input required type="text" value={formData.country} onChange={e=>setFormData({...formData, country: e.target.value.toUpperCase()})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg outline-none" />
                                    </div>
                                    <div><label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Country Name</label>
                                        <input required type="text" value={formData.countryName} onChange={e=>setFormData({...formData, countryName: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg outline-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Location City</label>
                                        <input required type="text" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg outline-none" />
                                    </div>
                                    <div><label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Global Ranking</label>
                                        <input required type="number" value={formData.ranking} onChange={e=>setFormData({...formData, ranking: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg outline-none" />
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
                                    <button type="button" onClick={()=>setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg">Cancel</button>
                                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Save Details</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
