import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, User, BookOpen, FileText, Settings,
  LogOut, Crown, ArrowLeft, Menu, X, Edit3,
  GraduationCap, Globe, MapPin, Phone, Mail, Trophy,
  CheckCircle2, Clock, ChevronRight, Loader2,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { usePageMeta } from '../../hooks/usePageMeta';
import { API_BASE_URL } from '@/config';
import { DocumentUploader } from '../../components/dashboard/DocumentUploader';
import { EditProfileModal } from '../../components/dashboard/EditProfileModal';

type SidebarSection = 'overview' | 'preferences' | 'academic' | 'documents' | 'applications';

interface StudentProfile {
  name?: string;
  email?: string;
  phone?: string;
  dob?: string;
  nationality?: string;
  onboardingComplete?: boolean;
  onboardingStep?: number;
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

// ── Sidebar Nav ──────────────────────────────────────────────────────────────
const NAV_ITEMS: { id: SidebarSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'preferences', label: 'Study Preferences', icon: Globe },
  { id: 'academic', label: 'Academic Details', icon: GraduationCap },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'applications', label: 'Applications', icon: BookOpen },
];

// ── Helper: Completion % ─────────────────────────────────────────────────────
function getCompletion(profile: StudentProfile | null, user: any): number {
  if (!profile) return 0;
  const fields = [
    user?.name, user?.email, profile.phone, profile.nationality,
    profile.domain, profile.preferredCountries?.length,
    profile.ugDegree, profile.college, profile.cgpa,
    profile.resumeURL,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

// ── Info Chip ────────────────────────────────────────────────────────────────
const Chip: React.FC<{ label: string; className?: string }> = ({ label, className = '' }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${className}`}>{label}</span>
);

// ── Section Card ─────────────────────────────────────────────────────────────
const SectionCard: React.FC<{
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, subtitle, icon, action, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-secondary/10 border border-border rounded-2xl overflow-hidden"
  >
    <div className="flex items-center justify-between px-6 py-4 bg-secondary/20 border-b border-border">
      <div className="flex items-center gap-3">
        <span className="p-2 rounded-xl bg-accent/10 text-accent">{icon}</span>
        <div>
          <h3 className="font-semibold text-foreground text-sm">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

// ── Field ────────────────────────────────────────────────────────────────────
const Field: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => {
  if (value == null || value === '') return null;
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-medium text-foreground">{String(value)}</p>
    </div>
  );
};

// ── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-32 bg-secondary/40 rounded-2xl" />
    ))}
  </div>
);

// ── Main Dashboard ────────────────────────────────────────────────────────────
const UserDashboard = () => {
  usePageMeta({ title: 'My Dashboard | Akshaya Akademics', description: 'Student dashboard' });
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<SidebarSection>('overview');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/onboarding/profile`, { credentials: 'include' });
      if (res.ok) setProfile(await res.json());
    } catch { /* silent */ } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const completion = getCompletion(profile, user);
  const hasTestScores = profile?.testScores &&
    Object.values(profile.testScores).some((v) => v > 0);

  // ── Render section content ────────────────────────────────────────────────
  const renderContent = () => {
    if (isLoading) return <Skeleton />;

    switch (activeSection) {
      // ── OVERVIEW ──────────────────────────────────────────────────────────
      case 'overview': return (
        <div className="space-y-5">
          {/* Profile Hero */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent/10 via-secondary/20 to-background p-6"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl -z-0 pointer-events-none" />
            <div className="relative flex items-start gap-5">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-accent/20 text-accent flex items-center justify-center text-2xl font-bold flex-shrink-0 border border-accent/30">
                {(user?.name ?? user?.email ?? 'U')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-foreground">{user?.name ?? 'Student'}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {profile?.nationality && (
                    <Chip label={`🌏 ${profile.nationality}`} className="bg-secondary/60 border-border text-muted-foreground" />
                  )}
                  {profile?.domain && (
                    <Chip label={profile.domain} className="bg-accent/10 border-accent/20 text-accent" />
                  )}
                </div>
              </div>
              <button
                onClick={() => setEditOpen(true)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors border border-accent/20"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>

            {/* Completion Bar */}
            <div className="relative mt-5 pt-5 border-t border-border/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-foreground">Profile Completion</p>
                <span className="text-xs font-bold text-accent">{completion}%</span>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completion}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
              {completion < 100 && (
                <p className="text-xs text-muted-foreground mt-1.5">
                  {100 - completion}% remaining — complete your profile to unlock full university matching
                </p>
              )}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'CGPA', value: profile?.cgpa ? `${profile.cgpa}/10` : '—', icon: <GraduationCap className="w-4 h-4" /> },
              { label: 'Backlogs', value: profile?.backlogs ?? '—', icon: <BookOpen className="w-4 h-4" /> },
              { label: 'Countries', value: profile?.preferredCountries?.length ?? 0, icon: <Globe className="w-4 h-4" /> },
              { label: 'Status', value: profile?.onboardingComplete ? 'Complete' : 'Pending', icon: <Clock className="w-4 h-4" /> },
            ].map(({ label, value, icon }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl border border-border bg-secondary/20 flex flex-col gap-2"
              >
                <span className="text-muted-foreground">{icon}</span>
                <p className="text-lg font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </motion.div>
            ))}
          </div>

          {/* Personal Info */}
          <SectionCard
            title="Personal Information"
            subtitle="Your contact and identity details"
            icon={<User className="w-4 h-4" />}
            action={
              <button onClick={() => setEditOpen(true)}
                className="text-xs text-accent hover:underline flex items-center gap-1">
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            }
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Name" value={user?.name} />
              <Field label="Email" value={user?.email} />
              <Field label="Phone" value={profile?.phone} />
              <Field label="Nationality" value={profile?.nationality} />
              <Field label="Date of Birth" value={profile?.dob ? new Date(profile.dob).toLocaleDateString('en-IN') : null} />
            </div>
          </SectionCard>

          {/* Navigate to sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {NAV_ITEMS.filter(n => n.id !== 'overview').map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/30 hover:border-accent/30 transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-secondary/60 text-muted-foreground group-hover:text-accent transition-colors">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
              </button>
            ))}
          </div>
        </div>
      );

      // ── PREFERENCES ───────────────────────────────────────────────────────
      case 'preferences': return (
        <div className="space-y-5">
          <SectionCard
            title="Study Preferences"
            subtitle="Your target domain and countries"
            icon={<Globe className="w-4 h-4" />}
            action={
              <button onClick={() => setEditOpen(true)}
                className="text-xs text-accent hover:underline flex items-center gap-1">
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            }
          >
            <div className="space-y-5">
              <Field label="Domain / Field of Study" value={profile?.domain} />
              {profile?.preferredCountries?.length ? (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Preferred Countries</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredCountries.map((c) => (
                      <Chip key={c} label={`🌍 ${c}`} className="bg-accent/10 border-accent/20 text-accent" />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No country preferences set yet.</p>
              )}
              {profile?.preferredUniversities?.length ? (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Target Universities</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredUniversities.map((u) => (
                      <Chip key={u} label={u} className="bg-secondary/60 border-border text-foreground" />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </SectionCard>
        </div>
      );

      // ── ACADEMIC ──────────────────────────────────────────────────────────
      case 'academic': return (
        <div className="space-y-5">
          <SectionCard
            title="Academic Background"
            subtitle="Your UG degree and test scores"
            icon={<GraduationCap className="w-4 h-4" />}
            action={
              <button onClick={() => setEditOpen(true)}
                className="text-xs text-accent hover:underline flex items-center gap-1">
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            }
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Field label="UG Degree" value={profile?.ugDegree} />
                <Field label="Specialization" value={profile?.specialization} />
                <Field label="College / University" value={profile?.college} />
                <Field label="CGPA" value={profile?.cgpa != null ? `${profile.cgpa} / 10` : null} />
                <Field label="Backlogs" value={profile?.backlogs ?? 0} />
              </div>

              {hasTestScores && (
                <div className="pt-5 border-t border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-accent" /> Test Scores
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(profile!.testScores!).map(([key, val]) =>
                      val > 0 ? (
                        <div key={key} className="px-4 py-3 bg-accent/10 border border-accent/20 rounded-xl text-center min-w-[70px]">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">{key}</p>
                          <p className="text-lg font-bold text-accent mt-0.5">{val}</p>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      );

      // ── DOCUMENTS ─────────────────────────────────────────────────────────
      case 'documents': return (
        <div className="space-y-5">
          <SectionCard
            title="My Documents"
            subtitle="Upload your Resume, Transcript and SOP to Google Drive"
            icon={<FileText className="w-4 h-4" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {([
                { docType: 'resume', label: 'Resume', urlKey: 'resumeURL' },
                { docType: 'transcript', label: 'Transcript', urlKey: 'transcriptURL' },
                { docType: 'sop', label: 'SOP', urlKey: 'sopURL' },
              ] as { docType: 'resume' | 'transcript' | 'sop'; label: string; urlKey: keyof StudentProfile }[]).map(
                ({ docType, label, urlKey }) => (
                  <div key={docType}>
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-accent" /> {label}
                    </p>
                    <DocumentUploader
                      docType={docType}
                      label={label}
                      currentUrl={profile?.[urlKey] as string | undefined}
                      onUploaded={(url) => setProfile((p) => p ? { ...p, [urlKey]: url } : p)}
                    />
                  </div>
                )
              )}
            </div>
          </SectionCard>

          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-2">
            <span className="mt-0.5">💾</span>
            <span>Files are securely uploaded to Google Drive. Only you and authorised admins can access them.</span>
          </div>
        </div>
      );

      // ── APPLICATIONS ──────────────────────────────────────────────────────
      case 'applications': return (
        <div>
          <SectionCard
            title="Application Status"
            subtitle="Track your overseas admission journey"
            icon={<BookOpen className="w-4 h-4" />}
          >
            <div className="flex flex-col items-center py-8 gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground">No Active Applications</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your application submissions will appear here once you're matched with universities.
                </p>
              </div>
              <Link
                to="/universities"
                className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                Browse Universities →
              </Link>
            </div>
          </SectionCard>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] selection:bg-accent/10 font-sans">
      {/* Background blobs */}
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-accent/3 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed inset-0 grid-pattern opacity-[0.02] pointer-events-none z-0" />

      <div className="relative z-10 flex min-h-screen">
        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            />
          )}
        </AnimatePresence>

        <aside
          className={`fixed top-0 left-0 h-full bg-white/60 backdrop-blur-2xl border-r border-border/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-30 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] lg:translate-x-0 lg:static lg:flex ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${isCollapsed ? 'w-20' : 'w-72'}`}
        >
          {/* Sidebar header */}
          <div className={`flex items-center px-5 py-6 border-b border-border/50 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`}>
              <p className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-widest whitespace-nowrap mb-0.5">Student Portal</p>
              <h1 className="text-[22px] font-black text-foreground whitespace-nowrap leading-none tracking-tight">My Dashboard</h1>
            </div>
            
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`hidden lg:flex p-2 rounded-xl bg-secondary/50 hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all shrink-0 ${isCollapsed ? '' : '-mr-2'}`}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen className="w-[18px] h-[18px]" /> : <PanelLeftClose className="w-[18px] h-[18px]" />}
            </button>
            
            {/* Mobile Close Toggle */}
            <button
              className="lg:hidden p-2 rounded-xl bg-secondary/50 hover:bg-secondary/80 text-muted-foreground shrink-0"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Mini Card */}
          <div className={`px-5 py-5 border-b border-border/50 transition-all duration-300 ${isCollapsed ? 'items-center flex flex-col' : ''}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3.5'}`}>
              <div className="w-[42px] h-[42px] rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-[15px] border border-accent/20 shrink-0 shadow-sm shadow-accent/5">
                {(user?.name ?? user?.email ?? 'U')[0].toUpperCase()}
              </div>
              <div className={`min-w-0 transition-all duration-300 overflow-hidden ${isCollapsed ? 'hidden' : 'block'}`}>
                <p className="font-bold text-foreground truncate">{user?.name ?? 'Student'}</p>
                <p className="text-[13px] text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>

            {/* Completion mini bar */}
            {!isCollapsed && (
              <div className="mt-5">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Profile</span>
                  <span className="text-xs text-accent font-black">{completion}%</span>
                </div>
                <div className="h-1.5 bg-secondary/80 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${completion}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className={`flex-1 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'px-3 py-5 space-y-2' : 'px-4 py-5 space-y-1'}`}>
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setActiveSection(id); setSidebarOpen(false); }}
                title={isCollapsed ? label : undefined}
                className={`w-full flex items-center px-3 py-[11px] rounded-[14px] text-sm font-semibold transition-all duration-200 group ${
                  activeSection === id
                    ? 'bg-accent text-white shadow-lg shadow-accent/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                } ${isCollapsed ? 'justify-center px-0' : 'gap-3.5'}`}
              >
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${activeSection === id ? 'text-white' : 'text-muted-foreground group-hover:text-accent group-hover:scale-110 transition-transform'}`} />
                <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`}>
                  {label}
                </span>
                {!isCollapsed && activeSection === id && <ChevronRight className="w-[14px] h-[14px] ml-auto opacity-80" />}
              </button>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className={`border-t border-border/50 overflow-x-hidden ${isCollapsed ? 'px-3 py-4 space-y-2' : 'px-4 py-4 space-y-1.5'}`}>
            <Link
              to="/premium-plans"
              title={isCollapsed ? "Upgrade to Premium" : undefined}
              className={`w-full flex items-center py-[11px] rounded-[14px] text-[13px] font-bold text-amber-500 hover:bg-amber-500/10 transition-all ${isCollapsed ? 'justify-center px-0' : 'px-3 gap-3.5'}`}
            >
              <Crown className="w-[18px] h-[18px] flex-shrink-0" />
              <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
                Upgrade Premium
              </span>
            </Link>
            <Link
              to="/"
              title={isCollapsed ? "Back to Home" : undefined}
              className={`w-full flex items-center py-[11px] rounded-[14px] text-[13px] font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all ${isCollapsed ? 'justify-center px-0' : 'px-3 gap-3.5'}`}
            >
              <ArrowLeft className="w-[18px] h-[18px] flex-shrink-0" />
              <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
                Back to Home
              </span>
            </Link>
            <button
              onClick={logout}
              title={isCollapsed ? "Sign Out" : undefined}
              className={`w-full flex items-center py-[11px] rounded-[14px] text-[13px] font-bold text-red-500 hover:bg-red-500/10 transition-all ${isCollapsed ? 'justify-center px-0' : 'px-3 gap-3.5'}`}
            >
              <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
              <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
                Sign Out
              </span>
            </button>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          {/* Top Bar (Mobile) */}
          <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-secondary/60 text-muted-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-foreground">My Dashboard</h1>
            <div className="w-9" /> {/* spacer */}
          </div>

          {/* Content area */}
          <div className="p-6 lg:p-8 max-w-4xl mx-auto">
            {/* Onboarding banner */}
            {user?.onboardingComplete === false && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-center justify-between gap-4 p-4 bg-accent/10 border border-accent/30 rounded-xl"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">Complete your profile</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Finish the remaining steps to get personalised university recommendations.</p>
                </div>
                <Link
                  to="/register"
                  className="shrink-0 px-4 py-2 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors"
                >
                  Continue →
                </Link>
              </motion.div>
            )}

            {/* Section heading */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {NAV_ITEMS.find(n => n.id === activeSection)?.label}
              </h2>
            </div>

            {/* Section content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={{
          name: user?.name,
          phone: profile?.phone,
          nationality: profile?.nationality,
          dob: profile?.dob,
          domain: profile?.domain,
          preferredCountries: profile?.preferredCountries,
          preferredUniversities: profile?.preferredUniversities,
          ugDegree: profile?.ugDegree,
          specialization: profile?.specialization,
          college: profile?.college,
          cgpa: profile?.cgpa,
          backlogs: profile?.backlogs,
        }}
        onSaved={(updated) => {
          setProfile((p) => ({ ...p, ...updated } as StudentProfile));
          fetchProfile(); // Re-fetch to get latest from server
        }}
      />
    </div>
  );
};

export default UserDashboard;
