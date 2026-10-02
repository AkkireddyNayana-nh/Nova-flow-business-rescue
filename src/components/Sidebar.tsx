import { LayoutDashboard, ScanSearch, BellRing, TrendingUp, Info, Zap, X } from 'lucide-react';

export type Page = 'dashboard' | 'analyzer' | 'alerts' | 'impact' | 'about';

interface SidebarProps {
  current: Page;
  onNavigate: (p: Page) => void;
  alertCount: number;
  mobileOpen: boolean;
  onClose: () => void;
}

const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { page: 'analyzer', label: 'Risk Analyzer', icon: <ScanSearch size={20} /> },
  { page: 'alerts', label: 'Store Alerts', icon: <BellRing size={20} /> },
  { page: 'impact', label: 'Business Impact', icon: <TrendingUp size={20} /> },
  { page: 'about', label: 'About', icon: <Info size={20} /> },
];

export function Sidebar({ current, onNavigate, alertCount, mobileOpen, onClose }: SidebarProps) {
  const handleNavigate = (p: Page) => {
    onNavigate(p);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar — fixed drawer on mobile, static on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 lg:w-60 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-slate-900">NOVA</p>
              <p className="text-xs leading-tight text-slate-500">Predict. Prevent. Deliver.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-2 flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const active = current === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNavigate(item.page)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={active ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.page === 'alerts' && alertCount > 0 && (
                  <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{alertCount}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 px-5 py-4">
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Prototype</p>
          <p className="mt-0.5 text-xs text-slate-500">Simulated Demo Data</p>
        </div>
      </aside>
    </>
  );
}
