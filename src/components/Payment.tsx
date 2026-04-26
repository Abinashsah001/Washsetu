import { useState } from 'react';
import { ChevronLeft, CreditCard, Apple, Smartphone, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type PaymentProps = {
  amount: number;
  bookingDetails: {
    machine: number;
    washType: string;
    date: string;
    time: string;
  };
  onBack: () => void;
  onSuccess: () => void;
};

export function Payment({ amount, bookingDetails, onBack, onSuccess }: PaymentProps) {
  const [method, setMethod] = useState<'upi' | 'card' | 'apple'>('upi');
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="px-5 py-6 bg-white border-b border-gray-100 flex items-center gap-4">
        <button onClick={onBack} disabled={processing} className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95 disabled:opacity-50">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
          <p className="text-xs text-gray-500 font-medium">Finalize your booking</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {/* Booking Summary Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full -z-0"></div>
          <div className="relative z-10">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Machine & Wash</span>
                <span className="text-gray-900 font-bold">M-{bookingDetails.machine} • {bookingDetails.washType}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Date & Time</span>
                <span className="text-gray-900 font-bold">{bookingDetails.date}, {bookingDetails.time}</span>
              </div>
              <div className="h-px bg-dashed border-t-2 border-dashed border-gray-100 my-4"></div>
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">Total Payable</span>
                <span className="text-2xl font-black text-blue-600">₹{amount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 mb-4 px-1">Payment Method</h3>
          
          <button
            onClick={() => setMethod('upi')}
            disabled={processing}
            className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
              method === 'upi' ? 'border-blue-500 bg-blue-50 shadow-md scale-102' : 'border-white bg-white hover:border-gray-200'
            }`}
          >
            <div className={`p-2 rounded-xl ${method === 'upi' ? 'bg-blue-600' : 'bg-gray-100'}`}>
              <Smartphone className={`w-6 h-6 ${method === 'upi' ? 'text-white' : 'text-gray-500'}`} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-gray-900">UPI / GPay / PhonePe</p>
              <p className="text-xs text-gray-500 font-medium tracking-tight">Instant & Secure Payment</p>
            </div>
            {method === 'upi' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
          </button>

          <button
            onClick={() => setMethod('card')}
            disabled={processing}
            className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
              method === 'card' ? 'border-blue-500 bg-blue-50 shadow-md scale-102' : 'border-white bg-white hover:border-gray-200'
            }`}
          >
            <div className={`p-2 rounded-xl ${method === 'card' ? 'bg-blue-600' : 'bg-gray-100'}`}>
              <CreditCard className={`w-6 h-6 ${method === 'card' ? 'text-white' : 'text-gray-500'}`} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-gray-900">Debit / Credit Card</p>
              <p className="text-xs text-gray-500 font-medium tracking-tight">Save card for future wash</p>
            </div>
            {method === 'card' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
          </button>

          <button
            onClick={() => setMethod('apple')}
            disabled={processing}
            className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
              method === 'apple' ? 'border-blue-500 bg-blue-50 shadow-md scale-102' : 'border-white bg-white hover:border-gray-200'
            }`}
          >
            <div className={`p-2 rounded-xl ${method === 'apple' ? 'bg-blue-600' : 'bg-gray-100'}`}>
              <Apple className={`w-6 h-6 ${method === 'apple' ? 'text-white' : 'text-gray-500'}`} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-gray-900">Apple Pay</p>
              <p className="text-xs text-gray-500 font-medium tracking-tight">Fastest checkout on iOS</p>
            </div>
            {method === 'apple' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
          </button>
        </div>

        {/* Security Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted Secure Checkout</span>
        </div>
      </div>

      {/* Pay Button */}
      <div className="p-5 bg-white border-t border-gray-100">
        <button
          onClick={handlePay}
          disabled={processing}
          className={`
            w-full h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all relative overflow-hidden
            ${processing ? 'bg-gray-900 cursor-wait' : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl shadow-blue-200 active:scale-95'}
          `}
        >
          <AnimatePresence mode="wait">
            {processing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 text-white"
              >
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Initializing...
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                Confirm & Pay ₹{amount}
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
