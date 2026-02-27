import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { ReactNode } from "react";

// Fade In variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Scale variants
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

// Stagger container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

// Card hover
export const cardHover = {
  rest: { 
    y: 0, 
    boxShadow: "var(--shadow-card)",
    transition: { duration: 0.3, ease: "easeOut" }
  },
  hover: { 
    y: -6, 
    boxShadow: "var(--shadow-2xl)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Button hover
export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
};

// Motion component wrappers
interface MotionDivProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
}

interface MotionSectionProps extends HTMLMotionProps<"section"> {
  children: ReactNode;
}

export const MotionDiv = motion.div;
export const MotionSection = motion.section;
export const MotionSpan = motion.span;
export const MotionH1 = motion.h1;
export const MotionH2 = motion.h2;
export const MotionH3 = motion.h3;
export const MotionP = motion.p;
export const MotionUl = motion.ul;
export const MotionLi = motion.li;
export const MotionImg = motion.img;
export const MotionA = motion.a;

// Animated container component
interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fadeIn" | "fadeInUp" | "fadeInDown" | "fadeInLeft" | "fadeInRight" | "scaleIn";
}

const variantMap = {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
};

export const AnimatedContainer = ({ 
  children, 
  className = "", 
  delay = 0,
  variant = "fadeInUp"
}: AnimatedContainerProps) => {
  const selectedVariant = variantMap[variant];
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: selectedVariant.hidden,
        visible: {
          ...selectedVariant.visible,
          transition: {
            ...(selectedVariant.visible as any).transition,
            delay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger wrapper
interface StaggerWrapperProps {
  children: ReactNode;
  className?: string;
  fast?: boolean;
}

export const StaggerWrapper = ({ children, className = "", fast = false }: StaggerWrapperProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={fast ? staggerContainerFast : staggerContainer}
    className={className}
  >
    {children}
  </motion.div>
);

// Individual stagger item
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export const StaggerItem = ({ children, className = "" }: StaggerItemProps) => (
  <motion.div variants={fadeInUp} className={className}>
    {children}
  </motion.div>
);
