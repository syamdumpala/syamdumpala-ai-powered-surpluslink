import { motion } from "framer-motion";
import { ReactNode } from "react";

const Button = ({ children }: { children: ReactNode }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="px-6 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
  >
    {children}
  </motion.button>
);

export default Button;
