import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Role = "restaurant" | "ngo" | "volunteer" | "admin" | null;

const roleConfig = {
  restaurant: {
    label: "Restaurant",
    color: "from-green-400 to-emerald-600",
    message: "Reduce waste. Feed communities."
  },
  ngo: {
    label: "NGO",
    color: "from-blue-400 to-cyan-600",
    message: "Serve those who need it most."
  },
  volunteer: {
    label: "Volunteer",
    color: "from-orange-400 to-pink-500",
    message: "Deliver hope. Become someone’s hero."
  },
  admin: {
    label: "Admin",
    color: "from-purple-500 to-indigo-600",
    message: "Monitor. Secure. Empower."
  }
};

export default function AuthWizard() {
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black text-white">

      {/* Animated Neon Background */}
      <div className="absolute w-[600px] h-[600px] bg-purple-500 opacity-20 blur-3xl rounded-full animate-pulse top-[-200px] left-[-200px]" />
      <div className="absolute w-[600px] h-[600px] bg-green-500 opacity-20 blur-3xl rounded-full animate-pulse bottom-[-200px] right-[-200px]" />

      <div className="relative z-10 w-full max-w-4xl p-6">

        <AnimatePresence mode="wait">
          {!selectedRole ? (
            <motion.div
              key="roles"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {Object.entries(roleConfig).map(([key, role]) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedRole(key as Role)}
                  className="cursor-pointer p-8 rounded-2xl border border-white/10 
                  bg-white/5 backdrop-blur-xl hover:border-white/40 transition-all 
                  shadow-lg hover:shadow-2xl"
                >
                  <h2 className="text-2xl font-bold mb-2">{role.label}</h2>
                  <p className="text-gray-400">{role.message}</p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto p-10 rounded-2xl 
              bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
            >
              <h2 className="text-3xl font-bold mb-2">
                {roleConfig[selectedRole].label} Login
              </h2>

              <p className="text-gray-400 mb-6">
                {roleConfig[selectedRole].message}
              </p>

              <input
                type="email"
                placeholder="Email"
                className="w-full mb-4 p-3 rounded-lg bg-black/40 border border-white/20 focus:border-white focus:outline-none transition"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full mb-6 p-3 rounded-lg bg-black/40 border border-white/20 focus:border-white focus:outline-none transition"
              />

              <button
                className={`w-full py-3 rounded-lg font-semibold bg-gradient-to-r ${roleConfig[selectedRole].color} hover:opacity-90 transition`}
              >
                Enter Platform
              </button>

              <button
                onClick={() => setSelectedRole(null)}
                className="mt-4 text-sm text-gray-400 hover:text-white transition"
              >
                ← Change Role
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
