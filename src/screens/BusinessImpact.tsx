import { TrendingDown, ArrowRight, Repeat, Truck, Headphones, ShoppingBag, Users, AlertTriangle, Package, Clock, FileBarChart } from 'lucide-react';
import { Card, MiniBarChart } from '@/components/ui';

export function BusinessImpact() {
  const caseEvidence = [
    { icon: <Repeat size={16} />, metric: 'Repeat purchase rate', value: '41% → 27%', detail: 'Fell significantly — fewer customers are coming back.' },
    { icon: <Truck size={16} />, metric: 'Avg delivery time', value: '29 → 37 min', detail: 'Increased by 8 minutes on average.' },
    { icon: <AlertTriangle size={16} />, metric: 'Cancellation rate', value: '6% → 11%', detail: 'Nearly doubled in recent months.' },
    { icon: <Package size={16} />, metric: 'Availability mismatch', value: '29%', detail: 'Customers report products shown as available becoming unavailable after ordering.' },
    { icon: <Package size={16} />, metric: 'Cancellations from unavailability', value: '35%', detail: 'Of all cancellations, 35% are caused by product unavailability.' },
    { icon: <Clock size={16} />, metric: 'Late deliveries (>15 min)', value: '13%', detail: 'Of recent orders delivered more than 15 minutes after the estimated time.' },
    { icon: <ShoppingBag size={16} />, metric: 'Substituted items', value: '8%', detail: 'Of recent orders contained at least one substituted item.' },
    { icon: <Headphones size={16} />, metric: 'Refund/support interactions', value: '6%', detail: 'Of recent orders required a refund or support interaction.' },
    { icon: <Clock size={16} />, metric: 'Stale inventory updates', value: '1–3 days', detail: 'Many partner stores update stock only every 1–3 days.' },
    { icon: <Users size={16} />, metric: 'Stores say inventory is too much effort', value: '39%', detail: 'Of partner stores say maintaining online inventory requires too much effort.' },
    { icon: <Users size={16} />, metric: 'New users with 2nd order in 30 days', value: '31%', detail: 'Only 31% of new users place a second order within 30 days.' },
    { icon: <Repeat size={16} />, metric: '3+ order customers re-ordering', value: '72%', detail: 'Customers completing 3 orders have a 72% probability of ordering again next month.' },
  ];

  const targetMetrics = [
    { label: 'Cancellation rate', current: 11, target: 6, unit: '%', icon: <TrendingDown size={16} />, color: 'text-red-600', bg: 'bg-red-50 ring-red-200' },
    { label: 'Delivery reliability', current: 87, target: 96, unit: '%', icon: <Truck size={16} />, color: 'text-blue-600', bg: 'bg-blue-50 ring-blue-200', invert: true },
    { label: 'Support interactions', current: 6, target: 2, unit: '%', icon: <Headphones size={16} />, color: 'text-amber-600', bg: 'bg-amber-50 ring-amber-200' },
    { label: 'Repeat purchase rate', current: 27, target: 41, unit: '%', icon: <Repeat size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50 ring-emerald-200', invert: true },
  ];

  const funnel = [
    { label: 'New users place 2nd order within 30 days', current: 31, target: 50 },
    { label: 'Customers reaching 3+ orders', current: 18, target: 35 },
    { label: '3+ order customers who re-order next month', current: 72, target: 80 },
  ];

  const chain = [
    { label: 'Better fulfilment prediction', detail: 'Identify at-risk orders before they fail — inventory, delay, and cancellation risks flagged in advance.' },
    { label: 'Fewer preventable failures', detail: 'Proactive stock confirmation and alternative routing prevent unavailability and late deliveries.' },
    { label: 'Fewer cancellations, substitutions & refunds', detail: 'Directly addresses the 35% of cancellations caused by product unavailability and the 6% needing support.' },
    { label: 'Better customer experience', detail: 'On-time delivery, fewer out-of-stock surprises, and proactive communication build trust.' },
    { label: 'Stronger repeat usage', detail: 'Reliable first experiences push more new users past the critical 3-order threshold, where 72% re-order monthly.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Business Impact</h1>
          <p className="mt-0.5 text-sm text-slate-500">Metrics NOVA CART aims to improve through fulfilment reliability</p>
        </div>
        <span className="w-fit rounded-md bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
          Simulated Demo Data
        </span>
      </div>

      {/* Section 1: Case Evidence */}
      <Card className="p-5">
        <div className="flex items-center gap-2">
          <FileBarChart size={18} className="text-slate-600" />
          <h2 className="text-sm font-semibold text-slate-900">Case Evidence — NOVA CART Current State</h2>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">Real problems identified from NOVA CART's operations data</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {caseEvidence.map((e, i) => (
            <div key={i} className="rounded-lg border border-slate-100 p-3.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-50 text-slate-500 ring-1 ring-slate-200">
                  {e.icon}
                </span>
                <span className="text-xs font-semibold text-slate-700">{e.metric}</span>
              </div>
              <p className="mt-2 text-lg font-bold text-slate-900">{e.value}</p>
              <p className="mt-0.5 text-xs text-slate-500">{e.detail}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Section 2: Expected Impact */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
        <div className="flex items-start gap-3">
          <TrendingDown size={22} className="mt-0.5 flex-shrink-0 rotate-180" />
          <div>
            <p className="text-sm font-semibold">Expected Business Impact — not measured results</p>
            <p className="mt-1 text-sm text-blue-100">
              This prototype demonstrates the decision-support capability. The targets below represent
              NOVA CART's goals if the system were deployed in production. This prototype has not
              improved these metrics — it only demonstrates how risks would be identified and addressed.
            </p>
          </div>
        </div>
      </Card>

      {/* Current vs target metrics */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Target Metrics (Simulated Demo Data)</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {targetMetrics.map((m) => (
            <Card key={m.label} className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ring-1 ${m.bg} ${m.color}`}>
                    {m.icon}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{m.label}</span>
                </div>
              </div>
              <div className="mt-4 flex items-end gap-4 sm:gap-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Current</p>
                  <p className="text-xl font-bold text-slate-900 sm:text-2xl">{m.current}{m.unit}</p>
                </div>
                <ArrowRight size={18} className="mb-2 text-slate-300" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-400">Target</p>
                  <p className="text-xl font-bold text-blue-600 sm:text-2xl">{m.target}{m.unit}</p>
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${m.invert ? 'bg-blue-500' : 'bg-slate-400'}`}
                  style={{ width: `${m.invert ? m.current : 100 - m.current}%` }}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Customer retention funnel */}
      <Card className="p-5">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-slate-900">Customer Retention Funnel</h2>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">Current vs target — moving customers past the 3-order threshold is critical</p>
        <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Current</p>
            <MiniBarChart data={funnel.map(f => ({ label: f.label, value: f.current, max: 100 }))} color="#94a3b8" />
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-400">Target</p>
            <MiniBarChart data={funnel.map(f => ({ label: f.label, value: f.target, max: 100 }))} color="#2563eb" />
          </div>
        </div>
      </Card>

      {/* Impact chain */}
      <Card className="p-5">
        <div className="flex items-center gap-2">
          <ShoppingBag size={18} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-slate-900">The Intended Impact Chain</h2>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">How better fulfilment prediction is expected to drive repeat usage</p>
        <div className="mt-4 space-y-0">
          {chain.map((step, i) => (
            <div key={i} className="flex gap-3 sm:gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white sm:h-8 sm:w-8">
                  {i + 1}
                </div>
                {i < chain.length - 1 && <div className="h-full w-px flex-1 bg-blue-200" style={{ minHeight: '2rem' }} />}
              </div>
              <div className={`pb-5 ${i === chain.length - 1 ? 'pb-0' : ''}`}>
                <p className="text-sm font-semibold text-slate-800">{step.label}</p>
                <p className="mt-0.5 text-sm text-slate-500">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
