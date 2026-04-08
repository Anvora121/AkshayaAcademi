import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Globe, MapPin, BookOpen, Building2, Save, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/config';
import { toast } from 'sonner';

interface ProfileData {
  name?: string;
  phone?: string;
  nationality?: string;
  dob?: string;
  domain?: string;
  preferredCountries?: string[];
  preferredUniversities?: string[];
  ugDegree?: string;
  specialization?: string;
  college?: string;
  cgpa?: number;
  backlogs?: number;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: ProfileData;
  onSaved: (updated: ProfileData) => void;
}

const COUNTRY_OPTIONS = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Netherlands', 'Ireland', 'New Zealand', 'Singapore',
];

const InputField: React.FC<{
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, icon, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
      <span className="text-accent">{icon}</span>
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  'w-full px-3.5 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-all';

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen, onClose, initialData, onSaved,
}) => {
  const [form, setForm] = useState<ProfileData>({ ...initialData });
  const [isSaving, setIsSaving] = useState(false);
  const [countryInput, setCountryInput] = useState('');

  const set = (key: keyof ProfileData, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleCountry = (country: string) => {
    const current = form.preferredCountries ?? [];
    if (current.includes(country)) {
      set('preferredCountries', current.filter((c) => c !== country));
    } else if (current.length < 5) {
      set('preferredCountries', [...current, country]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/onboarding/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to save');
      }

      const data = await res.json();
      toast.success('Profile updated successfully!');
      onSaved(data.profile ?? form);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background border border-border rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
              <div>
                <h2 className="text-lg font-bold text-foreground">Edit Profile</h2>
                <p className="text-xs text-muted-foreground">Update your personal and academic details</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal */}
              <section>
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-accent/10 text-accent"><User className="w-3.5 h-3.5" /></span>
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Full Name" icon={<User className="w-3 h-3" />}>
                    <input
                      className={inputCls}
                      value={form.name ?? ''}
                      onChange={(e) => set('name', e.target.value)}
                      placeholder="Your full name"
                    />
                  </InputField>
                  <InputField label="Phone" icon={<Phone className="w-3 h-3" />}>
                    <input
                      className={inputCls}
                      value={form.phone ?? ''}
                      onChange={(e) => set('phone', e.target.value)}
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </InputField>
                  <InputField label="Nationality" icon={<Globe className="w-3 h-3" />}>
                    <input
                      className={inputCls}
                      value={form.nationality ?? ''}
                      onChange={(e) => set('nationality', e.target.value)}
                      placeholder="e.g. Indian"
                    />
                  </InputField>
                  <InputField label="Date of Birth" icon={<User className="w-3 h-3" />}>
                    <input
                      type="date"
                      className={inputCls}
                      value={form.dob ? form.dob.slice(0, 10) : ''}
                      onChange={(e) => set('dob', e.target.value)}
                    />
                  </InputField>
                </div>
              </section>

              <hr className="border-border" />

              {/* Study Preferences */}
              <section>
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-accent/10 text-accent"><MapPin className="w-3.5 h-3.5" /></span>
                  Study Preferences
                </h3>
                <div className="space-y-4">
                  <InputField label="Domain / Field of Study" icon={<BookOpen className="w-3 h-3" />}>
                    <input
                      className={inputCls}
                      value={form.domain ?? ''}
                      onChange={(e) => set('domain', e.target.value)}
                      placeholder="e.g. Computer Science, MBA, Engineering"
                    />
                  </InputField>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      <span className="text-accent"><Globe className="w-3 h-3" /></span>
                      Preferred Countries <span className="text-muted-foreground font-normal normal-case">(up to 5)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COUNTRY_OPTIONS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleCountry(c)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                            form.preferredCountries?.includes(c)
                              ? 'bg-accent text-white border-accent'
                              : 'bg-secondary/40 text-muted-foreground border-border hover:border-accent/50'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    {/* Custom country input */}
                    <div className="flex gap-2 mt-2">
                      <input
                        className={inputCls + ' flex-1'}
                        value={countryInput}
                        onChange={(e) => setCountryInput(e.target.value)}
                        placeholder="Add other country…"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (countryInput.trim()) {
                              toggleCountry(countryInput.trim());
                              setCountryInput('');
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (countryInput.trim()) {
                            toggleCountry(countryInput.trim());
                            setCountryInput('');
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors border border-accent/20"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <hr className="border-border" />

              {/* Academic */}
              <section>
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-accent/10 text-accent"><Building2 className="w-3.5 h-3.5" /></span>
                  Academic Background
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="UG Degree" icon={<BookOpen className="w-3 h-3" />}>
                    <input
                      className={inputCls}
                      value={form.ugDegree ?? ''}
                      onChange={(e) => set('ugDegree', e.target.value)}
                      placeholder="e.g. B.Tech, BCA, BSc"
                    />
                  </InputField>
                  <InputField label="Specialization" icon={<BookOpen className="w-3 h-3" />}>
                    <input
                      className={inputCls}
                      value={form.specialization ?? ''}
                      onChange={(e) => set('specialization', e.target.value)}
                      placeholder="e.g. Computer Science"
                    />
                  </InputField>
                  <InputField label="College / University" icon={<Building2 className="w-3 h-3" />}>
                    <input
                      className={inputCls}
                      value={form.college ?? ''}
                      onChange={(e) => set('college', e.target.value)}
                      placeholder="Your institution name"
                    />
                  </InputField>
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="CGPA" icon={<BookOpen className="w-3 h-3" />}>
                      <input
                        type="number"
                        step="0.01"
                        min={0}
                        max={10}
                        className={inputCls}
                        value={form.cgpa ?? ''}
                        onChange={(e) => set('cgpa', parseFloat(e.target.value))}
                        placeholder="0.00"
                      />
                    </InputField>
                    <InputField label="Backlogs" icon={<BookOpen className="w-3 h-3" />}>
                      <input
                        type="number"
                        min={0}
                        className={inputCls}
                        value={form.backlogs ?? ''}
                        onChange={(e) => set('backlogs', parseInt(e.target.value))}
                        placeholder="0"
                      />
                    </InputField>
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white hover:bg-accent/90 disabled:opacity-60 transition-all text-sm font-semibold"
                >
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                  ) : (
                    <><Save className="w-4 h-4" /> Save Changes</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
