import React from 'react';
import { User, Mail, Phone, Calendar, Users, Globe, Lock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface Step1Data {
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    nationality: string;
    password: string;
    confirmPassword: string;
}

interface Step1Props {
    data: Step1Data;
    onChange: (field: keyof Step1Data, value: string) => void;
    errors: Partial<Record<keyof Step1Data, string>>;
    isExistingUser?: boolean;
}

const inputClass =
    'w-full bg-secondary/30 backdrop-blur-sm border border-border rounded-2xl px-5 py-4 text-base text-foreground focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-muted-foreground/60 font-medium';

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

export const Step1Personal: React.FC<Step1Props> = ({ data, onChange, errors, isExistingUser }) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputGroup label="Full Name" icon={<User className="w-4 h-4" />} error={errors.name} required>
                    <input
                        type="text"
                        className={inputClass}
                        value={data.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        placeholder="e.g. Arjun Sharma"
                    />
                </InputGroup>

                <InputGroup label="Email Address" icon={<Mail className="w-4 h-4" />} error={errors.email} required>
                    <input
                        type="email"
                        className={inputClass}
                        value={data.email}
                        onChange={(e) => onChange('email', e.target.value)}
                        placeholder="arjun@email.com"
                        disabled={isExistingUser}
                    />
                </InputGroup>
            </div>

            {!isExistingUser && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-accent/5 rounded-3xl border border-accent/10 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Lock className="w-12 h-12 text-accent" />
                   </div>
                   
                   <div className="col-span-full mb-2">
                       <p className="text-xs font-black text-accent uppercase tracking-widest flex items-center gap-2">
                           <ShieldCheck className="w-4 h-4" /> Account Security
                       </p>
                   </div>

                    <InputGroup label="Password" icon={<Lock className="w-4 h-4" />} error={errors.password} required>
                        <input
                            type="password"
                            className={inputClass}
                            value={data.password}
                            onChange={(e) => onChange('password', e.target.value)}
                            placeholder="Min. 8 characters"
                        />
                    </InputGroup>

                    <InputGroup label="Confirm Password" icon={<Lock className="w-4 h-4" />} error={errors.confirmPassword} required>
                        <input
                            type="password"
                            className={inputClass}
                            value={data.confirmPassword}
                            onChange={(e) => onChange('confirmPassword', e.target.value)}
                            placeholder="Repeat password"
                        />
                    </InputGroup>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <InputGroup label="Phone Number" icon={<Phone className="w-4 h-4" />} error={errors.phone}>
                    <input
                        type="tel"
                        className={inputClass}
                        value={data.phone}
                        onChange={(e) => onChange('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                    />
                </InputGroup>

                <InputGroup label="Date of Birth" icon={<Calendar className="w-4 h-4" />} error={errors.dob}>
                    <input
                        type="date"
                        className={inputClass}
                        value={data.dob}
                        onChange={(e) => onChange('dob', e.target.value)}
                    />
                </InputGroup>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputGroup label="Gender" icon={<Users className="w-4 h-4" />} error={errors.gender}>
                    <select
                        className={inputClass}
                        value={data.gender}
                        onChange={(e) => onChange('gender', e.target.value)}
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-binary</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                </InputGroup>

                <InputGroup label="Nationality" icon={<Globe className="w-4 h-4" />} error={errors.nationality}>
                    <input
                        type="text"
                        className={inputClass}
                        value={data.nationality}
                        onChange={(e) => onChange('nationality', e.target.value)}
                        placeholder="e.g. Indian"
                    />
                </InputGroup>
            </div>
        </div>
    );
};
