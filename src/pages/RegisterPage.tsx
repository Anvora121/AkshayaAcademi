import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '@/config';
import { toast } from 'sonner';
import {
    User, MapPin, GraduationCap, FileText, CheckSquare, ArrowLeft, ArrowRight,
    Save, Sparkles, LogIn, CheckCircle2,
} from 'lucide-react';

import { StepIndicator } from '../components/auth/StepIndicator';
import { Step1Personal } from '../components/auth/steps/Step1Personal';
import { Step2Preferences } from '../components/auth/steps/Step2Preferences';
import { Step3Academic } from '../components/auth/steps/Step3Academic';
import { Step4Documents } from '../components/auth/steps/Step4Documents';
import { Step5Review } from '../components/auth/steps/Step5Review';

// ─────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────

interface TestScores {
    ielts: string; toefl: string; gre: string;
    gmat: string; sat: string; pte: string;
}

interface FormState {
    // Step 1 — Personal
    name: string; email: string; phone: string;
    dob: string; gender: string; nationality: string;
    password: string; confirmPassword: string;
    // Step 2 — Preferences
    domain: string; preferredCountries: string[]; preferredUniversities: string[];
    // Step 3 — Academic
    ugDegree: string; specialization: string; college: string;
    cgpa: string; backlogs: string; testScores: TestScores;
    // Step 4 — Documents
    resumeURL: string; transcriptURL: string; sopURL: string;
}

interface UploadedFile { name: string; url: string; size: number; }

const STEPS = [
    { number: 1, label: 'Personal', icon: <User className="w-4 h-4" /> },
    { number: 2, label: 'Preferences', icon: <MapPin className="w-4 h-4" /> },
    { number: 3, label: 'Academic', icon: <GraduationCap className="w-4 h-4" /> },
    { number: 4, label: 'Documents', icon: <FileText className="w-4 h-4" /> },
    { number: 5, label: 'Review', icon: <CheckSquare className="w-4 h-4" /> },
];

const DEFAULT_FORM: FormState = {
    name: '', email: '', phone: '', dob: '', gender: '', nationality: '',
    password: '', confirmPassword: '',
    domain: '', preferredCountries: [], preferredUniversities: [],
    ugDegree: '', specialization: '', college: '', cgpa: '', backlogs: '',
    testScores: { ielts: '', toefl: '', gre: '', gmat: '', sat: '', pte: '' },
    resumeURL: '', transcriptURL: '', sopURL: '',
};

// ─────────────────────────────────────────────────────────────────────
// Validation helpers
// ─────────────────────────────────────────────────────────────────────

type Errors = Partial<Record<keyof FormState | 'confirmPassword', string>>;

function validateStep(step: number, form: FormState): Errors {
    const errors: Errors = {};
    if (step === 1) {
        if (!form.name.trim()) errors.name = 'Full name is required';
        if (!form.email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email';
        if (!form.password) errors.password = 'Password is required';
        else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters';
        if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password';
        else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    }
    if (step === 2) {
        if (!form.domain) errors.domain = 'Please select a study domain';
        if (form.preferredCountries.length === 0) errors.preferredCountries = 'Select at least one country';
    }
    if (step === 3) {
        if (!form.ugDegree) errors.ugDegree = 'UG degree is required';
        if (!form.college.trim()) errors.college = 'College name is required';
        if (!form.cgpa) errors.cgpa = 'CGPA is required';
        else if (Number(form.cgpa) < 0 || Number(form.cgpa) > 10) errors.cgpa = 'CGPA must be between 0 and 10';
    }
    return errors;
}

// ─────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login } = useAuth();

    const [currentStep, setCurrentStep] = useState(1);
    const [form, setForm] = useState<FormState>(DEFAULT_FORM);
    const [errors, setErrors] = useState<Errors>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExistingUser, setIsExistingUser] = useState(false);

    // Upload state
    const [uploadedFiles, setUploadedFiles] = useState<{
        resume: UploadedFile | null; transcript: UploadedFile | null; sop: UploadedFile | null;
    }>({ resume: null, transcript: null, sop: null });
    const [uploading, setUploading] = useState({ resume: false, transcript: false, sop: false });
    const [uploadProgress, setUploadProgress] = useState({ resume: 0, transcript: 0, sop: 0 });

    // Resume from existing session
    useEffect(() => {
        if (user) {
            setIsExistingUser(true);
            setForm((f) => ({ 
              ...f, 
              name: user.name || '', 
              email: user.email,
              phone: user.phone || '',
              dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
              nationality: user.nationality || '',
              gender: user.gender || ''
            }));
            const savedStep = (location.state as any)?.step || user.onboardingStep;
            if (savedStep && savedStep > 1) setCurrentStep(savedStep);
        }
    }, [user]);

    const updateField = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
        setForm((f) => ({ ...f, [field]: value }));
        setErrors((e) => ({ ...e, [field]: undefined }));
    }, []);

    // ── STEP 1: Registration ───────────────────────────────────────
    const handleRegister = async (): Promise<boolean> => {
        setIsSaving(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    phone: form.phone,
                    dob: form.dob,
                    gender: form.gender,
                    nationality: form.nationality,
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed');
            login(data.user);
            setIsExistingUser(true);
            toast.success('Account created! Let\'s complete your profile.');
            return true;
        } catch (err: any) {
            toast.error(err.message || 'Registration failed. Please try again.');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    // ── STEPS 2-4: Save Progress ───────────────────────────────
    const saveOnboardingStep = async (step: number): Promise<boolean> => {
        setIsSaving(true);
        try {
            let payload: any = { step, data: {} };
            
            if (step === 2) {
                payload.data = {
                    domain: form.domain,
                    preferredCountries: form.preferredCountries,
                    preferredUniversities: form.preferredUniversities,
                };
            } else if (step === 3) {
                payload.data = {
                    degree: form.ugDegree,
                    specialization: form.specialization,
                    college: form.college,
                    cgpa: Number(form.cgpa),
                    backlogs: Number(form.backlogs),
                    testScores: Object.fromEntries(
                        Object.entries(form.testScores).map(([k, v]) => [k, Number(v) || 0])
                    ),
                };
            } else if (step === 4) {
                payload.data = {
                    resumeURL: form.resumeURL,
                    transcriptURL: form.transcriptURL,
                    sopURL: form.sopURL,
                };
            }

            const res = await fetch(`${API_BASE_URL}/onboarding/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            
            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.message || 'Failed to save progress');
            }
            return true;
        } catch (err: any) {
            toast.error(err.message || 'Failed to save your progress.');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    // ── File upload ──────────────────────────────────────────────────
    const handleFileUpload = async (field: 'resume' | 'transcript' | 'sop', file: File) => {
        setUploading((u) => ({ ...u, [field]: true }));
        setUploadProgress((p) => ({ ...p, [field]: 0 }));

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch(`${API_BASE_URL}/api/uploads/document`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Upload failed');

            setUploadProgress((p) => ({ ...p, [field]: 100 }));
            setUploadedFiles((f) => ({
                ...f,
                [field]: { name: file.name, url: data.url, size: file.size },
            }));
            const urlKey = `${field}URL` as 'resumeURL' | 'transcriptURL' | 'sopURL';
            updateField(urlKey, data.url);
            toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} uploaded!`);
        } catch (err: any) {
            toast.error(err.message || 'File upload failed.');
        } finally {
            setUploading((u) => ({ ...u, [field]: false }));
        }
    };

    const handleFileRemove = (field: 'resume' | 'transcript' | 'sop') => {
        setUploadedFiles((f) => ({ ...f, [field]: null }));
        updateField(`${field}URL` as 'resumeURL' | 'transcriptURL' | 'sopURL', '');
    };

    // ── Navigation ───────────────────────────────────────────────────
    const handleNext = async () => {
        const stepErrors = validateStep(currentStep, form);
        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors);
            toast.error('Please fix the errors before continuing.');
            return;
        }
        setErrors({});

        if (currentStep === 1 && !isExistingUser) {
            const ok = await handleRegister();
            if (!ok) return;
        } else if (currentStep >= 2 && currentStep <= 4) {
            const ok = await saveOnboardingStep(currentStep);
            if (!ok) return;
        }

        setCurrentStep((s) => Math.min(s + 1, 5));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setErrors({});
        setCurrentStep((s) => Math.max(s - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/onboarding/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ step: 5, data: {} }),
            });

            if (!res.ok) throw new Error('Submission failed');

            if (user) login({ ...user, onboardingComplete: true } as any);
            
            toast.success('🎉 Profile complete! Welcome to Akshaya Akadmi.');
            navigate('/dashboard/user', { replace: true });
        } catch (err: any) {
            toast.error('Submission failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1Personal
                        data={form}
                        onChange={(field, value) => updateField(field as keyof FormState, value as any)}
                        errors={errors}
                        isExistingUser={isExistingUser}
                    />
                );
            case 2:
                return (
                    <Step2Preferences
                        data={{ domain: form.domain, preferredCountries: form.preferredCountries, preferredUniversities: form.preferredUniversities }}
                        onChange={(field, value) => updateField(field as keyof FormState, value as any)}
                        errors={errors}
                    />
                );
            case 3:
                return (
                    <Step3Academic
                        data={{ ugDegree: form.ugDegree, specialization: form.specialization, college: form.college, cgpa: form.cgpa, backlogs: form.backlogs, testScores: form.testScores }}
                        onChange={(field, value) => updateField(field as keyof FormState, value as any)}
                        errors={errors}
                    />
                );
            case 4:
                return (
                    <Step4Documents
                        data={{ resumeURL: form.resumeURL, transcriptURL: form.transcriptURL, sopURL: form.sopURL }}
                        uploadedFiles={uploadedFiles}
                        onFileUpload={handleFileUpload}
                        onFileRemove={handleFileRemove}
                        uploading={uploading}
                        uploadProgress={uploadProgress}
                        errors={errors}
                    />
                );
            case 5:
                return (
                    <Step5Review
                        data={{ ...form }}
                        onEdit={(step) => setCurrentStep(step)}
                    />
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFF] selection:bg-accent/10">
            {/* Background Decorations */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-accent/3 rounded-full blur-[100px]" />
                <div className="absolute inset-0 grid-pattern opacity-[0.02]" />
            </div>

            <div className="max-w-3xl mx-auto px-6 py-12">
                {/* Navbar Area */}
                <div className="flex items-center justify-between mb-12">
                    <Link
                        to={isExistingUser ? '/dashboard/user' : '/login'}
                        className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-accent transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {isExistingUser ? 'Dashboard' : 'Login'}
                    </Link>

                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-black text-foreground tracking-tight">Akshaya Akadmi</span>
                    </Link>

                    {isExistingUser ? (
                        <button
                            onClick={() => {
                              toast.success('Progress saved!');
                              navigate('/dashboard/user');
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border rounded-xl text-xs font-bold transition-all"
                        >
                            <Save className="w-3.5 h-3.5" />
                            Save & Exit
                        </button>
                    ) : (
                      <Link to="/login" className="flex items-center gap-1.5 text-xs font-bold text-accent hover:underline">
                        <LogIn className="w-3.5 h-3.5" /> SIGN IN
                      </Link>
                    )}
                </div>

                {/* Progress Tracking */}
                <div className="text-center mb-10">
                    <motion.div 
                      key={currentStep}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] uppercase font-black tracking-widest mb-4"
                    >
                      <Sparkles className="w-3 h-3" /> Step {currentStep} of 5
                    </motion.div>
                    <h1 className="text-4xl font-black text-foreground mb-3 tracking-tight">
                        {currentStep === 1 ? 'Create Account' : STEPS[currentStep - 1].label}
                    </h1>
                    <p className="text-muted-foreground font-medium text-lg max-w-md mx-auto">
                        {currentStep === 1 && 'Fill in your personal details to start your journey.'}
                        {currentStep === 2 && 'Where would you like to study? Let us know your choices.'}
                        {currentStep === 3 && 'Enter your academic background for university matching.'}
                        {currentStep === 4 && 'Secure your profile with relevant supporting documents.'}
                        {currentStep === 5 && 'Verify your information before finalizing your profile.'}
                    </p>
                </div>

                <StepIndicator steps={STEPS} currentStep={currentStep} />

                {/* Main Card */}
                <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 sm:p-12 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Actions */}
                    <div className="flex items-center justify-between mt-12 pt-8 border-t border-border/50">
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-muted-foreground hover:text-foreground disabled:opacity-20 transition-all rounded-2xl border border-transparent hover:border-border"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>

                        {currentStep < 5 ? (
                            <motion.button
                                type="button"
                                onClick={handleNext}
                                disabled={isSaving}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent/90 text-white rounded-[1.25rem] font-black text-sm shadow-xl shadow-accent/20 transition-all disabled:opacity-70"
                            >
                                {isSaving ? 'Processing...' : 'Next Step'}
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        ) : (
                            <motion.button
                                type="button"
                                onClick={handleFinalSubmit}
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-[1.25rem] font-black text-sm shadow-xl shadow-green-200 transition-all disabled:opacity-70"
                            >
                                {isSubmitting ? 'Finishing...' : 'Complete Profile'}
                                <CheckCircle2 className="w-4 h-4" />
                            </motion.button>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                  <span className="flex items-center gap-1.5"><Save className="w-3 h-3" /> Auto-Save Enabled</span>
                  <span className="w-1 h-1 bg-muted-foreground/20 rounded-full" />
                  <span>Secure 256-bit SSL</span>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
