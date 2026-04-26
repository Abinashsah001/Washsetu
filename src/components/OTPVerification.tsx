import { useState, useRef } from 'react';
import { ShieldCheck, ArrowRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

type Props = {
  onVerify: () => void;
  onBack: () => void;
};

export function OTPVerification({ onVerify, onBack }: Props) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.join('') === '1234') onVerify();
    else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl border border-gray-100"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-black text-gray-900">Security Check</h2>
          <p className="text-sm font-bold text-gray-400 text-center mt-2 px-4">Enter validation code sent to +91 98*** **452</p>
        </div>
        
        <div className="flex justify-between gap-3 mb-8">
          {otp.map((digit, i) => (
            <input 
              key={i} 
              ref={el => { inputs.current[i] = el; }} 
              type="text" 
              inputMode="numeric" 
              maxLength={1} 
              value={digit}
              onChange={e => handleChange(i, e.target.value)} 
              onKeyDown={e => handleKeyDown(i, e)}
              className={`w-14 h-16 text-2xl font-black text-center bg-gray-50 border-2 rounded-2xl outline-none transition-all ${
                error ? 'border-red-300 text-red-600 animate-shake' : 'border-gray-100 focus:border-blue-500'
              }`} 
            />
          ))}
        </div>
        
        <p className="text-xs font-bold text-gray-400 text-center mb-8 flex items-center justify-center gap-1.5 opacity-60">
          Try <span className="text-blue-600">'1234'</span> for verification
        </p>

        <button 
          onClick={handleVerify} 
          disabled={otp.some(d => !d)} 
          className="w-full py-4 rounded-2xl font-black text-white bg-blue-600 shadow-xl disabled:bg-gray-100 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          Verify Choice <ArrowRight className="w-5 h-5" />
        </button>

        <button 
          onClick={onBack} 
          className="w-full mt-4 py-3 text-gray-400 font-bold text-sm flex items-center justify-center gap-2 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Go Back
        </button>
      </motion.div>
    </div>
  );
}
