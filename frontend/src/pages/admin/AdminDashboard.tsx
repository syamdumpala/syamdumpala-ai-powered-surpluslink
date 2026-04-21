import { motion } from "framer-motion";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-950 dark:to-black p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Admin Dashboard ⚡
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

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">

        {[
          { title: "Total Donations", value: "124" },
          { title: "Active Requests", value: "38" },
          { title: "Volunteers", value: "56" },
          { title: "NGOs", value: "21" },
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

        {/* USERS TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl shadow-lg border border-white/20"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Users
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {[
                { name: "Ramesh", role: "Restaurant", status: "Active" },
                { name: "Sita", role: "Volunteer", status: "Active" },
                { name: "NGO Trust", role: "NGO", status: "Pending" },
              ].map((user, i) => (
                <tr key={i} className="border-t border-gray-300 dark:border-gray-700">
                  <td className="py-2">{user.name}</td>
                  <td>{user.role}</td>
                  <td
                    className={
                      user.status === "Active"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }
                  >
                    {user.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* DONATIONS TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl shadow-lg border border-white/20"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Recent Donations
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th>Food</th>
                <th>Restaurant</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {[
                { food: "Rice", restaurant: "Hotel A", status: "Pending" },
                { food: "Meals", restaurant: "Hotel B", status: "Picked" },
                { food: "Snacks", restaurant: "Cafe C", status: "Delivered" },
              ].map((item, i) => (
                <tr key={i} className="border-t border-gray-300 dark:border-gray-700">
                  <td className="py-2">{item.food}</td>
                  <td>{item.restaurant}</td>
                  <td
                    className={
                      item.status === "Delivered"
                        ? "text-green-500"
                        : item.status === "Picked"
                        ? "text-blue-500"
                        : "text-yellow-500"
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