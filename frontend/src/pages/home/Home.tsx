import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { useTheme } from "../../context/ThemeContext";

export default function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const gmailLink =
    "https://mail.google.com/mail/?view=cm&fs=1&to=syamdumpala675@gmail.com" +
    "&su=Support%20Request%20-%20Food%20For%20Smiles" +
    "&body=Hello%20Team,%0A%0AI%20need%20support%20regarding:%0A%0A";

  return (
    <div
      className="
      relative overflow-hidden min-h-screen
      transition-colors duration-500
      bg-background-light dark:bg-background-dark
      text-gray-900 dark:text-white
      "
    >
      {/* Animated Background Blobs */}
      <div className="absolute w-96 h-96 bg-green-400 opacity-20 blur-3xl rounded-full top-[-100px] left-[-100px] animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-orange-400 opacity-20 blur-3xl rounded-full bottom-[-100px] right-[-100px] animate-pulse"></div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 relative z-10">
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">
          Food For Smiles 🌱
        </h1>

        <div className="flex items-center gap-6">
          {/* ✅ GLOBAL THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="
            px-4 py-2 rounded-full
            bg-gray-200 dark:bg-gray-800
            text-gray-800 dark:text-white
            transition"
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            onClick={() =>
              document
                .getElementById("join")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="relative px-6 py-2 font-semibold text-white rounded-full overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-orange-500"></span>
            <span className="relative z-10">Join With Us</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-10 items-center px-10 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            Connecting{" "}
            <span className="text-green-600">Restaurants</span> →
            <span className="text-orange-500"> Volunteers</span> →
            <span className="text-green-700 dark:text-green-400"> NGOs</span>
          </h2>

          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Smart AI-driven surplus food redistribution platform reducing
            waste, saving lives, and building sustainable communities.
          </p>

          <div className="flex gap-6">
            <button
              onClick={() => navigate("/login")}
              className="
              px-8 py-3 rounded-full text-white font-semibold
              bg-gradient-to-r from-green-500 to-orange-500
              shadow-lg hover:scale-105 transition
              "
            >
              🚀 Get Started
            </button>

            <a
              href={gmailLink}
              target="_blank"
              rel="noopener noreferrer"
              className="
              px-8 py-3 rounded-full border border-green-500
              text-green-600 dark:text-green-400
              hover:bg-green-500 hover:text-white transition
              "
            >
              Customer Support
            </a>
          </div>
        </motion.div>

        <Tilt glareEnable={true} glareMaxOpacity={0.3}>
          <motion.img
            src="https://cdn.create.vista.com/downloads/87770fba-9fc5-4e87-8061-c52df8ade09d_1024.jpeg"
            alt="Food Donation"
            className="rounded-3xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          />
        </Tilt>
      </section>

      {/* Join Section */}
      <section
        id="join"
        className="
        py-20 px-10
        bg-gradient-to-r from-green-500 to-orange-500
        text-white text-center
        "
      >
        <h3 className="text-4xl font-bold mb-6">
          Be The Change Today 💚
        </h3>
        <p className="mb-10 text-lg">
          Join the movement of smart food redistribution.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="
          px-10 py-4 bg-white text-green-600
          font-bold rounded-full hover:scale-105 transition shadow-lg
          "
        >
          Join Now
        </button>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-600 dark:text-gray-400">
        <p>© 2026 Food For Smiles. All rights reserved.</p>
        <p className="mt-2">
          <a href="#" className="underline">
            Privacy Policy
          </a>
        </p>
      </footer>
    </div>
  );
}
