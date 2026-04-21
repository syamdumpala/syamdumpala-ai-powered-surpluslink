import { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const RoleLayout = ({ children }: Props) => {
  const { role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`${theme} min-h-screen flex bg-gradient-to-br 
      from-emerald-50 via-white to-green-100 
      dark:from-gray-900 dark:via-black dark:to-gray-950 
      transition-all duration-500`}
    >
      {/* 🌟 Glass Sidebar */}
      <aside className="w-72 backdrop-blur-xl bg-white/40 dark:bg-gray-800/40 border-r border-white/20 dark:border-gray-700/30 shadow-xl p-8 flex flex-col justify-between transition-all duration-500">

        <div>
          <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-10 tracking-wide">
            Food For Smiles 🌱
          </h2>

          <div className="space-y-4">
            <div className="px-4 py-2 rounded-lg bg-white/50 dark:bg-gray-700/40 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Logged in as
              </p>
              <p className="font-semibold capitalize dark:text-white">
                {role}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={toggleTheme}
            className="w-full py-2 rounded-lg bg-white/60 dark:bg-gray-700/50 hover:scale-105 transition-all"
          >
            Toggle Theme
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 hover:scale-105 transition-all"
          >
            Logout
          </button>
        </div>

      </aside>

      {/* 📊 Main Area */}
      <main className="flex-1 p-12 transition-all duration-500">
        <div className="mb-10">
          <h1 className="text-4xl font-bold capitalize bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
            {role} Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real-time analytics & activity overview
          </p>
        </div>

        {children}
      </main>
    </div>
  );
};

export default RoleLayout;
