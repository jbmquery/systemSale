function DashboardCard({ titulo, valor, color }) {
  return (
    <div className={`rounded-2xl p-5 shadow-md ${color}`}>
      <h3 className="text-sm font-medium text-white">{titulo}</h3>
      <p className="text-3xl font-bold text-white mt-2">{valor}</p>
    </div>
  );
}

export default DashboardCard;