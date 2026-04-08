import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Mail, Phone, Globe, GraduationCap, FileText,
  ExternalLink, MapPin, Trophy, Loader2, CheckCircle2,
} from 'lucide-react';
import { API_BASE_URL } from '@/config';

interface FullProfile {
  name?: string;
  email: string;
  phone?: string;
  dob?: string;
  nationality?: string;
  role: string;
  onboardingComplete: boolean;
  subscriptionStatus: string;
  createdAt: string;
  domain?: string;
  preferredCountries?: string[];
  preferredUniversities?: string[];
  ugDegree?: string;
  specialization?: string;
  college?: string;
  cgpa?: number;
  backlogs?: number;
  testScores?: Record<string, number>;
  resumeURL?: string;
  transcriptURL?: string;
  sopURL?: string;
}

interface StudentProfileModalProps {
  userId: string;
  onClose: () => void;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  title, icon, children,
}) => (
  <div className="border border-border rounded-xl overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-3 bg-secondary/30 border-b border-border">
      <span className="text-accent">{icon}</span>
      <span className="text-sm font-semibold text-foreground">{title}</span>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const Field: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => {
  if (value == null || value === '') return null;
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-medium text-foreground">{String(value)}</p>
    </div>
  );
};

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ userId, onClose }) => {
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to load profile');
        setProfile(await res.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const hasTestScores = profile?.testScores &&
    Object.values(profile.testScores).some((v) => v > 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background border border-border rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
            <div>
              <h2 className="text-base font-bold text-foreground">
                {profile?.name ?? 'Student Profile'}
              </h2>
              <p className="text-xs text-muted-foreground">{profile?.email}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin text-accent" />
                Loading profile…
              </div>
            ) : error ? (
              <p className="text-center text-sm text-red-500 py-12">{error}</p>
            ) : profile ? (
              <>
                {/* Personal */}
                <Section title="Personal Details" icon={<User className="w-4 h-4" />}>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Name" value={profile.name} />
                    <Field label="Email" value={profile.email} />
                    <Field label="Phone" value={profile.phone} />
                    <Field label="Nationality" value={profile.nationality} />
                    <Field label="Date of Birth" value={profile.dob ? new Date(profile.dob).toLocaleDateString('en-IN') : null} />
                    <Field label="Role" value={profile.role} />
                    <Field label="Joined" value={new Date(profile.createdAt).toLocaleDateString('en-IN')} />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Profile Status</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                        profile.onboardingComplete
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-secondary text-muted-foreground border-border'
                      }`}>
                        {profile.onboardingComplete ? <><CheckCircle2 className="w-3 h-3" /> Complete</> : 'Incomplete'}
                      </span>
                    </div>
                  </div>
                </Section>

                {/* Preferences */}
                {(profile.domain || profile.preferredCountries?.length) && (
                  <Section title="Study Preferences" icon={<MapPin className="w-4 h-4" />}>
                    <div className="space-y-3">
                      <Field label="Domain" value={profile.domain} />
                      {profile.preferredCountries?.length ? (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Preferred Countries</p>
                          <div className="flex flex-wrap gap-1.5">
                            {profile.preferredCountries.map((c) => (
                              <span key={c} className="flex items-center gap-1 px-2.5 py-1 bg-accent/10 text-accent text-xs rounded-full border border-accent/20">
                                <Globe className="w-3 h-3" /> {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {profile.preferredUniversities?.length ? (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Target Universities</p>
                          <div className="flex flex-wrap gap-1.5">
                            {profile.preferredUniversities.map((u) => (
                              <span key={u} className="px-2.5 py-1 bg-secondary text-foreground text-xs rounded-full border border-border">{u}</span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </Section>
                )}

                {/* Education */}
                {(profile.ugDegree || profile.college) && (
                  <Section title="Academic Background" icon={<GraduationCap className="w-4 h-4" />}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <Field label="UG Degree" value={profile.ugDegree} />
                      <Field label="Specialization" value={profile.specialization} />
                      <Field label="College" value={profile.college} />
                      <Field label="CGPA" value={profile.cgpa != null ? `${profile.cgpa} / 10` : null} />
                      <Field label="Backlogs" value={profile.backlogs} />
                    </div>
                    {hasTestScores && (
                      <div className="pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Trophy className="w-3.5 h-3.5 text-accent" /> Test Scores
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(profile.testScores!).map(([key, val]) =>
                            val > 0 ? (
                              <div key={key} className="px-3 py-2 bg-accent/10 border border-accent/20 rounded-lg text-center min-w-[60px]">
                                <p className="text-xs text-muted-foreground uppercase">{key}</p>
                                <p className="text-sm font-bold text-accent">{val}</p>
                              </div>
                            ) : null
                          )}
                        </div>
                      </div>
                    )}
                  </Section>
                )}

                {/* Documents */}
                <Section title="Documents" icon={<FileText className="w-4 h-4" />}>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'resumeURL', label: 'Resume' },
                      { key: 'transcriptURL', label: 'Transcript' },
                      { key: 'sopURL', label: 'SOP' },
                    ].map(({ key, label }) => {
                      const url = profile[key as keyof FullProfile] as string | undefined;
                      return (
                        <div
                          key={key}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center ${
                            url ? 'border-accent/30 bg-accent/5' : 'border-border bg-secondary/20'
                          }`}
                        >
                          {url ? (
                            <CheckCircle2 className="w-5 h-5 text-accent" />
                          ) : (
                            <FileText className="w-5 h-5 text-muted-foreground" />
                          )}
                          <span className={`text-xs font-medium ${url ? 'text-accent' : 'text-muted-foreground'}`}>
                            {label}
                          </span>
                          {url ? (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-accent hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" /> View
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">Not uploaded</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Section>
              </>
            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
