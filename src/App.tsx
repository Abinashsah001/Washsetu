import { useState, useMemo } from 'react';
import { Calendar, ChevronRight, Bell, Sparkles, WashingMachine, Activity, Leaf, Database } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { ClothesSelection } from '@/components/ClothesSelection';
import { Payment } from '@/components/Payment';
import { BookingSuccess } from '@/components/BookingSuccess';
import { SystemArchitecture } from '@/components/SystemArchitecture';
import { LiveMonitoring } from '@/components/LiveMonitoring';
import { EcoTracker } from '@/components/EcoTracker';
import { LoginSystem } from '@/components/LoginSystem';
import { AdminDashboard } from '@/components/AdminDashboard';

type WashType = 'quick' | 'normal' | 'heavy';
type Step = 'booking' | 'clothes' | 'payment' | 'otp' | 'success';
import { OTPVerification } from '@/components/OTPVerification';

type MachineStatus = 'available' | 'finishing' | 'in-use';

type ClothingItem = {
  id: string;
  name: string;
  price: number;
  icon: string;
  count: number;
  weight: number;
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'customer' | 'admin' | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [step, setStep] = useState<Step>('booking');
  const [washType, setWashType] = useState<WashType>('normal');
  const [selectedMachine, setSelectedMachine] = useState(1);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [weight, setWeight] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);


  const [showArchitecture, setShowArchitecture] = useState(false);
  const [showMonitoring, setShowMonitoring] = useState(false);
  const [showEcoTracker, setShowEcoTracker] = useState(false);

  const washTypes = {
    quick: { label: 'Quick Wash', duration: '15 min', interval: 15, icon: '⏱' },
    normal: { label: 'Normal Wash', duration: '30 min', interval: 30, icon: '🌀' },
    heavy: { label: 'Heavy Duty', duration: '45 min', interval: 45, icon: '💪' },
  };

  const getMachineStatus = (machine: number): MachineStatus => {
    const statuses: MachineStatus[] = ['available', 'finishing', 'in-use'];
    return statuses[(machine - 1) % 3];
  };

  const getStatusColor = (status: MachineStatus) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'finishing': return 'bg-amber-500';
      case 'in-use': return 'bg-red-500';
    }
  };

  const weekDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[date.getDay()],
        date: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' }),
        index: i,
      });
    }
    return dates;
  }, []);

  const recommendedSlot = useMemo(() => {
    const currentHour = new Date().getHours();
    if (selectedDate === 0 && currentHour >= 16) return null;
    return '16:30';
  }, [selectedDate]);

  const generateTimeSlots = (interval: number) => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let min = 0; min < 60; min += interval) {
        slots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
      }
    }
    slots.push('20:00');
    return slots;
  };

  const timeSlots = generateTimeSlots(washTypes[washType].interval);

  const bookedSlots = useMemo(() => {
    const seed = selectedMachine * 1000 + selectedDate * 100 + (washType === 'quick' ? 1 : washType === 'normal' ? 2 : 3);
    const num = (seed % 5) + 3;
    const slots: string[] = [];
    for (let i = 0; i < num; i++) {
       const idx = (seed * (i + 7)) % timeSlots.length;
       slots.push(timeSlots[idx]);
    }
    return slots;
  }, [selectedMachine, selectedDate, washType, timeSlots]);

  const handleConfirmBooking = () => {
    if (selectedSlot) setStep('clothes');
  };

  const handleClothesNext = (items: ClothingItem[], weightKg: number, total: number) => {
    setClothingItems(items);
    setWeight(weightKg);
    setTotalAmount(total);
    setStep('payment');
  };

  const handleOTPVerify = async () => {
    try {
      // Persist booking to backend
      const response = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machineId: selectedMachine,
          washType: washTypes[washType].label,
          date: weekDates[selectedDate].dayName,
          timeSlot: selectedSlot,
          amount: totalAmount,
        })
      });

      if (!response.ok) throw new Error('Booking persistence failed');
      
      setStep('success');
    } catch (err) {
      console.error(err);
      // Fallback: still show success for demo if server is down
      setStep('success');
    }
  };

  const handlePaymentSuccess = () => setStep('otp');

  const handleNewBooking = () => {
    setStep('booking');
    setSelectedSlot(null);
    setClothingItems([]);
    setWeight(0);
    setTotalAmount(0);
  };

  const handleLoginSuccess = (result: { success: boolean; role: 'customer' | 'admin'; name: string }) => {
    setIsAuthenticated(true);
    setUserRole(result.role);
    setDisplayName(result.name);
    if (result.role === 'customer') {
      setStep('booking');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setDisplayName('');
    setStep('booking');
    setSelectedSlot(null);
    setClothingItems([]);
    setWeight(0);
    setTotalAmount(0);
  };

  if (!isAuthenticated) {
    return <LoginSystem onLoginSuccess={handleLoginSuccess} />;
  }

  if (userRole === 'admin') {
    return <AdminDashboard adminName={displayName || 'Admin'} onLogout={handleLogout} />;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col font-sans max-w-md mx-auto relative overflow-hidden shadow-2xl">
      {/* Modals */}
      <AnimatePresence>
        {showArchitecture && <SystemArchitecture onClose={() => setShowArchitecture(false)} />}
        {showMonitoring && <LiveMonitoring onClose={() => setShowMonitoring(false)} />}
        {showEcoTracker && <EcoTracker onClose={() => setShowEcoTracker(false)} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 'booking' && (
          <motion.div
            key="booking"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Premium Header */}
            <header className="bg-white px-6 pt-8 pb-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
                    WashSetu
                  </h1>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Book slots. Skip queues.</p>
                </div>
                <button className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors relative">
                  <Bell className="w-6 h-6 text-gray-900" />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-2 px-2">
                 <button onClick={() => setShowMonitoring(true)} className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl font-bold text-xs hover:bg-blue-100 transition-colors">
                   <Activity className="w-3.5 h-3.5" />
                   Live
                 </button>
                 <button onClick={() => setShowEcoTracker(true)} className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-colors">
                   <Leaf className="w-3.5 h-3.5" />
                   Eco
                 </button>
                 <button onClick={() => setShowArchitecture(true)} className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 rounded-xl font-bold text-xs hover:bg-purple-100 transition-colors">
                   <Database className="w-3.5 h-3.5" />
                   System
                 </button>
              </div>
            </header>

            {/* Content Body */}
            <main className="flex-1 overflow-y-auto pb-32">
              {/* Wash Type Selection */}
              <section className="p-6">
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Select Intensity</h2>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {(['quick', 'normal', 'heavy'] as WashType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => { setWashType(type); setSelectedSlot(null); }}
                      className={`flex-shrink-0 p-5 rounded-[28px] border-2 transition-all w-[140px] ${
                        washType === type ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-100 scale-105' : 'bg-white border-white'
                      }`}
                    >
                      <span className={`text-3xl block mb-2`}>{washTypes[type].icon}</span>
                      <p className={`text-sm font-black block ${washType === type ? 'text-white' : 'text-gray-900'}`}>{washTypes[type].label}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${washType === type ? 'text-blue-100' : 'text-gray-400'}`}>{washTypes[type].duration}</p>
                    </button>
                  ))}
                </div>
              </section>

              {/* Machine Selection */}
              <section className="px-6 py-2">
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Choose Hub</h2>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((machine) => {
                    const status = getMachineStatus(machine);
                    const isSelected = selectedMachine === machine;
                    return (
                      <button
                        key={machine}
                        onClick={() => { setSelectedMachine(machine); setSelectedSlot(null); }}
                        className={`p-4 rounded-3xl border-2 transition-all relative overflow-hidden ${
                          isSelected ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-100' : 'bg-white border-white'
                        }`}
                      >
                        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${getStatusColor(status)} ring-2 ${isSelected ? 'ring-blue-600' : 'ring-white'}`}></div>
                        <WashingMachine className={`w-6 h-6 mb-2 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                        <p className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-white' : 'text-gray-900'}`}>M-{machine}</p>
                        <p className={`text-[8px] font-bold uppercase truncate ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>{status}</p>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Date Selection */}
              <section className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Select Date</h2>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 bg-white px-3 py-1.5 rounded-full shadow-sm">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    Apr 2026
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {weekDates.map((date) => (
                    <button
                      key={date.index}
                      onClick={() => { setSelectedDate(date.index); setSelectedSlot(null); }}
                      className={`flex-shrink-0 w-[72px] h-[92px] rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                        selectedDate === date.index ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-100 text-white' : 'bg-white border-white'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">{date.dayName}</span>
                      <span className="text-xl font-black">{date.date}</span>
                      <span className="text-[9px] font-bold uppercase">{date.month}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Slots */}
              <section className="px-6 py-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Ready Slots</h2>
                  {recommendedSlot && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 animate-bounce-subtle">
                      <Sparkles className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">AI Pick: {recommendedSlot}</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.slice(0, 16).map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    const isSelected = selectedSlot === slot;
                    const isRecommended = slot === recommendedSlot;
                    return (
                      <button
                        key={slot}
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 rounded-2xl font-black text-[11px] transition-all relative overflow-hidden ${
                          isSelected ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' :
                          isBooked ? 'bg-gray-100 text-gray-300 cursor-not-allowed opacity-50' :
                          isRecommended ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200' :
                          'bg-white text-gray-900 border-2 border-white'
                        }`}
                      >
                         {slot}
                         {isRecommended && !isSelected && !isBooked && (
                           <span className="absolute top-1 right-1 w-1 h-1 bg-emerald-500 rounded-full"></span>
                         )}
                      </button>
                    );
                  })}
                </div>
              </section>
            </main>

            {/* Floating Navigation */}
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <div className="p-4 bg-white/80 backdrop-blur-2xl rounded-3xl border border-white shadow-2xl flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Slot</p>
                   <p className="text-sm font-black text-gray-900">{selectedSlot ? `${weekDates[selectedDate].dayName} • ${selectedSlot}` : 'Select a time'}</p>
                </div>
                <button
                  disabled={!selectedSlot}
                  onClick={handleConfirmBooking}
                  className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all ${
                    selectedSlot ? 'bg-blue-600 text-white shadow-lg active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'clothes' && (
          <motion.div key="clothes" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex-1">
             <ClothesSelection onBack={() => setStep('booking')} onNext={handleClothesNext} />
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex-1">
             <Payment 
                amount={totalAmount} 
                onBack={() => setStep('clothes')} 
                onSuccess={() => setStep('otp')}
                bookingDetails={{
                  machine: selectedMachine,
                  washType: washTypes[washType].label,
                  date: weekDates[selectedDate].dayName,
                  time: selectedSlot || '',
                }}
             />
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex-1">
             <OTPVerification 
                onVerify={handleOTPVerify} 
                onBack={() => setStep('payment')} 
             />
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1">
             <BookingSuccess 
                amount={totalAmount} 
                onNewBooking={handleNewBooking}
                bookingDetails={{
                  machine: selectedMachine,
                  washType: washTypes[washType].label,
                  date: weekDates[selectedDate].dayName,
                  time: selectedSlot || '',
                }}
             />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-1 left-0 right-0 z-10 text-center pointer-events-none">
        <p className="text-[10px] font-semibold text-gray-400">made by Niraj and Abinash</p>
      </div>
    </div>
  );
}
