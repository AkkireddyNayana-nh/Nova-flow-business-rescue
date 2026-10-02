import { Zap, ShieldCheck, Database, ArrowRight, FileText } from 'lucide-react';
import { Card } from '@/components/ui';

export function About({ onGoToDashboard }: { onGoToDashboard: () => void }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Zap size={26} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">NOVA FLOW</h1>
          <p className="text-sm text-slate-500">Predict. Prevent. Deliver.</p>
        </div>
      </div>

      <Card className="border-blue-200 p-5">
        <div className="flex items-start gap-3">
          <FileText size={20} className="mt-0.5 flex-shrink-0 text-blue-600" />
          <p className="text-sm leading-relaxed text-slate-700">
            NOVA FLOW is an AI-powered decision-support prototype that detects fulfilment risk,
            explains the likely cause and recommends preventive action before a customer experiences a failure.
          </p>
        </div>
      </Card>

      <Card className="p-5">
        <p className="text-sm leading-relaxed text-slate-700">
          NOVA FLOW helps NOVA CART identify fulfilment risks before they become customer problems.
          It monitors active orders across 620 partner stores, flags inventory unavailability, delivery delays,
          cancellation and substitution risks, and recommends preventive actions — so issues are caught early
          instead of discovered by the customer.
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 ring-1 ring-blue-200">
            <ShieldCheck size={18} className="text-blue-600" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-800">Decision Support</p>
          <p className="mt-0.5 text-xs text-slate-500">Transparent, rule-based risk logic — not a trained ML model.</p>
        </Card>
        <Card className="p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 ring-1 ring-violet-200">
            <Database size={18} className="text-violet-600" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-800">Simulated Data</p>
          <p className="mt-0.5 text-xs text-slate-500">All orders, stores, and alerts are fictional demo data.</p>
        </Card>
        <Card className="p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-200">
            <Zap size={18} className="text-emerald-600" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-800">Hackathon Prototype</p>
          <p className="mt-0.5 text-xs text-slate-500">Built to demonstrate the core workflow end-to-end.</p>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-900">Demo Flow</h2>
        <ol className="mt-3 space-y-2">
          {[
            'Open the Dashboard and review the risk distribution.',
            'Select a high-risk order and click "Analyze".',
            'View the risk level, category, signals, and recommended action.',
            'Click "Action Taken" to apply the recommendation.',
            'Return to the Dashboard — the order status has updated.',
            'Visit Store Alerts to confirm or mark product availability.',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        <button
          onClick={onGoToDashboard}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Go to Dashboard <ArrowRight size={16} />
        </button>
      </Card>
    </div>
  );
}
