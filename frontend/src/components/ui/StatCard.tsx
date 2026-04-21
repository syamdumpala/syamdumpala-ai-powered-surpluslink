interface Props {
  title: string;
  value: string;
  icon?: React.ReactNode;
}

const StatCard = ({ title, value, icon }: Props) => {
  return (
    <div className="group relative overflow-hidden bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />

      <div className="relative z-10 flex justify-between items-center">
        <div>
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">
            {title}
          </h3>
          <p className="text-3xl font-bold mt-2 dark:text-white">
            {value}
          </p>
        </div>

        <div className="text-emerald-500 text-3xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
