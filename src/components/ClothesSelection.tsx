import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Minus, Info } from 'lucide-react';
import { motion } from 'framer-motion';

type ClothingItem = {
  id: string;
  name: string;
  price: number;
  icon: string;
  count: number;
  weight: number; // in kg
};

type Props = {
  onNext: (items: ClothingItem[], weightKg: number, total: number) => void;
  onBack: () => void;
};

const ITEMS: ClothingItem[] = [
  { id: '1', name: 'T-Shirts', price: 10, icon: '👕', count: 0, weight: 0.2 },
  { id: '2', name: 'Jeans', price: 25, icon: '👖', count: 0, weight: 0.6 },
  { id: '3', name: 'Hoodies', price: 30, icon: '🧥', count: 0, weight: 0.5 },
  { id: '4', name: 'Bedsheets', price: 50, icon: '🛏️', count: 0, weight: 1.2 },
  { id: '5', name: 'Towels', price: 15, icon: '🧖', count: 0, weight: 0.4 },
  { id: '6', name: 'Socks (Pair)', price: 5, icon: '🧦', count: 0, weight: 0.1 },
];

export function ClothesSelection({ onNext, onBack }: Props) {
  const [items, setItems] = useState<ClothingItem[]>(ITEMS);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const weight = items.reduce((acc, item) => acc + item.count * item.weight, 0);
    const price = items.reduce((acc, item) => acc + item.count * item.price, 0);
    setTotalWeight(Number(weight.toFixed(1)));
    setTotalPrice(price);
  }, [items]);

  const updateCount = (id: string, delta: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, count: Math.max(0, item.count + delta) } : item
    ));
  };

  const isAnySelected = items.some(i => i.count > 0);

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-5 py-6 bg-white border-b border-gray-100 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Add Your Clothes</h1>
          <p className="text-xs text-gray-500 font-medium">Select items to calculate weight & price</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 pb-32">
        {/* Weight Alert */}
        <div className={`mb-6 p-4 rounded-2xl border-2 transition-all ${
          totalWeight > 8 ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-100'
        }`}>
          <div className="flex gap-3">
            <div className={`p-2 rounded-xl h-fit ${totalWeight > 8 ? 'bg-red-100' : 'bg-blue-100'}`}>
              <Info className={`w-5 h-5 ${totalWeight > 8 ? 'text-red-600' : 'text-blue-600'}`} />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${totalWeight > 8 ? 'text-red-900' : 'text-blue-900'}`}>
                {totalWeight > 8 ? 'Overload Warning' : 'Weight Capacity'}
              </h3>
              <p className={`text-xs mt-1 ${totalWeight > 8 ? 'text-red-700' : 'text-blue-700'}`}>
                {totalWeight > 8 
                  ? 'Your clothes exceed the machine limit (8kg). Please remove some items.'
                  : 'Current load is ' + totalWeight + 'kg. Recommended max is 8kg per wash.'}
              </p>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <motion.div
              layout
              key={item.id}
              className={`p-4 rounded-2xl border-2 transition-all ${
                item.count > 0 ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 bg-white'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <span className="text-4xl">{item.icon}</span>
                <div className="text-center">
                  <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                  <p className="text-[10px] font-medium text-gray-500">₹{item.price} • {item.weight}kg</p>
                </div>
                
                <div className="flex items-center gap-4 bg-white shadow-sm border border-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => updateCount(item.id, -1)}
                    className="p-1.5 hover:bg-gray-50 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{item.count}</span>
                  <button
                    onClick={() => updateCount(item.id, 1)}
                    className="p-1.5 hover:bg-gray-50 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl safe-bottom">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Weight</span>
              <span className={`text-lg font-black ${totalWeight > 8 ? 'text-red-600' : 'text-gray-900'}`}>
                {totalWeight} kg <span className="text-sm font-medium text-gray-400">/ 8kg</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Estimated Price</span>
              <div className="text-2xl font-black text-blue-600">₹{totalPrice}</div>
            </div>
          </div>
          
          <button
            onClick={() => onNext(items, totalWeight, totalPrice)}
            disabled={!isAnySelected || totalWeight > 8}
            className={`
              w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all
              ${isAnySelected && totalWeight <= 8
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Review & Pay
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
