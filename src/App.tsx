import { useState, useCallback } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar, type Page } from '@/components/Sidebar';
import { Dashboard } from '@/screens/Dashboard';
import { RiskAnalyzer } from '@/screens/RiskAnalyzer';
import { StoreAlerts } from '@/screens/StoreAlerts';
import { BusinessImpact } from '@/screens/BusinessImpact';
import { About } from '@/screens/About';
import { getInitialOrders, getInitialAlerts, analyzeOrder, getActionType } from '@/data/simData';
import type { SimOrder, StoreAlert, ActionType } from '@/types';

function App() {
  const [orders, setOrders] = useState<SimOrder[]>(() => getInitialOrders());
  const [alerts, setAlerts] = useState<StoreAlert[]>(() => {
    const initialOrders = getInitialOrders();
    return getInitialAlerts(initialOrders);
  });
  const [page, setPage] = useState<Page>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<SimOrder | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingAlertCount = alerts.filter(a => a.status === 'Pending').length;

  const handleNavigate = useCallback((p: Page) => {
    setPage(p);
    setMobileMenuOpen(false);
  }, []);

  const handleAnalyzeOrder = useCallback((order: SimOrder) => {
    setSelectedOrder(order);
    setPage('analyzer');
    setMobileMenuOpen(false);
  }, []);

  const handleSelectOrder = useCallback((order: SimOrder) => {
    setSelectedOrder(order);
  }, []);

  // Action Taken from Risk Analyzer
  const handleActionTaken = useCallback((order: SimOrder, action: ActionType) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== order.id) return o;
      const updated = { ...o };

      if (action === 'request_confirmation') {
        updated.status = 'Confirmation Requested';
        // Also update the corresponding alert to reflect the request was sent
        setAlerts(prevA => prevA.map(a =>
          a.orderId === order.id ? { ...a, status: 'Pending' as const } : a
        ));
      } else if (action === 'monitor_delivery') {
        updated.status = 'Monitoring';
      }
      // no_action: no status change

      return updated;
    }));

    // Return to dashboard after action
    setPage('dashboard');
    setMobileMenuOpen(false);
  }, []);

  // Resolve alert from Store Alerts screen
  const handleResolveAlert = useCallback((alertId: string, status: 'Resolved' | 'Unavailable') => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status } : a));

    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      setOrders(prev => prev.map(o => {
        if (o.id !== alert.orderId) return o;

        const updatedProducts = o.products.map(p =>
          p.name === alert.product
            ? { ...p, available: (status === 'Resolved' ? 'yes' : 'no') as 'yes' | 'no' }
            : p
        );

        const updatedOrder: SimOrder = { ...o, products: updatedProducts };
        const assessment = analyzeOrder(updatedOrder);
        updatedOrder.riskLevel = assessment.overallRisk;
        updatedOrder.mainRisk = assessment.category;
        updatedOrder.recommendedAction = assessment.recommendedAction;

        if (status === 'Resolved') {
          updatedOrder.status = 'Confirmed';
        } else if (status === 'Unavailable') {
          updatedOrder.status = 'Pending';
        }

        return updatedOrder;
      }));
    }
  }, [alerts]);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      <Sidebar
        current={page}
        onNavigate={handleNavigate}
        alertCount={pendingAlertCount}
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white">
              <span className="text-xs font-bold">N</span>
            </div>
            <span className="text-sm font-bold text-slate-900">NOVA FLOW</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
            {page === 'dashboard' && <Dashboard orders={orders} onAnalyzeOrder={handleAnalyzeOrder} />}
            {page === 'analyzer' && (
              <RiskAnalyzer
                orders={orders}
                selectedOrder={selectedOrder}
                onSelectOrder={handleSelectOrder}
                onActionTaken={handleActionTaken}
                onBackToDashboard={() => handleNavigate('dashboard')}
              />
            )}
            {page === 'alerts' && (
              <StoreAlerts
                alerts={alerts}
                orders={orders}
                onResolveAlert={handleResolveAlert}
                onAnalyzeOrder={handleAnalyzeOrder}
              />
            )}
            {page === 'impact' && <BusinessImpact />}
            {page === 'about' && <About onGoToDashboard={() => handleNavigate('dashboard')} />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
