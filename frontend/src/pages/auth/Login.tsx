import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-green-50 via-white to-orange-100 dark:from-gray-950 dark:via-gray-900 dark:to-black transition-all duration-700 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute w-96 h-96 bg-green-400 opacity-20 blur-[120px] rounded-full -top-20 -left-20 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-orange-400 opacity-20 blur-[120px] rounded-full -bottom-20 -right-20 animate-pulse"></div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-20 px-4 py-2 rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md"
      >
        {isDark ? "☀" : "🌙"}
      </button>

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-center items-center text-center p-12 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-green-600 dark:text-green-400"
        >
          Food For Smiles 🌱
        </motion.h1>

        <p className="mt-6 text-lg text-gray-700 dark:text-gray-300 max-w-md">
          AI-powered food redistribution connecting Restaurants → Volunteers → NGOs in real time.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6 relative z-10">
        <Tilt glareEnable glareMaxOpacity={0.3} scale={1.02}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md p-10 rounded-3xl backdrop-blur-2xl bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/10 shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-center mb-6">
              {step === 1 && "Enter Email"}
              {step === 2 && "Enter Password"}
              {step === 3 && "Verify OTP"}
            </h2>

            <AnimatePresence mode="wait">
              
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                >
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-xl mb-6 bg-white/80 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                  />

                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-orange-500 text-white font-semibold"
                  >
                    Continue
                  </button>

                  <p className="text-sm text-center mt-6 text-gray-600 dark:text-gray-400">
                    Don’t have an account?{" "}
                    <span
                      onClick={() => navigate("/signup")}
                      className="text-green-600 dark:text-green-400 font-medium cursor-pointer hover:underline"
                    >
                      Sign Up
                    </span>
                  </p>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                >
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-xl mb-6 bg-white/80 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                  />

                  <button
                    onClick={() => setStep(3)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-orange-500 text-white font-semibold"
                  >
                    Verify
                  </button>
                </motion.div>
              )}

              {/* STEP 3 (FIXED) */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                >
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 rounded-xl mb-6 bg-white/80 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                  />

                  <button
                    onClick={() => alert("Login success")}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-orange-500 text-white font-semibold"
                  >
                    Login
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </Tilt>
      </div>
    </div>
  );
}