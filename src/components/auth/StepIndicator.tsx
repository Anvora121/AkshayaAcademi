import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  label: string;
  icon: React.ReactNode;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full mb-12">
      <div className="relative flex justify-between">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 -z-10" />
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-accent -translate-y-1/2 -z-10"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isActive ? 'var(--accent)' : 'var(--background)',
                  borderColor: isCompleted || isActive ? 'var(--accent)' : 'var(--border)',
                  scale: isActive ? 1.1 : 1,
                }}
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center relative z-10 transition-colors duration-300",
                  isActive && "shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className={cn(
                    "text-sm font-bold",
                    isActive ? "text-white" : "text-muted-foreground"
                  )}>
                    {step.number}
                  </span>
                )}

                {isActive && (
                  <motion.div
                    layoutId="active-glow"
                    className="absolute inset-[-4px] rounded-full border border-accent/30 -z-10"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
              <span className={cn(
                "mt-3 text-xs font-medium tracking-tight whitespace-nowrap transition-colors duration-300",
                isActive ? "text-foreground font-bold" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
