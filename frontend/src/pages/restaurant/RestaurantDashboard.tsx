import { useMemo, useState } from "react";
import { Bot, Camera, Clock, MapPinned, Plus, RadioTower, Trash2 } from "lucide-react";
import SurplusAI from "../../components/ai/SurplusAI";
import DashboardShell, { Panel, Stat } from "../../components/dashboard/DashboardShell";
import {
  donations as seedDonations,
  getRiskScore,
  type Donation,
} from "../../data/surplus";
import { parseDonationCommand, recognizeFoodFromImage, type FoodRecognitionResult } from "../../utils/ai";

type FormState = {
  food: string;
  category: string;
  quantity: string;
  expiryHours: string;
  location: string;
  temperature: string;
};

const emptyForm: FormState = {
  food: "",
  category: "Cooked meals",
  quantity: "",
  expiryHours: "",
  location: "",
  temperature: "26",
};

export default function RestaurantDashboard() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [donations, setDonations] = useState<Donation[]>(seedDonations);
  const [chatCommand, setChatCommand] = useState("Donate 25 meals of rice available until 8 PM near Madhapur.");
  const [recognition, setRecognition] = useState<FoodRecognitionResult | null>(null);

  const donorDonations = donations.filter((donation) =>
    ["Green Leaf Hotel", "Aroma Restaurant", "SurplusLink Demo Donor"].includes(donation.donor)
  );

  const previewRisk = useMemo(() => {
    return getRiskScore({
      expiryHours: Number(form.expiryHours || 6),
      quantity: Number(form.quantity || 40),
      temperature: Number(form.temperature || 26),
    });
  }, [form.expiryHours, form.quantity, form.temperature]);

  const createDonation = () => {
    if (!form.food || !form.quantity || !form.expiryHours || !form.location) return;

    const newDonation: Donation = {
      id: Date.now(),
      food: form.food,
      category: form.category,
      quantity: Number(form.quantity),
      unit: "servings",
      donor: "SurplusLink Demo Donor",
      location: form.location,
      distanceKm: 2.8,
      expiryHours: Number(form.expiryHours),
      temperature: Number(form.temperature),
      ngoCapacity: 100,
      reliability: 92,
      status: "available",
    };

    setDonations([newDonation, ...donations]);
    setForm(emptyForm);
  };

  const createFromCommand = () => {
    const command = parseDonationCommand(chatCommand);
    setForm({
      food: command.food,
      category: "Cooked meals",
      quantity: String(command.quantity),
      expiryHours: String(command.expiryHours),
      location: command.location,
      temperature: "26",
    });
  };

  return (
    <DashboardShell
      title="Restaurant Dashboard"
      subtitle="Create food donation listings, predict expiry risk, and track status from pickup to delivery."
    >
      <div className="mb-6">
        <SurplusAI role="restaurant" />
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Stat label="Total donations" value={donorDonations.length} />
        <Stat
          label="Pending pickup"
          value={donorDonations.filter((item) => item.status === "available").length}
          tone="amber"
        />
        <Stat
          label="In delivery"
          value={donorDonations.filter((item) => ["accepted", "assigned", "picked_up"].includes(item.status)).length}
          tone="blue"
        />
        <Stat
          label="Meals delivered"
          value={donorDonations
            .filter((item) => item.status === "delivered")
            .reduce((total, item) => total + item.quantity, 0)}
        />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Panel title="AI chatbot donation creator" action={<Bot className="text-emerald-600" size={20} />}>
          <label className="text-sm font-medium">
            Type a donation request instead of filling the form
            <textarea
              value={chatCommand}
              onChange={(event) => setChatCommand(event.target.value)}
              className="mt-2 min-h-28 w-full rounded-md border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <button
            onClick={createFromCommand}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
          >
            <Plus size={16} />
            Extract into listing
          </button>
        </Panel>

        <Panel title="AI food recognition" action={<Camera className="text-emerald-600" size={20} />}>
          <label className="block rounded-md border border-dashed border-slate-300 p-5 text-center text-sm dark:border-slate-700">
            Upload food image
            <input
              className="mt-3 block w-full text-sm"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const result = recognizeFoodFromImage(file.name, file.size);
                setRecognition(result);
                setForm({
                  food: result.food,
                  category: "Cooked meals",
                  quantity: String(result.servings),
                  expiryHours: result.risk === "High" ? "2" : result.risk === "Medium" ? "4" : "8",
                  location: form.location || "Hitech City",
                  temperature: form.temperature,
                });
              }}
            />
          </label>
          {recognition && (
            <div className="mt-4 grid gap-3 rounded-md bg-slate-50 p-4 text-sm dark:bg-slate-950 sm:grid-cols-2">
              <span>Food: {recognition.food}</span>
              <span>Quantity: {recognition.servings} servings</span>
              <span>Freshness: {recognition.freshness}%</span>
              <span>Risk: {recognition.risk}</span>
            </div>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Create donation" action={<RadioTower className="text-emerald-600" size={20} />}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Food item
              <input
                value={form.food}
                onChange={(event) => setForm({ ...form, food: event.target.value })}
                className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-950"
                placeholder="Paneer meals"
              />
            </label>
            <label className="text-sm font-medium">
              Category
              <select
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-950"
              >
                <option>Cooked meals</option>
                <option>Bakery</option>
                <option>Fresh produce</option>
                <option>Packaged food</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              Quantity
              <input
                value={form.quantity}
                onChange={(event) => setForm({ ...form, quantity: event.target.value })}
                className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-950"
                min="1"
                type="number"
                placeholder="75"
              />
            </label>
            <label className="text-sm font-medium">
              Expiry in hours
              <input
                value={form.expiryHours}
                onChange={(event) => setForm({ ...form, expiryHours: event.target.value })}
                className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-950"
                min="1"
                type="number"
                placeholder="4"
              />
            </label>
            <label className="text-sm font-medium">
              Pickup location
              <input
                value={form.location}
                onChange={(event) => setForm({ ...form, location: event.target.value })}
                className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-950"
                placeholder="Hitech City"
              />
            </label>
            <label className="text-sm font-medium">
              Storage temperature
              <input
                value={form.temperature}
                onChange={(event) => setForm({ ...form, temperature: event.target.value })}
                className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-950"
                min="1"
                type="number"
              />
            </label>
          </div>

          <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold">Expiry risk prediction</span>
              <span className="text-2xl font-bold">{previewRisk}%</span>
            </div>
            <p className="mt-1 text-sm">
              Risk is estimated from expiry time, quantity, and storage temperature.
            </p>
          </div>

          <button
            onClick={createDonation}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            <Plus size={18} />
            Post donation
          </button>
        </Panel>

        <Panel title="Donation history">
          <div className="space-y-3">
            {donorDonations.map((donation) => (
              <article
                key={donation.id}
                className="rounded-md border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{donation.food}</h3>
                    <p className="text-sm text-slate-500">
                      {donation.quantity} {donation.unit} from {donation.location}
                    </p>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {donation.status.replace("_", " ")}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <span className="inline-flex items-center gap-2">
                    <Clock size={16} />
                    {donation.expiryHours}h expiry
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPinned size={16} />
                    {donation.distanceKm} km
                  </span>
                  <span>Risk {getRiskScore(donation)}%</span>
                </div>
                {donation.donor === "SurplusLink Demo Donor" && (
                  <button
                    onClick={() =>
                      setDonations(donations.filter((item) => item.id !== donation.id))
                    }
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-rose-600"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                )}
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
