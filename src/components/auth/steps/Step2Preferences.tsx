import React from 'react';
import { Compass, GraduationCap, Globe, Landmark, Target, Sparkles } from 'lucide-react';
import { MultiSelect } from '../MultiSelect';
import { motion } from 'framer-motion';

interface Step2Data {
    domain: string;
    preferredCountries: string[];
    preferredUniversities: string[];
}

interface Step2Props {
    data: Step2Data;
    onChange: (field: keyof Step2Data, value: string | string[]) => void;
    errors: Partial<Record<keyof Step2Data, string>>;
}

const DOMAINS = [
    'Computer Science & IT', 'Business Administration (MBA)', 'Data Science & AI',
    'Engineering', 'Medicine & Healthcare', 'Law', 'Arts & Design',
    'Environmental Science', 'Economics & Finance', 'Architecture',
    'Biotechnology', 'Education', 'Psychology', 'Media & Communication',
];

const COUNTRIES = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Netherlands', 'Sweden', 'Singapore', 'New Zealand',
    'Ireland', 'Switzerland', 'Japan', 'South Korea', 'UAE',
];

const UNIVERSITIES = [
    'MIT', 'Stanford University', 'Harvard University', 'University of Oxford',
    'University of Cambridge', 'ETH Zurich', 'University of Toronto',
    'University of Melbourne', 'National University of Singapore', 'TU Munich',
    'UC Berkeley', 'University College London', 'University of Amsterdam',
    'KAIST', 'McGill University', 'University of New South Wales',
];

const inputClass =
    'w-full bg-secondary/30 backdrop-blur-sm border border-border rounded-2xl px-5 py-4 text-base text-foreground focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-muted-foreground/60 font-medium appearance-none';

export const Step2Preferences: React.FC<Step2Props> = ({ data, onChange, errors }) => {
    return (
        <div className="space-y-10">
            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm font-bold text-foreground/80 ml-1">
                    <Compass className="w-4 h-4 text-accent" />
                    Study Domain / Field of Interest
                    <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <select
                        id="reg-domain"
                        className={inputClass}
                        value={data.domain}
                        onChange={(e) => onChange('domain', e.target.value)}
                    >
                        <option value="">Select your domain</option>
                        {DOMAINS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                         <Target className="w-4 h-4" />
                    </div>
                </div>
                {errors.domain && <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-xs font-bold text-red-500 ml-1"
                  >
                    {errors.domain}
                  </motion.p>}
            </div>

            <div className="space-y-8">
                <MultiSelect
                    label="Preferred Countries"
                    options={COUNTRIES}
                    selected={data.preferredCountries}
                    onChange={(v) => onChange('preferredCountries', v)}
                    placeholder="Where would you like to study?"
                    maxItems={5}
                />
                {errors.preferredCountries && (
                    <p className="text-xs font-bold text-red-500 ml-1 mt-1">{errors.preferredCountries}</p>
                )}
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground ml-1">
                    <Globe className="w-3 h-3" /> Select up to 5 countries
                </div>
            </div>

            <div className="space-y-8">
                <MultiSelect
                    label="Target Universities (Optional)"
                    options={UNIVERSITIES}
                    selected={data.preferredUniversities}
                    onChange={(v) => onChange('preferredUniversities', v)}
                    placeholder="List your dream universities..."
                    maxItems={8}
                />
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground ml-1">
                    <Landmark className="w-3 h-3" /> Don't worry — our AI & advisors will help you shortlist
                </div>
            </div>

            {/* Premium Info card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-4 p-6 bg-accent/5 border border-accent/10 rounded-3xl relative overflow-hidden"
            >
                <div className="absolute right-0 top-0 p-4 opacity-5">
                    <Sparkles className="w-16 h-16 text-accent" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6 text-accent" />
                </div>
                <div>
                    <h4 className="text-base font-black text-foreground mb-1">Personalised Matching</h4>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        Your choices allow our course engine to recommend programs with the highest 
                        admission probability and scholarship potential tailored to your profile.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
