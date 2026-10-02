import { Search, ArrowRight, AlertTriangle, Package, Clock, Activity, ShoppingCart } from 'lucide-react';
import type { SimOrder } from '@/types';
import { RiskBadge, StatusBadge, Card, DonutChart } from '@/components/ui';
import { useState } from 'react';

interface DashboardProps {
  orders: SimOrder[];
  onAnalyzeOrder: (order: SimOrder) => void;
}

export function Dashboard({ orders, onAnalyzeOrder }: DashboardProps) {
  const [search, setSearch] = useState('');

  const total = orders.length;
  const high = orders.filter(o => o.riskLevel === 'HIGH').length;
  const medium = orders.filter(o => o.riskLevel === 'MEDIUM').length;
  const low = orders.filter(o => o.riskLevel === 'LOW').length;
  const invRisk = orders.filter(o => o.mainRisk === 'Inventory Unavailability' || o.mainRisk === 'Cancellation' || o.mainRisk === 'Substitution').length;
  const delayRisk = orders.filter(o => o.mainRisk === 'Delivery Delay').length;

  const stats = [
    { label: 'Total Orders', value: total, icon: <ShoppingCart size={18} />, color: 'bg-blue-50 text-blue-600', border: 'ring-blue-200' },
    { label: 'High-Risk', value: high, icon: <AlertTriangle size={18} />, color: 'bg-red-50 text-red-600', border: 'ring-red-200' },
    { label: 'Medium-Risk', value: medium, icon: <Activity size={18} />, color: 'bg-amber-50 text-amber-600', border: 'ring-amber-200' },
    { label: 'Low-Risk', value: low, icon: <Activity size={18} />, color: 'bg-emerald-50 text-emerald-600', border: 'ring-emerald-200' },
    { label: 'Inventory-Risk', value: invRisk, icon: <Package size={18} />, color: 'bg-violet-50 text-violet-600', border: 'ring-violet-200' },
    { label: 'Delay-Risk', value: delayRisk, icon: <Clock size={18} />, color: 'bg-cyan-50 text-cyan-600', border: 'ring-cyan-200' },
  ];

  const filtered = orders.filter(o =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.store.toLowerCase().includes(search.toLowerCase()) ||
    o.mainRisk.toLowerCase().includes(search.toLowerCase())
  );

  const donutSegments = [
    { label: 'High-Risk', value: high, color: '#ef4444' },
    { label: 'Medium-Risk', value: medium, color: '#f59e0b' },
    { label: 'Low-Risk', value: low, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Operations Dashboard</h1>
          <p className="mt-0.5 text-sm text-slate-500">Real-time fulfilment risk monitoring across partner stores</p>
        </div>
        <span className="w-fit rounded-md bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
          Simulated Demo Data
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${s.color} ring-1 ${s.border}`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs font-medium text-slate-500">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Chart + summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Order Risk Distribution</h2>
            <span className="text-xs text-slate-400">{total} active orders</span>
          </div>
          <div className="mt-4 flex items-center justify-center py-2">
            <DonutChart segments={donutSegments} />
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-slate-900">Fulfilment Snapshot</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
              <span className="text-sm text-slate-600">Monitoring</span>
              <span className="text-sm font-bold text-slate-900">{orders.filter(o => o.status === 'Monitoring').length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
              <span className="text-sm text-slate-600">Pending</span>
              <span className="text-sm font-bold text-slate-900">{orders.filter(o => o.status === 'Pending').length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
              <span className="text-sm text-slate-600">Delivered</span>
              <span className="text-sm font-bold text-slate-900">{orders.filter(o => o.status === 'Delivered').length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
              <span className="text-sm text-slate-600">Confirmed</span>
              <span className="text-sm font-bold text-slate-900">{orders.filter(o => o.status === 'Confirmed').length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
              <span className="text-sm text-slate-600">Confirmation Requested</span>
              <span className="text-sm font-bold text-slate-900">{orders.filter(o => o.status === 'Confirmation Requested').length}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Orders table */}
      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <h2 className="text-sm font-semibold text-slate-900">Active Orders</h2>
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search orders, stores, risks..."
              className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>
        </div>
        {/* Desktop: table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Store</th>
                <th className="px-5 py-3">Risk</th>
                <th className="px-5 py-3">Main Risk</th>
                <th className="px-5 py-3">Recommended Action</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-slate-50/60">
                  <td className="px-5 py-3 font-mono text-xs font-medium text-slate-700">{order.id}</td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-slate-800">{order.store.split(' - ')[0]}</div>
                    <div className="text-xs text-slate-400">{order.storeArea}</div>
                  </td>
                  <td className="px-5 py-3"><RiskBadge level={order.riskLevel} /></td>
                  <td className="px-5 py-3 text-slate-600">{order.mainRisk === 'None' ? '—' : order.mainRisk}</td>
                  <td className="max-w-xs px-5 py-3">
                    <p className="truncate text-xs text-slate-500">{order.status === 'Delivered' ? 'Delivered — no action needed' : order.status === 'Cancelled' ? 'Cancelled' : order.recommendedAction}</p>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => onAnalyzeOrder(order)}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      Analyze <ArrowRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-slate-400">No orders match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile: card list */}
        <div className="divide-y divide-slate-50 md:hidden">
          {filtered.map((order) => (
            <div key={order.id} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium text-slate-700">{order.id}</span>
                <RiskBadge level={order.riskLevel} />
              </div>
              <p className="mt-1.5 text-sm font-medium text-slate-800">{order.store.split(' - ')[0]}</p>
              <p className="text-xs text-slate-400">{order.storeArea} · {order.items} items</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-slate-500">{order.mainRisk === 'None' ? 'No risk' : order.mainRisk}</span>
                <span className="text-slate-300">·</span>
                <StatusBadge status={order.status} />
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-slate-400">{order.status === 'Delivered' ? 'Delivered — no action needed' : order.status === 'Cancelled' ? 'Cancelled' : order.recommendedAction}</p>
              <button
                onClick={() => onAnalyzeOrder(order)}
                className="mt-3 inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
              >
                Analyze <ArrowRight size={13} />
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-slate-400">No orders match your search.</div>
          )}
        </div>
      </Card>
    </div>
  );
}
