import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Eye, Users, GraduationCap, Globe, CheckCircle,
  Clock, AlertCircle, ChevronUp, ChevronDown, Loader2,
} from 'lucide-react';
import { API_BASE_URL } from '@/config';
import { StudentProfileModal } from './StudentProfileModal';

interface StudentRow {
  _id: string;
  name?: string;
  email: string;
  phone?: string;
  nationality?: string;
  role: string;
  onboardingStep: number;
  onboardingComplete: boolean;
  subscriptionStatus: string;
  createdAt: string;
  preferences?: {
    domain?: string;
    preferredCountries?: string[];
  };
  education?: {
    cgpa?: number;
    degree?: string;
    college?: string;
  };
}

type SortKey = 'name' | 'email' | 'cgpa' | 'createdAt';
type SortDir = 'asc' | 'desc';

const StatusBadge: React.FC<{ complete: boolean; step: number }> = ({ complete, step }) => {
  if (complete) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">
        <CheckCircle className="w-3 h-3" />
        Complete
      </span>
    );
  }
  if (step > 1) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium border border-amber-500/20">
        <Clock className="w-3 h-3" />
        Step {step}/5
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-medium border border-border">
      <AlertCircle className="w-3 h-3" />
      Not Started
    </span>
  );
};

export const StudentsTable: React.FC = () => {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/users`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to load students');
        setStudents(await res.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetch_();
  }, []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = students
    .filter((s) => {
      const q = search.toLowerCase();
      return (
        s.name?.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.preferences?.domain?.toLowerCase().includes(q) ||
        s.preferences?.preferredCountries?.some((c) => c.toLowerCase().includes(q)) ||
        s.education?.college?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let av: any, bv: any;
      switch (sortKey) {
        case 'name': av = a.name ?? ''; bv = b.name ?? ''; break;
        case 'email': av = a.email; bv = b.email; break;
        case 'cgpa': av = a.education?.cgpa ?? 0; bv = b.education?.cgpa ?? 0; break;
        case 'createdAt': av = new Date(a.createdAt).getTime(); bv = new Date(b.createdAt).getTime(); break;
      }
      return sortDir === 'asc'
        ? av < bv ? -1 : av > bv ? 1 : 0
        : av > bv ? -1 : av < bv ? 1 : 0;
    });

  const SortIcon: React.FC<{ col: SortKey }> = ({ col }) =>
    sortKey === col ? (
      sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
    ) : (
      <ChevronUp className="w-3.5 h-3.5 opacity-30" />
    );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
        <span>Loading students…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Students', value: students.length, icon: <Users className="w-4 h-4" />, color: 'text-blue-400' },
          { label: 'Profile Complete', value: students.filter((s) => s.onboardingComplete).length, icon: <CheckCircle className="w-4 h-4" />, color: 'text-emerald-400' },
          { label: 'In Progress', value: students.filter((s) => !s.onboardingComplete && s.onboardingStep > 1).length, icon: <Clock className="w-4 h-4" />, color: 'text-amber-400' },
          { label: 'Subscribed', value: students.filter((s) => s.role === 'subscribed').length, icon: <GraduationCap className="w-4 h-4" />, color: 'text-purple-400' },
        ].map(({ label, value, icon, color }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-border bg-secondary/20"
          >
            <div className={`mb-2 ${color}`}>{icon}</div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          className="w-full pl-10 pr-4 py-2.5 bg-secondary/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-all"
          placeholder="Search by name, email, college, country, domain…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                {[
                  { key: 'name' as SortKey, label: 'Student' },
                  { key: 'email' as SortKey, label: 'Email' },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => toggleSort(key)}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      {label} <SortIcon col={key} />
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Country Pref</th>
                <th
                  onClick={() => toggleSort('cgpa')}
                  className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none"
                >
                  <div className="flex items-center gap-1">CGPA <SortIcon col="cgpa" /></div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-muted-foreground text-sm">
                    {search ? `No students match "${search}"` : 'No students registered yet.'}
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <motion.tr
                    key={s._id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {(s.name ?? s.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{s.name ?? '—'}</p>
                          <p className="text-xs text-muted-foreground">{s.education?.degree ?? 'No degree set'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground text-xs">{s.email}</td>
                    <td className="px-4 py-3.5">
                      {s.preferences?.preferredCountries?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {s.preferences.preferredCountries.slice(0, 2).map((c) => (
                            <span key={c} className="flex items-center gap-0.5 px-2 py-0.5 bg-secondary rounded-full text-xs text-muted-foreground">
                              <Globe className="w-2.5 h-2.5" /> {c}
                            </span>
                          ))}
                          {s.preferences.preferredCountries.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{s.preferences.preferredCountries.length - 2}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not set</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {s.education?.cgpa != null ? (
                        <span className="font-semibold text-foreground">{s.education.cgpa.toFixed(2)}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge complete={s.onboardingComplete} step={s.onboardingStep} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => setSelectedId(s._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors border border-accent/20"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-border bg-secondary/20 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing {filtered.length} of {students.length} students
            </p>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {selectedId && (
        <StudentProfileModal
          userId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
};
