import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '@/config';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, Globe, Calendar, GraduationCap,
    MapPin, FileText, BarChart3, Trophy, Edit3, CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface StudentProfile {
    phone?: string;
    dob?: string;
    gender?: string;
    nationality?: string;
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
    onboardingStep?: number;
    onboardingComplete?: boolean;
}

const ProfileSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({
    title, icon, children,
}) => (
    <div className="border border-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 bg-secondary/30 border-b border-border">
            <span className="text-accent">{icon}</span>
            <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        <div className="p-5">{children}</div>
    </div>
);

const InfoField: React.FC<{ label: string; value?: string | number | string[] }> = ({ label, value }) => {
    if (!value && value !== 0) return null;
    const display = Array.isArray(value) ? (value.length > 0 ? value.join(', ') : null) : String(value);
    if (!display) return null;
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
            <span className="text-sm font-medium text-foreground">{display}</span>
        </div>
    );
};

export const ProfileCard: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/onboarding/profile`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    setProfile(await res.json());
                }
            } catch (err) {
                console.error('Failed to fetch profile:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Calculate completion percentage
    const getCompletionPercent = () => {
        if (!profile) return 0;
        const fields = [
            profile.phone, profile.dob, profile.gender, profile.nationality,
            profile.domain, profile.preferredCountries?.length,
            profile.ugDegree, profile.college, profile.cgpa,
            profile.resumeURL,
        ];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
    };

    const completion = getCompletionPercent();

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-secondary/50 rounded-xl" />
                ))}
            </div>
        );
    }

    const hasTestScores = profile?.testScores && Object.values(profile.testScores).some((v) => v > 0);

    return (
        <div className="space-y-5">
            {/* Completion Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 border border-border rounded-xl bg-secondary/20"
            >
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Profile Completion</p>
                        <p className="text-xs text-muted-foreground">
                            {completion === 100
                                ? 'Your profile is complete!'
                                : `${100 - completion}% remaining — complete to unlock full matching`}
                        </p>
                    </div>
                    <div className="relative w-14 h-14">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                            <motion.circle
                                cx="18" cy="18" r="15.9" fill="none"
                                stroke="hsl(var(--accent))" strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray={`${completion} ${100 - completion}`}
                                strokeDashoffset="0"
                                initial={{ strokeDasharray: '0 100' }}
                                animate={{ strokeDasharray: `${completion} ${100 - completion}` }}
                                transition={{ duration: 1.2, ease: 'easeOut' }}
                            />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                            {completion}%
                        </span>
                    </div>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-accent rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${completion}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                </div>
                {completion < 100 && (
                    <Link
                        to="/register"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs text-accent font-medium hover:underline"
                    >
                        <Edit3 className="w-3 h-3" />
                        Complete your profile
                    </Link>
                )}
            </motion.div>

            {/* Personal Details */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <ProfileSection title="Personal Details" icon={<User className="w-4 h-4" />}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <InfoField label="Full Name" value={user?.name} />
                        <InfoField label="Email" value={user?.email} />
                        <InfoField label="Phone" value={profile?.phone} />
                        <InfoField label="Date of Birth" value={profile?.dob ? new Date(profile.dob).toLocaleDateString('en-IN') : undefined} />
                        <InfoField label="Gender" value={profile?.gender} />
                        <InfoField label="Nationality" value={profile?.nationality} />
                    </div>
                </ProfileSection>
            </motion.div>

            {/* Study Preferences */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <ProfileSection title="Study Preferences" icon={<MapPin className="w-4 h-4" />}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoField label="Domain" value={profile?.domain} />
                        <InfoField label="Preferred Countries" value={profile?.preferredCountries} />
                        <InfoField label="Target Universities" value={profile?.preferredUniversities} />
                    </div>
                </ProfileSection>
            </motion.div>

            {/* Academic Details */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ProfileSection title="Academic Background" icon={<GraduationCap className="w-4 h-4" />}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                        <InfoField label="UG Degree" value={profile?.ugDegree} />
                        <InfoField label="Specialization" value={profile?.specialization} />
                        <InfoField label="College" value={profile?.college} />
                        <InfoField label="CGPA" value={profile?.cgpa ? `${profile.cgpa} / 10` : undefined} />
                        <InfoField label="Backlogs" value={profile?.backlogs ?? 0} />
                    </div>
                    {hasTestScores && (
                        <div className="pt-4 border-t border-border">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <Trophy className="w-3.5 h-3.5 text-accent" />
                                Test Scores
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {Object.entries(profile!.testScores!).map(([key, val]) =>
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
                </ProfileSection>
            </motion.div>

            {/* Documents */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <ProfileSection title="Documents" icon={<FileText className="w-4 h-4" />}>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { key: 'resumeURL', label: 'Resume' },
                            { key: 'transcriptURL', label: 'Transcript' },
                            { key: 'sopURL', label: 'SOP' },
                        ].map(({ key, label }) => {
                            const url = profile?.[key as keyof StudentProfile] as string | undefined;
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
                                            className="text-xs text-accent hover:underline"
                                        >
                                            View
                                        </a>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">Not uploaded</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </ProfileSection>
            </motion.div>
        </div>
    );
};
