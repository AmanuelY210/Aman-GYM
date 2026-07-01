export default function StatsCard({ title, value, icon: Icon, change, changeType = 'increase', color = 'primary' }) {
  const colors = {
    primary: 'bg-primary-100 text-primary-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-dark-500">{title}</p>
        <p className="text-2xl font-bold text-dark-800">{value}</p>
      </div>
      {change !== undefined && (
        <span className={`text-sm font-medium ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
          {changeType === 'increase' ? '+' : ''}{change}%
        </span>
      )}
    </div>
  );
}
