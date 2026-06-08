import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BellRing,
  Brain,
  HandHeart,
  MapPinned,
  ShieldCheck,
  Utensils,
} from "lucide-react";
import { monthlyImpact } from "../../data/surplus";
import { useTheme } from "../../context/ThemeContext";

const features = [
  {
    title: "Real-time donation management",
    description: "Create food listings, update status, and notify NGOs instantly.",
    icon: BellRing,
  },
  {
    title: "Smart matching engine",
    description: "Prioritizes donations by distance, expiry, quantity, category, and capacity.",
    icon: Brain,
  },
  {
    title: "Geo-based deliveries",
    description: "Coordinate nearby pickups with route-ready delivery assignments.",
    icon: MapPinned,
  },
  {
    title: "Trust and rewards",
    description: "Track reliability, ratings, badges, volunteer points, and completion history.",
    icon: ShieldCheck,
  },
];

export default function Home() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <header className="border-b border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-950/90">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-emerald-600 text-white">
              <Utensils size={20} />
            </span>
            <span className="text-xl font-bold">SurplusLink</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
            >
              {isDark ? "Light" : "Dark"}
            </button>
            <Link
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
              to="/login"
            >
              Login
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1fr_0.9fr] lg:py-16">
          <div className="flex flex-col justify-center">
            <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
              <Activity size={16} />
              Real-time food redistribution
            </p>
            <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-6xl">
              SurplusLink
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              A full-stack platform that connects restaurants, hotels,
              supermarkets, NGOs, and volunteers so surplus food reaches people
              before it expires.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
                to="/login"
              >
                Start demo
                <ArrowRight size={18} />
              </Link>
              <a
                className="rounded-md border border-slate-300 px-5 py-3 font-semibold dark:border-slate-700"
                href="mailto:syamdumpala675@gmail.com?subject=Support%20Request%20-%20SurplusLink"
              >
                Contact support
              </a>
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <img
              alt="Volunteers handling packed meals for redistribution"
              className="aspect-[4/3] w-full rounded-md object-cover"
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80"
            />
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-md bg-emerald-50 p-3 dark:bg-emerald-950">
                <strong className="block text-2xl">2,130</strong>
                <span className="text-xs text-slate-500">meals saved</span>
              </div>
              <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-950">
                <strong className="block text-2xl">38</strong>
                <span className="text-xs text-slate-500">live tasks</span>
              </div>
              <div className="rounded-md bg-amber-50 p-3 dark:bg-amber-950">
                <strong className="block text-2xl">94%</strong>
                <span className="text-xs text-slate-500">reliability</span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto grid max-w-7xl gap-4 px-5 md:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-md border border-slate-200 p-5 dark:border-slate-800">
                  <Icon className="mb-4 text-emerald-600" size={24} />
                  <h2 className="font-semibold">{feature.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Impact dashboard
            </p>
            <h2 className="mt-3 text-3xl font-bold">Track waste reduction month by month.</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Admins can monitor donations, food saved, active NGOs,
              volunteer activity, risk levels, and monthly reports.
            </p>
          </div>
          <div className="grid gap-3">
            {monthlyImpact.map((item) => (
              <div key={item.month} className="grid grid-cols-[52px_1fr_80px] items-center gap-3">
                <span className="text-sm font-semibold">{item.month}</span>
                <span className="h-3 rounded-full bg-slate-200 dark:bg-slate-800">
                  <span
                    className="block h-3 rounded-full bg-emerald-600"
                    style={{ width: `${Math.min(100, item.meals / 22)}%` }}
                  />
                </span>
                <span className="text-right text-sm text-slate-500">{item.meals}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-emerald-700 px-5 py-10 text-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <HandHeart size={28} />
              <div>
                <h2 className="text-2xl font-bold">Ready to coordinate surplus food?</h2>
                <p className="text-emerald-100">Open the demo and choose your role.</p>
              </div>
            </div>
            <Link className="rounded-md bg-white px-5 py-3 font-semibold text-emerald-700" to="/login">
              Open role dashboards
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
