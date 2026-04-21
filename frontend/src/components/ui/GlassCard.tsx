import { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

const GlassCard = ({ children, className = "" }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className={`
        backdrop-blur-xl 
        bg-white/60 
        dark:bg-white/10 
        border 
        border-white/20 
        dark:border-white/10
        shadow-xl 
        rounded-2xl 
        p-6 
        transition-all 
        duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
