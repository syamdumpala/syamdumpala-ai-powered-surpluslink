import {
  donations,
  getRiskScore,
  volunteerTasks,
  type Donation,
  type VolunteerTask,
} from "../data/surplus";
import type { Role } from "../context/AuthContext";

export type DonationCommand = {
  food: string;
  quantity: number;
  expiryHours: number;
  location: string;
  confidence: number;
};

export type FoodRecognitionResult = {
  food: string;
  servings: number;
  freshness: number;
  risk: "Low" | "Medium" | "High";
};

const ngoRecommendations = [
  { name: "Hope Meals Foundation", distanceKm: 2.1, capacity: 140, reliability: 96 },
  { name: "Care Kitchen", distanceKm: 3.4, capacity: 90, reliability: 91 },
  { name: "Seva Food Bank", distanceKm: 5.8, capacity: 210, reliability: 94 },
];

export function parseDonationCommand(input: string): DonationCommand {
  const lower = input.toLowerCase();
  const quantity = Number(lower.match(/(\d+)\s*(meals|plates|boxes|servings|packs)?/)?.[1] || 25);
  const expiryHours =
    Number(lower.match(/(\d+)\s*(hours|hour|hrs|hr)/)?.[1]) ||
    inferExpiryFromClock(lower);
  const food =
    ["biryani", "rice", "dal", "bread", "snacks", "fruit", "meals"].find((item) =>
      lower.includes(item)
    ) || "mixed meals";
  const location =
    lower.match(/(?:at|from|near|in)\s+([a-z ]{3,})/)?.[1]?.trim() || "Hitech City";

  return {
    food: titleCase(food),
    quantity,
    expiryHours,
    location: titleCase(location),
    confidence: Math.min(98, 64 + quantity / 2 + Math.max(0, 12 - expiryHours)),
  };
}

export function recognizeFoodFromImage(fileName: string, fileSize: number): FoodRecognitionResult {
  const lower = fileName.toLowerCase();
  const food = lower.includes("rice")
    ? "Rice meals"
    : lower.includes("bread")
      ? "Bakery bread"
      : lower.includes("fruit")
        ? "Fruit bowls"
        : lower.includes("biryani")
          ? "Biryani"
          : "Cooked mixed meals";
  const servings = Math.max(20, Math.min(180, Math.round(fileSize / 26000)));
  const freshness = Math.max(62, Math.min(96, 92 - Math.round(servings / 18)));
  const risk = freshness > 84 ? "Low" : freshness > 72 ? "Medium" : "High";

  return { food, servings, freshness, risk };
}

export function getDynamicPriority(donation: Donation) {
  const urgency = Math.max(0, 35 - donation.expiryHours * 4);
  const distance = Math.max(0, 24 - donation.distanceKm * 2.5);
  const quantity = Math.min(22, donation.quantity / 6);
  const demand = donation.category === "Cooked meals" ? 18 : 12;
  const capacity = Math.min(18, donation.ngoCapacity / 8);
  return Math.round(urgency + distance + quantity + demand + capacity);
}

export function getPickupSuccessProbability(donation: Donation) {
  const priority = getDynamicPriority(donation);
  const riskPenalty = getRiskScore(donation) / 5;
  return Math.max(42, Math.min(97, Math.round(58 + priority / 2 - riskPenalty)));
}

export function recommendNGOs(donation: Pick<Donation, "quantity" | "expiryHours">) {
  return ngoRecommendations
    .map((ngo) => ({
      ...ngo,
      fitScore: Math.round(
        ngo.reliability / 2 + Math.min(25, ngo.capacity / donation.quantity) + Math.max(0, 20 - ngo.distanceKm * 2)
      ),
    }))
    .sort((first, second) => second.fitScore - first.fitScore);
}

export function optimizeRoute(tasks: VolunteerTask[]) {
  return [...tasks]
    .filter((task) => task.status !== "delivered")
    .sort((first, second) => first.expiryHours - second.expiryHours || first.distanceKm - second.distanceKm)
    .map((task, index) => ({
      stop: index + 1,
      label: `${task.pickup} -> ${task.drop}`,
      etaMinutes: Math.round(task.distanceKm * 5 + index * 8),
    }));
}

export function forecastDemand() {
  return [
    { day: "Sunday", demand: "Very high", reason: "Community kitchen demand increases after weekend events." },
    { day: "Festival week", demand: "Critical", reason: "Food supply rises, but beneficiary demand rises faster." },
    { day: "Month end", demand: "High", reason: "NGO pantry capacity is usually lower." },
  ];
}

export function getCarbonMetrics(savedMeals: number) {
  const foodKg = Math.round(savedMeals * 0.45);
  return {
    foodKg,
    co2Tons: Number((foodKg * 2.5 / 1000).toFixed(2)),
    waterLiters: Math.round(foodKg * 1250),
    mealsServed: savedMeals,
  };
}

export function getFraudSignals() {
  return [
    { entity: "Orchid Events", signal: "Repeated edits near expiry", risk: "Medium" },
    { entity: "New donor account", signal: "Large donation with no pickup history", risk: "High" },
    { entity: "Volunteer route", signal: "Delivery delay outside normal range", risk: "Low" },
  ];
}

export function getTraceabilityEvents(donation: Donation) {
  return [
    { step: "Donor created listing", value: donation.donor },
    { step: "NGO matched", value: donation.ngo || "Pending" },
    { step: "Volunteer assigned", value: donation.volunteer || "Pending" },
    { step: "Beneficiary delivery", value: donation.status === "delivered" ? "Completed" : "Awaiting scan" },
  ];
}

export function generateAssistantResponse(role: Role, input: string) {
  const lower = input.toLowerCase();
  const urgentDonations = [...donations].sort(
    (first, second) => getDynamicPriority(second) - getDynamicPriority(first)
  );

  if (role === "restaurant") {
    const command = parseDonationCommand(input);
    const sampleDonation = {
      ...donations[0],
      food: command.food,
      quantity: command.quantity,
      expiryHours: command.expiryHours,
    };
    const ngos = recommendNGOs(sampleDonation);
    return [
      `Spoilage risk is ${getRiskScore(sampleDonation)}%, so this should be treated as ${command.expiryHours <= 3 ? "urgent" : "standard priority"}.`,
      `Best NGO match: ${ngos[0].name}, ${ngos[0].distanceKm} km away, fit score ${ngos[0].fitScore}.`,
      `Assign one volunteer now. Pickup success probability is ${getPickupSuccessProbability(sampleDonation)}%.`,
    ];
  }

  if (role === "ngo" || lower.includes("prioritize")) {
    return urgentDonations.slice(0, 3).map((donation, index) =>
      `${index + 1}. ${donation.food} from ${donation.donor}: priority ${getDynamicPriority(donation)}, risk ${getRiskScore(donation)}%, expected impact ${donation.quantity} ${donation.unit}.`
    );
  }

  if (role === "volunteer" || lower.includes("route") || lower.includes("urgent")) {
    return optimizeRoute(volunteerTasks).map((stop) =>
      `Stop ${stop.stop}: ${stop.label}. Estimated ${stop.etaMinutes} minutes.`
    );
  }

  return [
    "Security review: enable rate limiting, JWT validation, role-based authorization, suspicious activity alerts, and audit logs.",
    `Fraud model flags ${getFraudSignals().filter((signal) => signal.risk !== "Low").length} medium/high-risk entities for review.`,
    "Emergency mode should boost priority for nearby cooked meals, short expiry windows, and high-demand zones.",
  ];
}

function inferExpiryFromClock(input: string) {
  if (input.includes("8 pm") || input.includes("8pm")) return 5;
  if (input.includes("tonight")) return 6;
  if (input.includes("soon")) return 2;
  return 4;
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
