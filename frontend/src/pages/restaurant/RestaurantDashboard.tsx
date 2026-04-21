import { useState } from "react";
import { motion } from "framer-motion";

export default function RestaurantDashboard() {
  const [food, setFood] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");

  const [donations, setDonations] = useState([
    { id: 1, food: "Rice", quantity: "10 plates", status: "Pending" },
    { id: 2, food: "Meals", quantity: "20 boxes", status: "Accepted" },
  ]);

  // 🔥 CREATE DONATION
  const handleCreateDonation = () => {
    if (!food || !quantity || !location) return;

    const newDonation = {
      id: Date.now(),
      food,
      quantity,
      status: "Pending",
    };

    setDonations([newDonation, ...donations]);

    setFood("");
    setQuantity("");
    setLocation("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-100 dark:from-gray-950 dark:to-black p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Restaurant Dashboard 🍽️
        </h1>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="px-4 py-2 rounded-xl bg-red-500 text-white"
        >
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        {[
          { title: "Total Donations", value: donations.length },
          { title: "Pending", value: donations.filter(d => d.status === "Pending").length },
          { title: "Accepted", value: donations.filter(d => d.status === "Accepted").length },
          { title: "Completed", value: donations.filter(d => d.status === "Completed").length },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl shadow-lg border border-white/20"
          >
            <h3 className="text-gray-500 text-sm">{item.title}</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* CREATE DONATION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl shadow-lg border border-white/20"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Create Donation
          </h2>

          <input
            type="text"
            placeholder="Food Item"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            className="w-full p-3 rounded-xl mb-4 bg-white/80 dark:bg-gray-800 border"
          />

          <input
            type="text"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-3 rounded-xl mb-4 bg-white/80 dark:bg-gray-800 border"
          />

          <input
            type="text"
            placeholder="Pickup Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 rounded-xl mb-6 bg-white/80 dark:bg-gray-800 border"
          />

          <button
            onClick={handleCreateDonation}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-orange-500 text-white font-semibold"
          >
            Post Donation 🚀
          </button>
        </motion.div>

        {/* DONATION LIST */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl shadow-lg border border-white/20"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            My Donations
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th>Food</th>
                <th>Qty</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {donations.map((item) => (
                <tr key={item.id} className="border-t border-gray-300 dark:border-gray-700">
                  <td className="py-2">{item.food}</td>
                  <td>{item.quantity}</td>
                  <td
                    className={
                      item.status === "Pending"
                        ? "text-yellow-500"
                        : item.status === "Accepted"
                        ? "text-blue-500"
                        : "text-green-500"
                    }
                  >
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

      </div>
    </div>
  );
}