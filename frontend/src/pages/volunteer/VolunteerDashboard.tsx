import { useState } from "react";
import { Award, CheckCircle2, MapPinned, Mic, PackageCheck, Route, Truck } from "lucide-react";
import SurplusAI from "../../components/ai/SurplusAI";
import DashboardShell, { Panel, Stat } from "../../components/dashboard/DashboardShell";
import { volunteerTasks as seedTasks, type VolunteerTask } from "../../data/surplus";
import { optimizeRoute } from "../../utils/ai";

const nextStatus = {
  open: "accepted",
  accepted: "picked_up",
  picked_up: "delivered",
  delivered: "delivered",
} satisfies Record<VolunteerTask["status"], VolunteerTask["status"]>;

export default function VolunteerDashboard() {
  const [tasks, setTasks] = useState<VolunteerTask[]>(seedTasks);
  const [voiceMessage, setVoiceMessage] = useState("Voice assistant ready");
  const earnedPoints = tasks
    .filter((task) => task.status === "delivered")
    .reduce((total, task) => total + task.points, 120);

  const updateTask = (taskId: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status: nextStatus[task.status] } : task
      )
    );
  };

  const runVoiceCommand = () => {
    const activeTask = tasks.find((task) => task.status === "picked_up") || tasks.find((task) => task.status === "accepted");
    if (!activeTask) {
      setVoiceMessage("No active delivery found. Try accepting the most urgent task first.");
      return;
    }

    updateTask(activeTask.id);
    setVoiceMessage(`Voice command processed: updated ${activeTask.food}.`);
  };

  return (
    <DashboardShell
      title="Volunteer Dashboard"
      subtitle="Accept nearby pickups, update delivery status, and build community reward points."
    >
      <div className="mb-6">
        <SurplusAI role="volunteer" />
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Stat label="Open tasks" value={tasks.filter((task) => task.status === "open").length} />
        <Stat
          label="Active deliveries"
          value={tasks.filter((task) => ["accepted", "picked_up"].includes(task.status)).length}
          tone="blue"
        />
        <Stat label="Completed" value={tasks.filter((task) => task.status === "delivered").length + 4} />
        <Stat label="Reward points" value={earnedPoints} tone="amber" />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Optimized pickup route" action={<Route className="text-emerald-600" size={20} />}>
          <div className="space-y-3">
            {optimizeRoute(tasks).map((stop) => (
              <div
                key={stop.stop}
                className="rounded-md border border-slate-200 p-4 text-sm dark:border-slate-800"
              >
                <strong>Stop {stop.stop}</strong>
                <p className="mt-1 text-slate-500">{stop.label}</p>
                <p className="mt-2 font-semibold text-emerald-600">ETA {stop.etaMinutes} minutes</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Voice assistant" action={<Mic className="text-emerald-600" size={20} />}>
          <p className="text-sm text-slate-500">
            Demo command: "Mark delivery completed" or "Create pickup update".
          </p>
          <button
            onClick={runVoiceCommand}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
          >
            <Mic size={16} />
            Simulate voice command
          </button>
          <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-950">
            {voiceMessage}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Panel title="Nearby pickup tasks">
          <div className="space-y-3">
            {tasks.map((task) => (
              <article
                key={task.id}
                className="rounded-md border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{task.food}</h3>
                    <p className="text-sm text-slate-500">{task.pickup}</p>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {task.status.replace("_", " ")}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <span className="inline-flex items-center gap-2">
                    <MapPinned size={16} />
                    {task.distanceKm} km
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Truck size={16} />
                    Drop: {task.drop}
                  </span>
                  <span>{task.points} points</span>
                </div>

                <button
                  disabled={task.status === "delivered"}
                  onClick={() => updateTask(task.id)}
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                >
                  <PackageCheck size={16} />
                  {task.status === "open" && "Accept task"}
                  {task.status === "accepted" && "Mark picked up"}
                  {task.status === "picked_up" && "Mark delivered"}
                  {task.status === "delivered" && "Delivered"}
                </button>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Rewards and trust">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-5 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
            <div className="flex items-center gap-3">
              <Award size={28} />
              <div>
                <h3 className="text-xl font-bold">Community Champion</h3>
                <p className="text-sm">Next badge at 250 points</p>
              </div>
            </div>
            <div className="mt-5 h-3 rounded-full bg-white/70 dark:bg-slate-900">
              <span
                className="block h-3 rounded-full bg-amber-500"
                style={{ width: `${Math.min(100, (earnedPoints / 250) * 100)}%` }}
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {[
              "Completed four verified deliveries this month",
              "Average pickup delay below 12 minutes",
              "Reliability rating: 4.8 out of 5",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-md border border-slate-200 p-3 text-sm dark:border-slate-800"
              >
                <CheckCircle2 className="text-emerald-600" size={18} />
                {item}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
