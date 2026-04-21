import { motion } from "framer-motion";

export default function VolunteerDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-100 dark:from-gray-950 dark:to-black p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Volunteer Dashboard 🚴
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
          { title: "Assigned Tasks", value: "12" },
          { title: "In Progress", value: "5" },
          { title: "Completed", value: "20" },
          { title: "Distance Covered", value: "45 km" },
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

        {/* AVAILABLE TASKS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl shadow-lg border border-white/20"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Available Pickups
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th>Food</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {[
                { food: "Rice", location: "Hotel A" },
                { food: "Meals", location: "Hotel B" },
              ].map((item, i) => (
                <tr key={i} className="border-t border-gray-300 dark:border-gray-700">
                  <td className="py-2">{item.food}</td>
                  <td>{item.location}</td>
                  <td>
                    <button className="px-3 py-1 bg-green-500 text-white rounded-lg">
                      Accept
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* MY TASKS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl shadow-lg border border-white/20"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            My Deliveries
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th>Food</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {[
                { food: "Snacks", status: "Picked" },
                { food: "Meals", status: "In Transit" },
              ].map((item, i) => (
                <tr key={i} className="border-t border-gray-300 dark:border-gray-700">
                  <td className="py-2">{item.food}</td>
                  <td
                    className={
                      item.status === "In Transit"
                        ? "text-blue-500"
                        : "text-yellow-500"
                    }
                  >
                    {item.status}
                  </td>
                  <td>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded-lg">
                      Update
                    </button>
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