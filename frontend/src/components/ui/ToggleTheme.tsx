import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const ToggleTheme = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-4 py-2 rounded-full 
                 bg-gray-200 dark:bg-gray-800 
                 text-gray-800 dark:text-white
                 hover:scale-105 transition-all duration-300 shadow-md"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export default ToggleTheme;
