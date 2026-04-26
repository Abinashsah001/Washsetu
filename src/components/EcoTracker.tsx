import React from 'react';
import { Leaf, Droplets, Zap, TreePine, X, TrendingUp, Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

type Props = {
  onClose?: () => void;
};

export function EcoTracker({ onClose }: Props) {
  const stats = [
    { 
      label: 'Water Saved', 
      value: '2.4k', 
      unit: 'Liters', 
      icon: Droplets, 
      color: 'blue', 
      desc: 'Equivalent to 12 bathtub fulls', 
      progress: 75 
    },
    { 
      label: 'Energy Reduced', 
      value: '45.2', 
      unit: 'kWh', 
      icon: Zap, 
      color: 'yellow', 
      desc: 'Enough to power a home for 3 days', 
      progress: 62 
    },
    { 
      label: 'Carbon Offset', 
      value: '12', 
      unit: 'kg CO2', 
      icon: Leaf, 
      color: 'green', 
      desc: 'Planting 2 imaginary trees per month', 
      progress: 88 
    },
  ];

  const badges = [
    { name: 'Eco Warrior', icon: Award, color: 'blue-500' },
    { name: 'Power Saver', icon: Zap, color: 'yellow-500' },
    { name: 'Water Guard', icon: Droplets, color: 'emerald-500' },
    { name: 'Green Titan', icon: TreePine, color: 'green-500' },
  ];

  const container = (
    <div className="bg-emerald-50 rounded-[40px] overflow-hidden border border-emerald-100 shadow-2xl max-w-2xl w-full mx-auto">
      {/* Header */}
      <div className="px-8 py-8 bg-gradient-to-br from-emerald-600 to-green-700 text-white relative">
        <div className="absolute top-0 right-0 p-12 opacity-10 blur-xl bg-white rounded-full translate-x-12 -translate-y-12"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-[24px]">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Eco-Impact Dashboard</h2>
              <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest flex items-center gap-2">
                Level 4 Sustainability Maven <Sparkles className="w-3 h-3" />
              </p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
              <X className="w-6 h-6 text-white" />
            </button>
          )}
        </div>

        {/* Global Impact Summary */}
        <div className="mt-8 flex items-end gap-2">
          <span className="text-5xl font-black">8.4k</span>
          <div className="mb-1.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100/60 leading-none mb-1">Lifetime</p>
            <p className="text-sm font-black uppercase tracking-widest text-emerald-100 leading-none">Green Points Earned</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Core Stats */}
        <div className="grid grid-cols-1 gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={stat.label}
              className="p-5 bg-white rounded-[28px] border border-emerald-100 shadow-sm flex items-center gap-6 group hover:shadow-md hover:border-emerald-200 transition-all cursor-default"
            >
              <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</h3>
                    <p className="text-2xl font-black text-gray-900">{stat.value} <span className="text-xs font-medium text-gray-500 uppercase">{stat.unit}</span></p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                {/* Progress Bar */}
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.progress}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className={`h-full bg-emerald-500 rounded-full`}
                  />
                </div>
                <p className="mt-2 text-[10px] font-medium text-emerald-600/80">{stat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Badges Section */}
        <div className="pt-4">
           <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-1">Unlocked Milestones</h3>
           <div className="grid grid-cols-4 gap-4">
              {badges.map((badge, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 group">
                  <div className={`w-14 h-14 rounded-full bg-white border-2 border-emerald-100 flex items-center justify-center p-3 shadow-sm group-hover:bg-emerald-50 transition-colors`}>
                    <badge.icon className={`w-full h-full text-${badge.color}`} />
                  </div>
                  <span className="text-[8px] font-black text-gray-500 text-center uppercase tracking-tighter leading-tight">{badge.name}</span>
                </div>
              ))}
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
