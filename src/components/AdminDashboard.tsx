import { LogOut, Users, CalendarClock, ShieldCheck, AlertTriangle } from 'lucide-react';

type Props = {
  adminName: string;
  onLogout: () => void;
};

export function AdminDashboard({ adminName, onLogout }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto space-y-4">
        <header className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Admin Panel</p>
          <h1 className="text-2xl font-black text-gray-900 mt-2">Welcome, {adminName}</h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">Manage vendors, bookings, and incidents.</p>
        </header>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <Users className="w-5 h-5 text-blue-600" />
            <p className="text-xs font-bold text-gray-400 mt-2">Active Vendors</p>
            <p className="text-xl font-black text-gray-900">18</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <CalendarClock className="w-5 h-5 text-emerald-600" />
            <p className="text-xs font-bold text-gray-400 mt-2">Today Bookings</p>
            <p className="text-xl font-black text-gray-900">146</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <p className="text-xs font-bold text-gray-400 mt-2">Resolved Cases</p>
            <p className="text-xl font-black text-gray-900">27</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <p className="text-xs font-bold text-gray-400 mt-2">Open Incidents</p>
            <p className="text-xl font-black text-gray-900">3</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full py-3.5 bg-gray-900 text-white rounded-2xl font-black flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>

        <p className="text-center text-[11px] font-semibold text-gray-400 pt-2">made by Niraj and Abinash</p>
      </div>
    </div>
  );
}
