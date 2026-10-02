import { BellRing, CheckCircle2, XCircle, Package, MapPin, ArrowRight } from 'lucide-react';
import type { StoreAlert, SimOrder } from '@/types';
import { StatusBadge, Card } from '@/components/ui';
import { useState } from 'react';

interface StoreAlertsProps {
  alerts: StoreAlert[];
  orders: SimOrder[];
  onResolveAlert: (alertId: string, status: 'Resolved' | 'Unavailable') => void;
  onAnalyzeOrder: (order: SimOrder) => void;
}

const demandColor = {
  high: 'bg-violet-50 text-violet-700 ring-violet-200',
  medium: 'bg-blue-50 text-blue-700 ring-blue-200',
  low: 'bg-slate-50 text-slate-600 ring-slate-200',
};

export function StoreAlerts({ alerts, orders, onResolveAlert, onAnalyzeOrder }: StoreAlertsProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  const visible = alerts.filter(a =>
    filter === 'all' ? true : filter === 'pending' ? a.status === 'Pending' : a.status !== 'Pending'
  );

  const pending = alerts.filter(a => a.status === 'Pending').length;
  const resolved = alerts.filter(a => a.status === 'Resolved').length;
  const unavailable = alerts.filter(a => a.status === 'Unavailable').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Store Alerts</h1>
          <p className="mt-0.5 text-sm text-slate-500">Partner store confirmation requests for at-risk inventory</p>
        </div>
        <span className="w-fit rounded-md bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
          Simulated Demo Data
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 ring-1 ring-amber-200">
              <BellRing size={16} className="text-amber-600" />
            </div>
            <p className="text-xl font-bold text-slate-900 sm:text-2xl">{pending}</p>
          </div>
          <p className="mt-1.5 text-[11px] font-medium text-slate-500 sm:text-xs">Pending Action</p>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-200">
              <CheckCircle2 size={16} className="text-emerald-600" />
            </div>
            <p className="text-xl font-bold text-slate-900 sm:text-2xl">{resolved}</p>
          </div>
          <p className="mt-1.5 text-[11px] font-medium text-slate-500 sm:text-xs">Confirmed Available</p>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 ring-1 ring-red-200">
              <XCircle size={16} className="text-red-600" />
            </div>
            <p className="text-xl font-bold text-slate-900 sm:text-2xl">{unavailable}</p>
          </div>
          <p className="mt-1.5 text-[11px] font-medium text-slate-500 sm:text-xs">Marked Unavailable</p>
        </Card>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
        {(['all', 'pending', 'resolved'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-all ${
              filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {f === 'resolved' ? 'Resolved' : f}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {visible.map((alert) => {
          const order = orders.find(o => o.id === alert.orderId);
          return (
            <Card key={alert.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                  alert.status === 'Pending' ? 'bg-amber-50 ring-1 ring-amber-200' : alert.status === 'Resolved' ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'bg-red-50 ring-1 ring-red-200'
                }`}>
                  <Package size={18} className={
                    alert.status === 'Pending' ? 'text-amber-600' : alert.status === 'Resolved' ? 'text-emerald-600' : 'text-red-600'
                  } />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{alert.product}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${demandColor[alert.demand]}`}>
                      {alert.demand} demand
                    </span>
                    <StatusBadge status={alert.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{alert.message}</p>
                  <div className="mt-2 flex flex-col gap-1 text-xs text-slate-400 sm:flex-row sm:items-center sm:gap-3">
                    <span className="flex items-center gap-1"><MapPin size={12} /> <span className="truncate">{alert.store}</span></span>
                    <span>Order: <span className="font-mono font-medium text-slate-500">{alert.orderId}</span></span>
                  </div>

                  {alert.status === 'Pending' && (
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <button
                        onClick={() => onResolveAlert(alert.id, 'Resolved')}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
                      >
                        <CheckCircle2 size={15} /> Confirm Available
                      </button>
                      <button
                        onClick={() => onResolveAlert(alert.id, 'Unavailable')}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-red-600 ring-1 ring-red-200 transition-colors hover:bg-red-50"
                      >
                        <XCircle size={15} /> Mark Unavailable
                      </button>
                    </div>
                  )}

                  {alert.status !== 'Pending' && order && (
                    <button
                      onClick={() => onAnalyzeOrder(order)}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      Re-analyze order <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        {visible.length === 0 && (
          <Card className="flex flex-col items-center justify-center py-16">
            <CheckCircle2 size={40} className="text-emerald-300" />
            <p className="mt-3 text-sm font-medium text-slate-400">No alerts in this view</p>
          </Card>
        )}
      </div>
    </div>
  );
}
