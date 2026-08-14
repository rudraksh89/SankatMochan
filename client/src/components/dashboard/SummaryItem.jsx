const SummaryItem = ({ icon: Icon, title, value, color }) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition">

      <div className={`p-3 rounded-xl bg-white shadow ${color}`}>
        <Icon size={24} />
      </div>

      <div>
        <p className="text-sm text-gray-500">
          {title}
        </p>

        <h3 className="text-lg font-semibold text-slate-800">
          {value}
        </h3>
      </div>

    </div>
  );
};

export default SummaryItem;