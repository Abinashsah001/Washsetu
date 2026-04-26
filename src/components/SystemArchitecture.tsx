import React from 'react';
import { Database, Server, Smartphone, Cpu, Cloud, Shield, Activity, X } from 'lucide-react';
import { motion } from 'framer-motion';

type Props = {
  onClose?: () => void;
};

export function SystemArchitecture({ onClose }: Props) {
  const layers = [
    { 
      name: 'User Interface', 
      icon: Smartphone, 
      color: 'blue', 
      tech: ['React 19', 'Vite 8', 'Tailwind 4'],
      desc: 'Modern reactive frontend with micro-animations and adaptive layout.' 
    },
    { 
      name: 'API Gateway', 
      icon: Cloud, 
      color: 'purple', 
      tech: ['Next.js Edge', 'Clerk Auth', 'TRPC'],
      desc: 'Secure authentication layer with edge-optimized data fetching.' 
    },
    { 
      name: 'Business Logic', 
      icon: Server, 
      color: 'indigo', 
      tech: ['Node.js', 'Prisma', 'Redis'],
      desc: 'Core booking engine with real-time availability tracking.' 
    },
    { 
      name: 'AI Hub', 
      icon: Cpu, 
      color: 'emerald', 
      tech: ['TensorFlow.js', 'Custom ML Model'],
      desc: 'Self-learning algorithms for slot prediction and energy optimization.' 
    },
    { 
      name: 'Persistence', 
      icon: Database, 
      color: 'amber', 
      tech: ['PostgreSQL', 'S3 Storage'],
      desc: 'Highly available database for user data and wash history.' 
    },
  ];

  const container = (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl max-w-2xl w-full mx-auto">
      {/* Modal Header if onClose exists */}
      {onClose && (
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            Core Stack Blueprint
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors active:scale-95">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}
      
      <div className="p-6 md:p-8">
        <div className="relative space-y-4">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[2.4rem] top-8 bottom-8 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-amber-200 rounded-full opacity-50 z-0"></div>
          
          {layers.map((layer, idx) => (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              key={layer.name}
              className="flex gap-6 relative z-10"
            >
              <div className={`p-4 rounded-2xl bg-${layer.color}-100 flex-shrink-0 shadow-sm flex items-center justify-center`}>
                <layer.icon className={`w-8 h-8 text-${layer.color}-600`} />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-lg font-black text-gray-900">{layer.name}</h3>
                  <div className="flex gap-1.5">
                    {layer.tech.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-gray-100 text-[9px] font-black text-gray-500 rounded uppercase tracking-tighter">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed max-w-md font-medium">{layer.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-xs font-bold text-gray-500">GDPR Compliant & SSL Secured</span>
          </div>
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden ring-1 ring-gray-100">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="avatar" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (onClose) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-gray-900/40 backdrop-blur-md">
        {container}
      </div>
    );
  }

  return container;
}
