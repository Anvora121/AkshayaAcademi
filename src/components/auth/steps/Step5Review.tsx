import React from 'react';
import { User, MapPin, GraduationCap, FileText, CheckCircle2, Edit3, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TestScores {
    ielts: string; toefl: string; gre: string;
    gmat: string; sat: string; pte: string;
}

interface ReviewData {
    // Personal
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    nationality: string;
    // Preferences
    domain: string;
    preferredCountries: string[];
    preferredUniversities: string[];
    // Academic
    ugDegree: string;
    specialization: string;
    college: string;
    cgpa: string;
    backlogs: string;
    testScores: TestScores;
    // Documents
    resumeURL: string;
    transcriptURL: string;
    sopURL: string;
}

interface Step5Props {
    data: ReviewData;
    onEdit: (step: number) => void;
}

const Section: React.FC<{
    icon: React.ReactNode;
    title: string;
    step: number;
    onEdit: (step: number) => void;
    children: React.ReactNode;
}> = ({ icon, title, step, onEdit, children }) => (
    <motion.div 
        layout
        className="bg-secondary/20 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden transition-all hover:border-accent/30"
    >
        <div className="flex items-center justify-between px-6 py-4 bg-secondary/30 border-b border-border/30">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-xl">
                    <span className="text-accent">{icon}</span>
                </div>
                <span className="text-base font-black text-foreground tracking-tight italic">{title}</span>
            </div>
            <button
                type="button"
                onClick={() => onEdit(step)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 hover:bg-accent hover:text-white text-accent rounded-xl text-xs font-black transition-all group"
            >
                <Edit3 className="w-3 h-3 group-hover:scale-110 transition-transform" />
                EDIT
            </button>
        </div>
        <div className="p-6">{children}</div>
    </motion.div>
);

const Field: React.FC<{ label: string; value?: string | string[] }> = ({ label, value }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.1em]">{label}</span>
            <span className="text-sm text-foreground font-bold leading-relaxed">
                {Array.isArray(value) ? value.join(', ') : value}
            </span>
        </div>
    );
};

export const Step5Review: React.FC<Step5Props> = ({ data, onEdit }) => {
    const hasTestScores = Object.values(data.testScores).some((v) => v && v !== '');

    return (
        <div className="space-y-8">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4 p-5 bg-green-500/5 border border-green-500/20 rounded-3xl relative overflow-hidden"
            >
                <div className="absolute right-0 top-0 p-4 opacity-5 pointer-events-none">
                     <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                    <h4 className="text-base font-black text-foreground mb-0.5 tracking-tight">Ready for Submission</h4>
                    <p className="text-sm text-muted-foreground font-medium">
                        Almost there! Please review your details below. You can click <strong>"Edit"</strong> on any section to make changes.
                    </p>
                </div>
            </motion.div>

            <div className="space-y-6">
                <Section icon={<User className="w-4 h-4" />} title="Personal Profile" step={1} onEdit={onEdit}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
                        <Field label="Full Name" value={data.name} />
                        <Field label="Email Address" value={data.email} />
                        <Field label="Phone Number" value={data.phone} />
                        <Field label="Date of Birth" value={data.dob} />
                        <Field label="Gender" value={data.gender} />
                        <Field label="Nationality" value={data.nationality} />
                    </div>
                </Section>

                <Section icon={<MapPin className="w-4 h-4" />} title="Study Preferences" step={2} onEdit={onEdit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                        <Field label="Domain of Interest" value={data.domain} />
                        <Field label="Preferred Countries" value={data.preferredCountries} />
                        <div className="col-span-full">
                            <Field label="Target Universities" value={data.preferredUniversities} />
                        </div>
                    </div>
                </Section>

                <Section icon={<GraduationCap className="w-4 h-4" />} title="Academic Credentials" step={3} onEdit={onEdit}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
                        <Field label="UG Degree" value={data.ugDegree} />
                        <Field label="Specialization" value={data.specialization} />
                        <Field label="College / Univ" value={data.college} />
                        <Field label="Final CGPA" value={data.cgpa ? `${data.cgpa} / 10.0` : undefined} />
                        <Field label="Backlogs" value={data.backlogs || '0'} />
                    </div>
                    {hasTestScores && (
                        <div className="mt-8 pt-6 border-t border-border/30">
                            <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mb-4">Standardised Test Scores</p>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                {Object.entries(data.testScores).map(([key, val]) =>
                                    val ? (
                                        <div key={key} className="text-center p-3 bg-accent/5 border border-accent/10 rounded-2xl">
                                            <p className="text-[10px] font-black text-accent uppercase">{key}</p>
                                            <p className="text-sm font-black text-foreground">{val}</p>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        </div>
                    )}
                </Section>

                <Section icon={<FileText className="w-4 h-4" />} title="Attached Documents" step={4} onEdit={onEdit}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { key: 'resumeURL', label: 'Resume / CV', icon: <FileText className="w-4 h-4" /> },
                            { key: 'transcriptURL', label: 'Transcript', icon: <FileText className="w-4 h-4" /> },
                            { key: 'sopURL', label: 'SOP', icon: <FileText className="w-4 h-4" /> },
                        ].map(({ key, label, icon }) => {
                            const isUploaded = !!data[key as keyof ReviewData];
                            return (
                                <div
                                    key={key}
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-2xl border transition-all",
                                        isUploaded 
                                            ? "border-accent/20 bg-accent/5 text-accent shadow-sm" 
                                            : "border-border/50 bg-secondary/20 text-muted-foreground/40 italic"
                                    )}
                                >
                                    <div className={cn("p-2 rounded-xl", isUploaded ? "bg-accent/10" : "bg-secondary/30")}>
                                        {icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-wider">{label}</p>
                                        <p className="text-xs font-bold truncate">
                                            {isUploaded ? '✓ Uploaded' : 'Not Provided'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Section>
            </div>

            <div className="mt-10 flex flex-col items-center gap-6 text-center">
                 <div className="flex items-center gap-2 text-xs font-black text-muted-foreground/40 uppercase tracking-[0.2em] bg-secondary/30 px-4 py-2 rounded-full border border-border/30">
                    <ShieldCheck className="w-4 h-4" /> Secure Submission
                    <ArrowRight className="w-4 h-4" /> Final Step
                    <Sparkles className="w-4 h-4" /> Join Now
                </div>
            </div>
        </div>
    );
};
