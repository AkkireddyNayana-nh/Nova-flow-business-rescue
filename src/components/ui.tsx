import type { RiskLevel, OrderStatus, AlertStatus } from '@/types';

export function RiskBadge({ level }: { level: RiskLevel }) {
  const styles: Record<RiskLevel, string> = {
    HIGH: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    MEDIUM: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    LOW: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  };
  const dotColors: Record<RiskLevel, string> = {
    HIGH: 'bg-red-500',
    MEDIUM: 'bg-amber-500',
    LOW: 'bg-emerald-500',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[level]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotColors[level]} ${level === 'HIGH' ? 'animate-pulse' : ''}`} />
      {level}
    </span>
  );
}

export function StatusBadge({ status }: { status: OrderStatus | AlertStatus }) {
  const map: Record<string, string> = {
    Monitoring: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    Pending: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
    Confirmed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    'Confirmation Requested': 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
    Unavailable: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    Delivered: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
    Cancelled: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    Resolved: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status] ?? 'bg-slate-50 text-slate-600 ring-1 ring-slate-200'}`}>
      {status}
    </span>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}

export function MiniBarChart({ data, color = '#2563eb' }: { data: { label: string; value: number; max: number }[]; color?: string }) {
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">{d.label}</span>
            <span className="font-semibold text-slate-900">{d.value}%</span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(d.value / d.max) * 100}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let offset = 0;
  const circumference = 2 * Math.PI * 54;

  return (
    <div className="flex items-center gap-6">
      <svg width="140" height="140" viewBox="0 0 120 120" className="flex-shrink-0">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#f1f5f9" strokeWidth="12" />
        {segments.map((seg) => {
          const len = (seg.value / total) * circumference;
          const circle = (
            <circle
              key={seg.label}
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={seg.color}
              strokeWidth="12"
              strokeDasharray={`${len} ${circumference - len}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dasharray 0.8s ease-out, stroke-dashoffset 0.8s ease-out' }}
            />
          );
          offset += len;
          return circle;
        })}
        <text x="60" y="56" textAnchor="middle" className="fill-slate-900 text-2xl font-bold">{total}</text>
        <text x="60" y="74" textAnchor="middle" className="fill-slate-400 text-[10px]">Orders</text>
      </svg>
      <div className="space-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: seg.color }} />
            <span className="text-slate-600">{seg.label}</span>
            <span className="font-semibold text-slate-900">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
