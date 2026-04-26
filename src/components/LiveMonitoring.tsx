import React, { useState, useEffect } from 'react';
import { Activity, X, Droplets, Zap, Clock, WashingMachine, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  onClose?: () => void;
};

type Machine = {
  id: number;
  status: 'active' | 'idle' | 'warning' | 'finish';
  progress: number;
  washTimeLeft: number;
  temp: number;
  rpm: number;
  vibration: number;
};

export function LiveMonitoring({ onClose }: Props) {
  const [machines, setMachines] = useState<Machine[]>([
    { id: 1, status: 'active', progress: 65, washTimeLeft: 12, temp: 40, rpm: 1200, vibration: 0.15 },
    { id: 2, status: 'idle', progress: 0, washTimeLeft: 0, temp: 22, rpm: 0, vibration: 0.01 },
    { id: 3, status: 'warning', progress: 85, washTimeLeft: 5, temp: 65, rpm: 1400, vibration: 0.85 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMachines(prev => prev.map(m => {
        if (m.status === 'idle') return m;
        const newProgress = Math.min(100, m.progress + Math.random() * 0.5);
        const newTime = Math.max(0, m.washTimeLeft - 0.1);
        return { 
          ...m, 
          progress: newProgress,
          washTimeLeft: Number(newTime.toFixed(1)),
          vibration: m.status === 'warning' ? 0.8 + Math.random() * 0.2 : 0.1 + Math.random() * 0.1
        };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const container = (
    <div className="bg-slate-900 rounded-[40px] overflow-hidden border border-slate-800 shadow-2xl max-w-4xl w-full mx-auto text-white">
      {/* Header */}
      <div className="px-8 py-6 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-2xl relative">
            <Activity className="w-6 h-6 text-blue-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Live Hub Telemetry</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              Refreshed 2s ago • 14 sensors active
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-3 hover:bg-slate-800 rounded-2xl transition-all">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        )}
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <motion.div
              layout
              key={machine.id}
              className={`p-6 rounded-[32px] border-2 transition-all overflow-hidden relative group ${
                machine.status === 'warning' ? 'border-red-500/30 bg-red-500/5' : 
                machine.status === 'idle' ? 'border-slate-800 bg-slate-800/30' : 
                'border-blue-500/30 bg-blue-500/5'
              }`}
            >
              {/* Backglow */}
              <div className={`absolute -right-12 -top-12 w-32 h-32 blur-3xl opacity-20 rounded-full ${
                machine.status === 'warning' ? 'bg-red-500' : 'bg-blue-500'
              }`}></div>

              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2.5">
                  <WashingMachine className={`w-5 h-5 ${
                    machine.status === 'warning' ? 'text-red-400' : 
                    machine.status === 'idle' ? 'text-slate-400' : 'text-blue-400'
                  }`} />
                  <span className="font-black text-sm uppercase tracking-widest">Machine {machine.id}</span>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                  machine.status === 'warning' ? 'bg-red-500 text-white' : 
                  machine.status === 'idle' ? 'bg-slate-700 text-slate-300' : 
                  'bg-blue-500 text-white'
                }`}>
                  {machine.status}
                </div>
              </div>

              {/* Progress Ring / Visual */}
              <div className="my-8 relative h-32 flex items-center justify-center">
                 <div className="relative w-28 h-28">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="50" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
                      <motion.circle 
                        cx="56" cy="56" r="50" fill="transparent" stroke="currentColor" strokeWidth="8" 
                        strokeDasharray={314}
                        strokeDashoffset={314 - (314 * machine.progress) / 100}
                        className={machine.status === 'warning' ? 'text-red-500' : 'text-blue-500'} 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black">{Math.floor(machine.progress)}%</span>
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Progress</span>
                    </div>
                 </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 relative z-10 pt-4 border-t border-slate-800/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 opacity-40">
                    <Clock className="w-3 h-3" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Est. Left</span>
                  </div>
                  <p className="text-xs font-black">{machine.washTimeLeft} min</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 opacity-40">
                    <Droplets className="w-3 h-3" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Water Temp</span>
                  </div>
                  <p className="text-xs font-black">{machine.temp}°C</p>
                </div>
              </div>

              {machine.status === 'warning' && (
                <div className="mt-4 p-3 bg-red-500/20 rounded-xl flex items-center gap-3 border border-red-500/30">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-[10px] font-bold text-red-300 tracking-tight leading-tight">High Vibration Detected. Auto-throttling RPM.</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Global Hub Stats */}
        <div className="bg-slate-800/30 rounded-[32px] p-8 border border-slate-800">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <p className="text-2xl font-black">2.4 <span className="text-sm font-medium text-slate-500">kW</span></p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Current Power</p>
              </div>
              <div className="space-y-2">
                <Droplets className="w-5 h-5 text-blue-400" />
                <p className="text-2xl font-black">450 <span className="text-sm font-medium text-slate-500">L</span></p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Daily Water Usage</p>
              </div>
              <div className="space-y-2">
                <Activity className="w-5 h-5 text-green-400" />
                <p className="text-2xl font-black">99.2 <span className="text-sm font-medium text-slate-500">%</span></p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Uptime Score</p>
              </div>
              <div className="space-y-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <p className="text-2xl font-black">128 <span className="text-sm font-medium text-slate-500">hrs</span></p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Maint. Countdown</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  if (onClose) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/60 backdrop-blur-md">
        {container}
      </div>
    );
  }

  return container;
}
