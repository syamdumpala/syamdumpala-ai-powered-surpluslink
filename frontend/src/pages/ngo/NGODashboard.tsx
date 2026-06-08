import { useMemo, useState } from "react";
import { CheckCircle2, Clock, MapPinned, Route, Users } from "lucide-react";
import SurplusAI from "../../components/ai/SurplusAI";
import DashboardShell, { Panel, Stat } from "../../components/dashboard/DashboardShell";
import {
  donations as seedDonations,
  getMatchScore,
  getRiskScore,
  type Donation,
} from "../../data/surplus";
import { getDynamicPriority, recommendNGOs } from "../../utils/ai";

export default function NGODashboard() {
  const [donations, setDonations] = useState<Donation[]>(seedDonations);
  const [capacity, setCapacity] = useState(120);

  const availableDonations = useMemo(() => {
    return donations
      .filter((donation) => donation.status === "available")
      .sort((first, second) => getMatchScore(second) - getMatchScore(first));
  }, [donations]);

  const acceptedDonations = donations.filter((donation) =>
    donation.ngo === "Hope Meals Foundation" || donation.status === "accepted"
  );

  const acceptDonation = (donationId: number) => {
    setDonations((currentDonations) =>
      currentDonations.map((donation) =>
        donation.id === donationId
          ? {
              ...donation,
              status: "accepted",
              ngo: "Hope Meals Foundation",
              ngoCapacity: capacity,
            }
          : donation
      )
    );
  };

  return (
    <DashboardShell
      title="NGO Dashboard"
      subtitle="Browse ranked donations, accept urgent food requests, and coordinate beneficiaries."
    >
      <div className="mb-6">
        <SurplusAI role="ngo" />
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Stat label="Available matches" value={availableDonations.length} />
        <Stat label="Accepted" value={acceptedDonations.length} tone="blue" />
        <Stat
          label="Urgent pickups"
          value={donations.filter((item) => getRiskScore(item) > 70).length}
          tone="rose"
        />
        <Stat label="Beneficiary capacity" value={capacity} tone="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel
          title="Smart matched donations"
          action={
            <label className="flex items-center gap-2 text-sm">
              <Users size={16} />
              Capacity
              <input
                value={capacity}
                onChange={(event) => setCapacity(Number(event.target.value))}
                className="w-20 rounded-md border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950"
                min="1"
                type="number"
              />
            </label>
          }
        >
          <div className="space-y-3">
            {availableDonations.map((donation) => (
              <article
                key={donation.id}
                className="rounded-md border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{donation.food}</h3>
                    <p className="text-sm text-slate-500">
                      {donation.quantity} {donation.unit} by {donation.donor}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-bold text-emerald-600">
                      {getDynamicPriority(donation)}
                    </span>
                    <span className="text-xs text-slate-500">priority score</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-5">
                  <span className="inline-flex items-center gap-2">
                    <MapPinned size={16} />
                    {donation.distanceKm} km
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock size={16} />
                    {donation.expiryHours}h
                  </span>
                  <span>Risk {getRiskScore(donation)}%</span>
                  <span>Match {getMatchScore(donation)}</span>
                  <span>{donation.category}</span>
                </div>

                <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-950">
                  Beneficiary impact: {Math.min(capacity, donation.quantity)} people.
                  Recommended route: {donation.location} pickup, then nearest beneficiary zone.
                </div>

                <button
                  onClick={() => acceptDonation(donation.id)}
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  <CheckCircle2 size={16} />
                  Accept donation
                </button>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Accepted donations">
          <div className="space-y-3">
            {acceptedDonations.map((donation) => (
              <article
                key={donation.id}
                className="rounded-md border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{donation.food}</h3>
                    <p className="text-sm text-slate-500">{donation.donor}</p>
                  </div>
                  <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold uppercase text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {donation.status.replace("_", " ")}
                  </span>
                </div>
                <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-950">
                  Beneficiaries planned: {Math.min(capacity, donation.quantity)}
                  <br />
                  Volunteer: {donation.volunteer || "Awaiting assignment"}
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Recommendation engine">
          <div className="space-y-3">
            {recommendNGOs({ quantity: capacity, expiryHours: 4 }).map((ngo) => (
              <div
                key={ngo.name}
                className="rounded-md border border-slate-200 p-4 text-sm dark:border-slate-800"
              >
                <div className="flex items-center justify-between gap-3">
                  <strong>{ngo.name}</strong>
                  <span className="font-semibold text-emerald-600">Fit {ngo.fitScore}</span>
                </div>
                <p className="mt-2 text-slate-500">
                  {ngo.distanceKm} km away, capacity {ngo.capacity}, reliability {ngo.reliability}%.
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Suggested pickup routes" action={<Route size={18} className="text-emerald-600" />}>
          <div className="space-y-3 text-sm">
            {availableDonations.slice(0, 3).map((donation, index) => (
              <div key={donation.id} className="rounded-md bg-slate-50 p-3 dark:bg-slate-950">
                Route {index + 1}: {donation.location} to nearest beneficiary cluster, priority {getDynamicPriority(donation)}.
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
