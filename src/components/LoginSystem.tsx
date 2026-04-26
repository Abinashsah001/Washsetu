import { useState } from 'react';
import { Shield, UserRound, Lock, Phone, Mail } from 'lucide-react';

type Role = 'customer' | 'admin';

type LoginResult = {
  success: boolean;
  role: Role;
  name: string;
  message?: string;
};

type Props = {
  onLoginSuccess: (result: LoginResult) => void;
};

export function LoginSystem({ onLoginSuccess }: Props) {
  const [role, setRole] = useState<Role>('customer');
  const [customerMode, setCustomerMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const placeholder =
    role === 'customer' ? 'Customer phone (e.g. 9876543210)' : 'Admin username';

  const helperText =
    role === 'customer'
      ? customerMode === 'signin'
        ? 'Use your registered email or phone and password'
        : 'Create account with name + password and email/phone'
      : 'Demo login: username admin and password admin123';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (role === 'customer' && customerMode === 'signup' && !email.trim() && !phone.trim()) {
        setError('Provide at least email or phone to create an account.');
        setIsLoading(false);
        return;
      }

      const endpoint = role === 'customer' && customerMode === 'signup' ? '/api/auth/register' : '/api/auth/login';
      const response = await fetch(`http://localhost:5001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: role === 'customer' ? 'customer' : role,
          name: role === 'customer' && customerMode === 'signup' ? name.trim() : undefined,
          email: role === 'customer' && customerMode === 'signup' ? email.trim() : undefined,
          phone: role === 'customer' && customerMode === 'signup' ? phone.trim() : undefined,
          identifier: role === 'customer' && customerMode === 'signin' ? identifier.trim() : role === 'admin' ? identifier.trim() : undefined,
          password: password.trim(),
        }),
      });

      const payload = (await response.json()) as LoginResult & { error?: string };

      if (!response.ok || !payload.success) {
        setError(payload.error || payload.message || 'Login failed');
        return;
      }

      onLoginSuccess(payload);
    } catch (_error) {
      setError('Unable to reach auth server. Please make sure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl border border-gray-100">
        <div className="text-center mb-7">
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
            WashSetu
          </h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Role Based Login</p>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-gray-100 rounded-2xl p-1 mb-6">
          <button
            onClick={() => {
              setRole('customer');
              setError('');
            }}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
              role === 'customer' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'
            }`}
          >
            <UserRound className="w-4 h-4" /> Customer
          </button>
          <button
            onClick={() => {
              setRole('admin');
              setCustomerMode('signin');
              setError('');
            }}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
              role === 'admin' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'
            }`}
          >
            <Shield className="w-4 h-4" /> Admin
          </button>
        </div>

        {role === 'customer' && (
          <div className="grid grid-cols-2 gap-2 bg-blue-50 rounded-2xl p-1 mb-4">
            <button
              type="button"
              onClick={() => {
                setCustomerMode('signin');
                setError('');
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                customerMode === 'signin' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-600'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setCustomerMode('signup');
                setError('');
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                customerMode === 'signup' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-600'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === 'customer' && customerMode === 'signup' && (
            <label className="block">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Full Name</span>
              <div className="relative">
                <UserRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </label>
          )}

          {role === 'customer' && customerMode === 'signup' && (
            <label className="block">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Email (optional)</span>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="you@example.com"
                />
              </div>
            </label>
          )}

          {role === 'customer' && customerMode === 'signup' && (
            <label className="block">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Phone (optional)</span>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="9876543210"
                />
              </div>
            </label>
          )}

          <label className="block">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">
              {role === 'customer' ? 'Email or Phone' : 'Username'}
            </span>
            <div className="relative">
              {role === 'customer' ? (
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              ) : (
                <UserRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              )}
              <input
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-200"
                placeholder={role === 'customer' ? 'Email or phone' : placeholder}
                required={role !== 'customer' || customerMode === 'signin'}
                disabled={role === 'customer' && customerMode === 'signup'}
              />
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Password</span>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Enter password"
                required
              />
            </div>
          </label>

          {error && <p className="text-xs font-bold text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-blue-600 text-white font-black rounded-2xl disabled:bg-blue-300 transition"
          >
            {isLoading
              ? customerMode === 'signup'
                ? 'Creating account...'
                : 'Signing in...'
              : role === 'customer' && customerMode === 'signup'
                ? 'Create customer account'
                : `Sign in as ${role}`}
          </button>
        </form>

        <p className="text-xs text-gray-500 font-semibold mt-5 leading-relaxed">{helperText}</p>
      </div>
    </div>
  );
}
