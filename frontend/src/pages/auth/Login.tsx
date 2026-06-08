import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, HandHeart, ShieldCheck, Truck, Utensils } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { Role } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const roles: Array<{
  id: Role;
  label: string;
  description: string;
  icon: typeof Building2;
}> = [
  {
    id: "restaurant",
    label: "Restaurant / Donor",
    description: "Create donation listings and monitor pickup status.",
    icon: Building2,
  },
  {
    id: "ngo",
    label: "NGO",
    description: "Accept matched food donations and manage beneficiaries.",
    icon: HandHeart,
  },
  {
    id: "volunteer",
    label: "Volunteer",
    description: "Accept nearby pickup tasks and earn reward points.",
    icon: Truck,
  },
  {
    id: "admin",
    label: "Admin",
    description: "Track platform health, disputes, users, and analytics.",
    icon: ShieldCheck,
  },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<Role>("restaurant");
  const [email, setEmail] = useState("demo@surpluslink.ai");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    login(selectedRole, email.trim());
    navigate(`/${selectedRole}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="hidden border-r border-slate-200 bg-white px-10 py-12 dark:border-slate-800 dark:bg-slate-900 lg:block">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-emerald-600 text-white">
              <Utensils size={22} />
            </span>
            <span>
              <span className="block text-xl font-bold">SurplusLink</span>
              <span className="text-sm text-slate-500">Food rescue network</span>
            </span>
          </div>

          <div className="mt-16">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Demo access
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              Sign in as any role and explore the full redistribution workflow.
            </h1>
            <p className="mt-5 text-slate-600 dark:text-slate-300">
              Use the same demo credentials, choose a role, and the app will open
              the matching dashboard with live sample operations.
            </p>
          </div>
        </aside>

        <main className="flex items-center justify-center px-5 py-10">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl rounded-md border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Login to SurplusLink</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Select the role you want to test.
                </p>
              </div>
              <button
                aria-label="Toggle theme"
                type="button"
                onClick={toggleTheme}
                className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
              >
                {isDark ? "Light" : "Dark"}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {roles.map((role) => {
                const Icon = role.icon;
                const active = selectedRole === role.id;

                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`rounded-md border p-4 text-left transition ${
                      active
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                        : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                    }`}
                  >
                    <Icon className="mb-3 text-emerald-600" size={22} />
                    <span className="block font-semibold">{role.label}</span>
                    <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
                      {role.description}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Email
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-3 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
                  type="email"
                />
              </label>
              <label className="block text-sm font-medium">
                Password
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-3 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
                  type="password"
                />
              </label>
            </div>

            {error && <p className="mt-4 text-sm font-medium text-rose-600">{error}</p>}

            <button className="mt-6 w-full rounded-md bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700">
              Continue to dashboard
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
