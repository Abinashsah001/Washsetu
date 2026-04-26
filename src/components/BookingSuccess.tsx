import React, { useEffect, useState } from 'react';
import { CheckCircle, Share2, Download, Home, Sparkles, MapPin, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  bookingDetails: {
    machine: number;
    washType: string;
    date: string;
    time: string;
  };
  amount: number;
  onNewBooking: () => void;
};

export function BookingSuccess({ bookingDetails, amount, onNewBooking }: Props) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: 'WashSetu Booking',
      text: `Booked my wash slot! Machine: ${bookingDetails.machine}, Type: ${bookingDetails.washType}, Time: ${bookingDetails.time}.`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} Check it out here: ${shareData.url}`);
        alert('Booking details copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed: ', err);
    }
  };

  const handleDownload = () => {
      // Mocking a PDF download logic
      alert('Generating PDF Receipt...');
      setTimeout(() => alert('Receipt downloaded successfully!'), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Confetti Micro-animations */}
      <AnimatePresence>
        {showConfetti && Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              top: '-10%', 
              left: `${Math.random() * 100}%`,
              scale: Math.random() * 0.5 + 0.5,
              rotate: 0,
              opacity: 1
            }}
            animate={{ 
              top: '120%', 
              left: `${Math.random() * 100}%`,
              rotate: 360,
              opacity: 0
            }}
            transition={{ 
              duration: Math.random() * 2 + 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className={`absolute w-3 h-3 rounded-sm ${['bg-yellow-400', 'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-pink-400'][i % 5]} z-0 pointer-events-none`}
          />
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl relative z-10"
      >
        {/* Top Gradient Bar */}
        <div className="h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>

        <div className="p-8 flex flex-col items-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>

          <h1 className="text-2xl font-black text-gray-900 mb-1">Wash Confirmed!</h1>
          <p className="text-sm font-bold text-gray-500 text-center mb-8">
            Your slot at Machine {bookingDetails.machine} is secured.
          </p>

          <div className="w-full bg-gray-50 rounded-2xl p-5 mb-8">
            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest text-center mb-4 pb-4 border-b border-gray-100 border-dashed">
                Booking Reference: WS-82{Math.floor(Math.random()*1000)}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Date & Day</p>
                  <p className="text-sm font-bold text-gray-800 tracking-tight leading-none">{bookingDetails.date}, 05 Apr 2026</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Timing</p>
                  <p className="text-sm font-bold text-gray-800 tracking-tight leading-none">{bookingDetails.time} Onwards</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Laundry Hub</p>
                  <p className="text-sm font-bold text-gray-800 tracking-tight leading-none">Hub Section 2B, Floor 2</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 border-dashed flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total Paid</p>
                  <p className="text-2xl font-black text-blue-600 leading-none">₹{amount}</p>
                </div>
                <div className="bg-blue-600/10 px-3 py-1 rounded-full flex items-center gap-1.5 h-fit">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Premium</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full mb-4">
            <button
               onClick={handleDownload}
               className="flex items-center justify-center gap-2 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold text-sm transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              Receipt
            </button>
            <button 
               onClick={handleShare}
               className="flex items-center justify-center gap-2 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold text-sm transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          <button
            onClick={onNewBooking}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-base transition-all active:scale-95 shadow-xl shadow-gray-200"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
