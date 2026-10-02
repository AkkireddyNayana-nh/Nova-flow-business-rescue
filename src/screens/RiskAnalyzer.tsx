import { useState, useEffect } from 'react';
import { ScanSearch, ChevronRight, Package, Store, Clock, ShoppingBag, Zap, ArrowLeft, CheckCircle2, AlertTriangle, Info, ArrowRight, BellRing } from 'lucide-react';
import type { SimOrder, RiskAssessment, ActionType } from '@/types';
import { RiskBadge, StatusBadge, Card } from '@/components/ui';
import { analyzeOrder, getActionType } from '@/data/simData';

interface AnalyzerProps {
  orders: SimOrder[];
  selectedOrder: SimOrder | null;
  onSelectOrder: (order: SimOrder) => void;
  onActionTaken: (order: SimOrder, action: ActionType) => void;
  onBackToDashboard: () => void;
}

const severityConfig = {
  info: { icon: <Info size={16} />, color: 'text-blue-600 bg-blue-50 ring-blue-200', label: 'Info' },
  warning: { icon: <AlertTriangle size={16} />, color: 'text-amber-600 bg-amber-50 ring-amber-200', label: 'Warning' },
  critical: { icon: <AlertTriangle size={16} />, color: 'text-red-600 bg-red-50 ring-red-200', label: 'Critical' },
};

const availabilityBadge = {
  yes: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  uncertain: 'bg-amber-50 text-amber-700 ring-amber-200',
  no: 'bg-red-50 text-red-700 ring-red-200',
};

const demandBadge = {
  low: 'bg-slate-50 text-slate-600 ring-slate-200',
  medium: 'bg-blue-50 text-blue-700 ring-blue-200',
  high: 'bg-violet-50 text-violet-700 ring-violet-200',
};

export function RiskAnalyzer({ orders, selectedOrder, onSelectOrder, onActionTaken, onBackToDashboard }: AnalyzerProps) {
  const [analysis, setAnalysis] = useState<RiskAssessment | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<SimOrder | null>(selectedOrder);
  const [actionTaken, setActionTaken] = useState(false);

  useEffect(() => {
    setCurrentOrder(selectedOrder);
    setAnalysis(null);
    setActionTaken(false);
  }, [selectedOrder]);

  const handleAnalyze = () => {
    if (!currentOrder) return;
    setAnalyzing(true);
    setAnalysis(null);
    setActionTaken(false);
    setTimeout(() => {
      setAnalysis(analyzeOrder(currentOrder));
      setAnalyzing(false);
    }, 1200);
  };

  const handleSelect = (order: SimOrder) => {
    setCurrentOrder(order);
    setAnalysis(null);
    setActionTaken(false);
  };

  const handleAction = () => {
    if (!currentOrder || !analysis) return;
    const actionType = getActionType(analysis);
    onActionTaken(currentOrder, actionType);
  };

  const liveOrder = orders.find(o => o.id === currentOrder?.id) ?? currentOrder;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Order Risk Analyzer</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          AI-powered decision-support prototype using simulated data and transparent risk logic — not a trained ML model.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order list */}
        <Card className="lg:col-span-1">
          <div className="border-b border-slate-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-900">Select an Order</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto p-2 lg:max-h-[600px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden">
            {orders.map((order) => {
              const active = currentOrder?.id === order.id;
              return (
                <button
                  key={order.id}
                  onClick={() => handleSelect(order)}
                  className={`flex w-44 flex-shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all lg:w-full ${
                    active ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium text-slate-700">{order.id}</span>
                      <RiskBadge level={order.riskLevel} />
                    </div>
                    <p className="mt-0.5 truncate text-xs text-slate-500">{order.store.split(' - ')[0]}</p>
                  </div>
                  <ChevronRight size={16} className={active ? 'text-blue-500' : 'text-slate-300'} />
                </button>
              );
            })}
          </div>
        </Card>

        {/* Order detail + analysis */}
        <div className="space-y-5 lg:col-span-2">
          {liveOrder ? (
            <>
              {/* Order details */}
              <Card className="p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-slate-900">{liveOrder.id}</span>
                    <RiskBadge level={liveOrder.riskLevel} />
                    <StatusBadge status={liveOrder.status} />
                  </div>
                  <button onClick={onBackToDashboard} className="inline-flex items-center gap-1 self-start text-xs font-medium text-slate-500 hover:text-slate-700 sm:self-auto">
                    <ArrowLeft size={14} /> Dashboard
                  </button>
                </div>
                <p className="mt-1 text-xs text-slate-500">{liveOrder.store} · {liveOrder.storeArea}</p>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Products */}
                  <div className="rounded-lg border border-slate-100 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Package size={16} className="text-blue-500" /> Products
                    </div>
                    <div className="space-y-2.5">
                      {liveOrder.products.map((p, i) => (
                        <div key={i} className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <span className="text-sm text-slate-800">{p.name}</span>
                            <span className="ml-1.5 text-xs text-slate-400">×{p.quantity}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${demandBadge[p.demand]}`}>
                              {p.demand} demand
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${availabilityBadge[p.available]}`}>
                              {p.available}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Store & Inventory */}
                  <div className="rounded-lg border border-slate-100 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Store size={16} className="text-violet-500" /> Store & Inventory
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Inventory last updated</span>
                        <span className={`font-medium ${liveOrder.inventoryLastUpdated >= 48 ? 'text-red-600' : liveOrder.inventoryLastUpdated >= 24 ? 'text-amber-600' : 'text-slate-700'}`}>
                          {liveOrder.inventoryLastUpdated}h ago
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Store area</span>
                        <span className="font-medium text-slate-700">{liveOrder.storeArea}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">High-demand item</span>
                        <span className="font-medium text-slate-700">{liveOrder.hasHighDemandItem ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery */}
                  <div className="rounded-lg border border-slate-100 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Clock size={16} className="text-cyan-500" /> Delivery Conditions
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Estimated delivery</span>
                        <span className="font-medium text-slate-700">{liveOrder.estimatedDelivery} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Current elapsed</span>
                        <span className={`font-medium ${liveOrder.currentDeliveryTime > liveOrder.estimatedDelivery ? 'text-red-600' : 'text-slate-700'}`}>
                          {liveOrder.currentDeliveryTime} min
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Distance</span>
                        <span className="font-medium text-slate-700">{liveOrder.distanceKm} km</span>
                      </div>
                    </div>
                  </div>

                  {/* Order info */}
                  <div className="rounded-lg border border-slate-100 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <ShoppingBag size={16} className="text-amber-500" /> Order Information
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Customer</span>
                        <span className="font-medium text-slate-700">{liveOrder.customer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Order time</span>
                        <span className="font-medium text-slate-700">{liveOrder.orderTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Items</span>
                        <span className="font-medium text-slate-700">{liveOrder.items}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {liveOrder.status !== 'Delivered' && liveOrder.status !== 'Cancelled' && (
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {analyzing ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap size={18} fill="currentColor" /> Analyze Order
                      </>
                    )}
                  </button>
                )}

                {liveOrder.status === 'Delivered' && (
                  <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-400">
                    <CheckCircle2 size={16} /> This order has been delivered — no further action needed.
                  </div>
                )}
              </Card>

              {/* Analysis result */}
              {analysis && (
                <>
                  <Card className={`overflow-hidden ${analysis.overallRisk === 'HIGH' ? 'ring-2 ring-red-200' : analysis.overallRisk === 'MEDIUM' ? 'ring-2 ring-amber-200' : 'ring-2 ring-emerald-200'}`}>
                    <div className={`px-5 py-4 ${analysis.overallRisk === 'HIGH' ? 'bg-red-50' : analysis.overallRisk === 'MEDIUM' ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${analysis.overallRisk === 'HIGH' ? 'bg-red-100 text-red-600' : analysis.overallRisk === 'MEDIUM' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          <ScanSearch size={22} />
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Overall Risk Assessment</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-lg font-bold ${analysis.overallRisk === 'HIGH' ? 'text-red-700' : analysis.overallRisk === 'MEDIUM' ? 'text-amber-700' : 'text-emerald-700'}`}>
                              {analysis.overallRisk}
                            </span>
                            <span className="text-sm text-slate-500">· {analysis.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 p-5">
                      <div>
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Explanation</p>
                        <p className="text-sm leading-relaxed text-slate-700">{analysis.explanation}</p>
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Risk Signals</p>
                        <div className="space-y-2">
                          {analysis.factors.map((f, i) => {
                            const cfg = severityConfig[f.severity];
                            return (
                              <div key={i} className="flex items-start gap-3 rounded-lg border border-slate-100 p-3">
                                <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md ring-1 ${cfg.color}`}>
                                  {cfg.icon}
                                </span>
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-medium text-slate-800">{f.label}</span>
                                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ring-1 ${cfg.color}`}>{cfg.label}</span>
                                  </div>
                                  <p className="mt-0.5 text-xs text-slate-500">{f.detail}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Recommendation + Action Taken */}
                  <Card className="overflow-hidden border-blue-200">
                    <div className="flex items-start gap-3 bg-blue-600 p-5 text-white">
                      <CheckCircle2 size={22} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-blue-100">Recommended Action</p>
                        <p className="mt-1 text-sm font-medium leading-relaxed">{analysis.recommendedAction}</p>
                      </div>
                    </div>
                    <div className="px-5 py-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Why This Recommendation</p>
                      <ul className="space-y-1.5">
                        {analysis.factors.filter(f => f.severity !== 'info').map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                            {f.detail}
                          </li>
                        ))}
                        {analysis.factors.filter(f => f.severity !== 'info').length === 0 && (
                          <li className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                            All factors are within acceptable range — routine monitoring is sufficient.
                          </li>
                        )}
                      </ul>

                      {actionTaken ? (
                        <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
                          <CheckCircle2 size={18} /> Action taken — returning to dashboard...
                        </div>
                      ) : (
                        <button
                          onClick={handleAction}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 sm:w-auto"
                        >
                          {getActionType(analysis) === 'request_confirmation' && (<><BellRing size={17} /> Request Stock Confirmation</>)}
                          {getActionType(analysis) === 'monitor_delivery' && (<><Clock size={17} /> Monitor Delivery Closely</>)}
                          {getActionType(analysis) === 'no_action' && (<><CheckCircle2 size={17} /> Confirm — No Action Needed</>)}
                          <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  </Card>
                </>
              )}
            </>
          ) : (
            <Card className="flex flex-col items-center justify-center p-16">
              <ScanSearch size={48} className="text-slate-300" />
              <p className="mt-4 text-sm font-medium text-slate-400">Select an order to begin analysis</p>
              <p className="mt-1 text-xs text-slate-400">Choose any order from the list on the left</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
