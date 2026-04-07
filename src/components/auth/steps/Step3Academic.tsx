import React from 'react';
import { BookOpen, Building2, BarChart3, AlertTriangle, Trophy, Star, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TestScores {
    ielts: string;
    toefl: string;
    gre: string;
    gmat: string;
    sat: string;
    pte: string;
}

interface Step3Data {
    ugDegree: string;
    specialization: string;
    college: string;
    cgpa: string;
    backlogs: string;
    testScores: TestScores;
}

interface Step3Props {
    data: Step3Data;
    onChange: (field: keyof Step3Data, value: string | TestScores) => void;
    errors: Partial<Record<keyof Step3Data | keyof TestScores, string>>;
}

const inputClass =
    'w-full bg-secondary/30 backdrop-blur-sm border border-border rounded-2xl px-5 py-4 text-base text-foreground focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-muted-foreground/60 font-medium';

const UG_DEGREES = [
    'B.E. / B.Tech', 'B.Sc', 'B.Com', 'B.A.', 'BCA', 'BBA', 'B.Arch',
    'B.Pharm', 'MBBS', 'LLB', 'BDS', 'B.Des', 'Other',
];

const InputGroup: React.FC<{
    label: string;
    icon: React.ReactNode;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
}> = ({ label, icon, error, required, children }) => (
    <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm font-bold text-foreground/80 ml-1">
            <span className="text-accent">{icon}</span>
            {label}
            {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-xs font-bold text-red-500 ml-1"
                  >
                    {error}
                  </motion.p>}
    </div>
);

export const Step3Academic: React.FC<Step3Props> = ({ data, onChange, errors }) => {
    const handleScoreChange = (field: keyof TestScores, value: string) => {
        onChange('testScores', { ...data.testScores, [field]: value });
    };

    return (
        <div className="space-y-10">
            {/* UG Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputGroup label="UG Degree" icon={<BookOpen className="w-4 h-4" />} error={errors.ugDegree} required>
                    <div className="relative">
                        <select
                            id="reg-ug-degree"
                            className={cn(inputClass, "appearance-none")}
                            value={data.ugDegree}
                            onChange={(e) => onChange('ugDegree', e.target.value)}
                        >
                            <option value="">Select degree</option>
                            {UG_DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                             <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                </InputGroup>

                <InputGroup label="Specialization" icon={<Star className="w-4 h-4" />}>
                    <input
                        type="text"
                        className={inputClass}
                        value={data.specialization}
                        onChange={(e) => onChange('specialization', e.target.value)}
                        placeholder="e.g. Computer Science"
                    />
                </InputGroup>
            </div>

            <InputGroup label="College / University Name" icon={<Building2 className="w-4 h-4" />} error={errors.college} required>
                <input
                    type="text"
                    className={inputClass}
                    value={data.college}
                    onChange={(e) => onChange('college', e.target.value)}
                    placeholder="e.g. Anna University, Chennai"
                />
            </InputGroup>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputGroup label="CGPA (out of 10)" icon={<BarChart3 className="w-4 h-4" />} error={errors.cgpa} required>
                    <input
                        type="number"
                        className={inputClass}
                        value={data.cgpa}
                        onChange={(e) => onChange('cgpa', e.target.value)}
                        placeholder="e.g. 8.50"
                        min="0"
                        max="10"
                        step="0.01"
                    />
                </InputGroup>

                <InputGroup label="Number of Backlogs" icon={<AlertTriangle className="w-4 h-4" />}>
                    <input
                        type="number"
                        className={inputClass}
                        value={data.backlogs}
                        onChange={(e) => onChange('backlogs', e.target.value)}
                        placeholder="0"
                        min="0"
                    />
                </InputGroup>
            </div>

            {/* Test Scores */}
            <div className="pt-4">
                <div className="flex items-center gap-3 mb-6 ml-1">
                    <div className="p-2 bg-accent/10 rounded-xl">
                        <Trophy className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h4 className="text-base font-black text-foreground tracking-tight">Standardised Test Scores</h4>
                        <p className="text-xs text-muted-foreground font-medium">Leave blank if you haven't taken these yet.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {(
                        [
                            { key: 'ielts', label: 'IELTS', placeholder: '6.5', min: '0', max: '9', step: '0.5' },
                            { key: 'toefl', label: 'TOEFL', placeholder: '90', min: '0', max: '120', step: '1' },
                            { key: 'gre', label: 'GRE', placeholder: '315', min: '260', max: '340', step: '1' },
                            { key: 'gmat', label: 'GMAT', placeholder: '650', min: '200', max: '800', step: '10' },
                            { key: 'sat', label: 'SAT', placeholder: '1400', min: '400', max: '1600', step: '10' },
                            { key: 'pte', label: 'PTE', placeholder: '65', min: '10', max: '90', step: '1' },
                        ] as const
                    ).map(({ key, label, placeholder, min, max, step }) => (
                        <motion.div 
                            key={key} 
                            whileHover={{ y: -2 }}
                            className="bg-secondary/20 border border-border/50 rounded-2xl p-4 space-y-2 transition-colors hover:border-accent/30"
                        >
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{label}</label>
                            <input
                                type="number"
                                className="w-full bg-transparent text-lg font-black text-foreground focus:outline-none placeholder:text-muted-foreground/30"
                                value={data.testScores[key as keyof TestScores]}
                                onChange={(e) => handleScoreChange(key as keyof TestScores, e.target.value)}
                                placeholder={placeholder}
                                min={min}
                                max={max}
                                step={step}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
