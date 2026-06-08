export type DonationStatus =
  | "available"
  | "accepted"
  | "assigned"
  | "picked_up"
  | "delivered"
  | "expired";

export type Donation = {
  id: number;
  food: string;
  category: string;
  quantity: number;
  unit: string;
  donor: string;
  location: string;
  distanceKm: number;
  expiryHours: number;
  temperature: number;
  ngoCapacity: number;
  reliability: number;
  status: DonationStatus;
  ngo?: string;
  volunteer?: string;
};

export type VolunteerTask = {
  id: number;
  donationId: number;
  food: string;
  pickup: string;
  drop: string;
  distanceKm: number;
  expiryHours: number;
  status: "open" | "accepted" | "picked_up" | "delivered";
  points: number;
};

export const donations: Donation[] = [
  {
    id: 101,
    food: "Vegetable biryani",
    category: "Cooked meals",
    quantity: 85,
    unit: "meal boxes",
    donor: "Green Leaf Hotel",
    location: "Madhapur",
    distanceKm: 2.4,
    expiryHours: 3,
    temperature: 28,
    ngoCapacity: 120,
    reliability: 94,
    status: "available",
  },
  {
    id: 102,
    food: "Bakery bread packs",
    category: "Bakery",
    quantity: 140,
    unit: "packs",
    donor: "Sunrise Supermarket",
    location: "Kondapur",
    distanceKm: 4.8,
    expiryHours: 9,
    temperature: 24,
    ngoCapacity: 90,
    reliability: 88,
    status: "accepted",
    ngo: "Hope Meals Foundation",
  },
  {
    id: 103,
    food: "Fruit bowls",
    category: "Fresh produce",
    quantity: 55,
    unit: "servings",
    donor: "Orchid Events",
    location: "Gachibowli",
    distanceKm: 1.7,
    expiryHours: 2,
    temperature: 30,
    ngoCapacity: 80,
    reliability: 91,
    status: "assigned",
    ngo: "Care Kitchen",
    volunteer: "Asha",
  },
  {
    id: 104,
    food: "Rice and dal",
    category: "Cooked meals",
    quantity: 110,
    unit: "plates",
    donor: "Aroma Restaurant",
    location: "Jubilee Hills",
    distanceKm: 6.2,
    expiryHours: 5,
    temperature: 27,
    ngoCapacity: 150,
    reliability: 97,
    status: "delivered",
    ngo: "Hope Meals Foundation",
    volunteer: "Rahul",
  },
];

export const volunteerTasks: VolunteerTask[] = [
  {
    id: 301,
    donationId: 103,
    food: "Fruit bowls",
    pickup: "Orchid Events, Gachibowli",
    drop: "Care Kitchen",
    distanceKm: 3.1,
    expiryHours: 2,
    status: "accepted",
    points: 45,
  },
  {
    id: 302,
    donationId: 102,
    food: "Bakery bread packs",
    pickup: "Sunrise Supermarket, Kondapur",
    drop: "Hope Meals Foundation",
    distanceKm: 5.4,
    expiryHours: 9,
    status: "open",
    points: 35,
  },
];

export const monthlyImpact = [
  { month: "Jan", meals: 820, waste: 410 },
  { month: "Feb", meals: 980, waste: 510 },
  { month: "Mar", meals: 1240, waste: 680 },
  { month: "Apr", meals: 1490, waste: 820 },
  { month: "May", meals: 1810, waste: 960 },
  { month: "Jun", meals: 2130, waste: 1180 },
];

export function getRiskScore(donation: Pick<Donation, "expiryHours" | "temperature" | "quantity">) {
  const expiryRisk = Math.max(0, 40 - donation.expiryHours * 4);
  const tempRisk = Math.max(0, donation.temperature - 20) * 3;
  const quantityRisk = Math.min(20, donation.quantity / 8);
  return Math.min(98, Math.round(expiryRisk + tempRisk + quantityRisk));
}

export function getMatchScore(donation: Donation) {
  const distanceScore = Math.max(0, 30 - donation.distanceKm * 3);
  const expiryScore = Math.max(0, 30 - donation.expiryHours * 1.5);
  const capacityScore = Math.min(20, (donation.ngoCapacity / donation.quantity) * 12);
  const reliabilityScore = donation.reliability / 5;
  return Math.round(distanceScore + expiryScore + capacityScore + reliabilityScore);
}
