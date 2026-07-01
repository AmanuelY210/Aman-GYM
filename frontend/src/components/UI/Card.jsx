export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-dark-800">{title}</h3>
        {subtitle && <p className="text-sm text-dark-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
