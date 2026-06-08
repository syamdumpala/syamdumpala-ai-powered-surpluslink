import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Fingerprint, FileText, Flame, QrCode, ShieldCheck } from "lucide-react";
import SurplusAI from "../../components/ai/SurplusAI";
import DashboardShell, { Panel, Stat } from "../../components/dashboard/DashboardShell";
import { donations, getRiskScore, monthlyImpact } from "../../data/surplus";
import {
  forecastDemand,
  getCarbonMetrics,
  getFraudSignals,
  getTraceabilityEvents,
} from "../../utils/ai";

const users = [
  { name: "Green Leaf Hotel", role: "Restaurant", status: "Verified", rating: "4.9" },
  { name: "Hope Meals Foundation", role: "NGO", status: "Active", rating: "4.8" },
  { name: "Asha", role: "Volunteer", status: "Active", rating: "4.7" },
  { name: "Orchid Events", role: "Donor", status: "Review", rating: "4.5" },
];

export default function AdminDashboard() {
  const completed = donations.filter((donation) => donation.status === "delivered");
  const highRisk = donations.filter((donation) => getRiskScore(donation) > 70);
  const savedMeals = completed.reduce((total, item) => total + item.quantity, 0);
  const carbon = getCarbonMetrics(savedMeals);
  const fraudSignals = getFraudSignals();

  return (
    <DashboardShell
      title="Admin Dashboard"
      subtitle="Monitor platform activity, verify users, handle disputes, and generate impact analytics."
    >
      <div className="mb-6">
        <SurplusAI role="admin" />
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Stat label="Total food saved" value={`${savedMeals} meals`} />
        <Stat label="Active NGOs" value="21" tone="blue" />
        <Stat label="Active volunteers" value="56" tone="amber" />
        <Stat label="High-risk items" value={highRisk.length} tone="rose" />
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Stat label="Food saved" value={`${carbon.foodKg} kg`} />
        <Stat label="CO2 reduced" value={`${carbon.co2Tons} tons`} tone="blue" />
        <Stat label="Water saved" value={`${carbon.waterLiters.toLocaleString()} L`} tone="amber" />
        <Stat label="Meals served" value={carbon.mealsServed} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel
          title="Monthly reports"
          action={
            <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold dark:border-slate-700">
              <FileText size={16} />
              Export
            </button>
          }
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyImpact}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="meals" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="waste" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Operational alerts">
          <div className="space-y-3">
            {highRisk.map((donation) => (
              <article
                key={donation.id}
                className="rounded-md border border-rose-200 bg-rose-50 p-4 text-rose-900 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} />
                  <div>
                    <h3 className="font-semibold">{donation.food}</h3>
                    <p className="text-sm">
                      Risk {getRiskScore(donation)}%, expires in {donation.expiryHours}h.
                    </p>
                  </div>
                </div>
              </article>
            ))}
            <article className="rounded-md border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-emerald-600" size={20} />
                <div>
                  <h3 className="font-semibold">Trust score stable</h3>
                  <p className="text-sm text-slate-500">Platform reliability averaged 94% today.</p>
                </div>
              </div>
            </article>
          </div>
        </Panel>

        <Panel title="Security center" action={<ShieldCheck className="text-emerald-600" size={20} />}>
          <div className="grid gap-3 text-sm">
            {[
              "JWT authentication and role-based route protection enabled",
              "API security headers and request rate limiting added",
              "Password policy validates length, uppercase, lowercase, and digits",
              "Fraud signals reviewed through anomaly-style scoring",
            ].map((item) => (
              <div key={item} className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
                {item}
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Fraud detection">
          <div className="space-y-3">
            {fraudSignals.map((signal) => (
              <article
                key={`${signal.entity}-${signal.signal}`}
                className="rounded-md border border-slate-200 p-4 text-sm dark:border-slate-800"
              >
                <div className="flex items-center justify-between gap-3">
                  <strong>{signal.entity}</strong>
                  <span className={signal.risk === "High" ? "text-rose-600" : signal.risk === "Medium" ? "text-amber-600" : "text-emerald-600"}>
                    {signal.risk}
                  </span>
                </div>
                <p className="mt-2 text-slate-500">{signal.signal}</p>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="User management">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-2">Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.name} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="py-3 font-medium">{user.name}</td>
                    <td>{user.role}</td>
                    <td>{user.status}</td>
                    <td>{user.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Blockchain traceability and QR tracking" action={<QrCode className="text-emerald-600" size={20} />}>
          <div className="space-y-3">
            {donations.map((donation) => (
              <article
                key={donation.id}
                className="rounded-md border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{donation.food}</h3>
                    <p className="text-sm text-slate-500">
                      {donation.donor} to {donation.ngo || "unmatched NGO"}
                    </p>
                  </div>
                  <div className="grid h-12 w-12 grid-cols-3 gap-0.5 rounded-md bg-white p-1 dark:bg-slate-950">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <span
                        key={index}
                        className={index % 2 === 0 || donation.id % (index + 2) === 0 ? "bg-slate-900 dark:bg-white" : "bg-transparent"}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  {getTraceabilityEvents(donation).map((event) => (
                    <span key={event.step}>
                      {event.step}: {event.value}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Demand forecasting">
          <div className="space-y-3">
            {forecastDemand().map((item) => (
              <div key={item.day} className="rounded-md border border-slate-200 p-4 text-sm dark:border-slate-800">
                <strong>{item.day}: {item.demand}</strong>
                <p className="mt-2 text-slate-500">{item.reason}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Heat maps and emergency mode" action={<Flame className="text-rose-600" size={20} />}>
          <div className="grid grid-cols-4 gap-2">
            {["Madhapur", "Kondapur", "Gachibowli", "Jubilee Hills", "Banjara Hills", "Secunderabad", "Kukatpally", "Begumpet"].map((zone, index) => (
              <div
                key={zone}
                className={`rounded-md p-3 text-xs font-semibold ${
                  index % 3 === 0
                    ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-100"
                    : index % 3 === 1
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-100"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
                }`}
              >
                {zone}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100">
            Emergency mode: prioritize cooked meals under 4 hours expiry in red zones.
          </div>
        </Panel>

        <Panel title="Audit identity">
          <div className="flex items-center gap-3 rounded-md border border-slate-200 p-4 text-sm dark:border-slate-800">
            <Fingerprint className="text-emerald-600" size={24} />
            Role access, activity logs, QR scans, and suspicious actions are attached to immutable audit events.
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
