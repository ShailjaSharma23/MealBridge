import React, { useState } from 'react';
import { useRole } from '../../context/RoleContext';
import { X, Lock, Mail, User, Store, Home, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import apiClient from '../../services/apiClient';

const AuthModal = ({ isOpen, onClose }) => {
  const { switchRole } = useRole();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form fields
  const [role, setRole] = useState('donor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [organizationType, setOrganizationType] = useState('Restaurant');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isRegister) {
        // Register API call
        const res = await apiClient.post('/users/register', {
          name,
          email,
          password,
          role,
          phone,
          address,
          organizationType,
        });

        if (res.data.success) {
          if (res.data.token) {
            localStorage.setItem('mealbridge_token', res.data.token);
          }
          await switchRole(role);
          setSuccessMsg(`Welcome to MealBridge, ${res.data.user.name}!`);
          setTimeout(() => {
            onClose();
          }, 1200);
        }
      } else {
        // Login API call
        const res = await apiClient.post('/users/login', {
          email,
          password,
        });

        if (res.data.success) {
          if (res.data.token) {
            localStorage.setItem('mealbridge_token', res.data.token);
          }
          await switchRole(res.data.user.role || 'donor');
          setSuccessMsg(`Welcome back, ${res.data.user.name}!`);
          setTimeout(() => {
            onClose();
          }, 1200);
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-warm-border shadow-2xl p-6 sm:p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-warm text-forest/60 hover:text-forest transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-sage-50 text-sage-600 flex items-center justify-center mx-auto mb-3 border border-sage-200 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-display font-black text-2xl text-forest">
            {isRegister ? 'Join MealBridge' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-forest/60 mt-1">
            {isRegister
              ? 'Select your role and create your verified account.'
              : 'Sign in to manage food donations and rescue dispatches.'}
          </p>
        </div>

        {/* Form Error / Success feedback */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* If Registering, choose Role */}
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-forest mb-1.5">
                Register as:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'donor', label: 'Donor', icon: Store },
                  { id: 'shelter', label: 'Shelter', icon: Home },
                  { id: 'volunteer', label: 'Volunteer', icon: Truck },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = role === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id)}
                      className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        isSelected
                          ? 'bg-forest text-white border-forest shadow-sm'
                          : 'bg-warm text-forest/70 border-warm-border hover:bg-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Name Field (if registering) */}
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-forest mb-1">
                {role === 'donor'
                  ? 'Restaurant / Business Name'
                  : role === 'shelter'
                  ? 'Shelter / NGO Name'
                  : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3.5 top-3 text-forest/40" />
                <input
                  type="text"
                  required
                  placeholder={role === 'donor' ? 'e.g. Bistro 42' : 'Your name'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-warm border border-warm-border rounded-2xl pl-9 pr-4 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-forest mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3.5 top-3 text-forest/40" />
              <input
                type="email"
                required
                placeholder="name@organization.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-warm border border-warm-border rounded-2xl pl-9 pr-4 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-forest mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3.5 top-3 text-forest/40" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-warm border border-warm-border rounded-2xl pl-9 pr-4 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>
          </div>

          {/* Extra Role-Specific Registration Fields */}
          {isRegister && role === 'donor' && (
            <div>
              <label className="block text-xs font-bold text-forest mb-1">
                Establishment Type
              </label>
              <select
                value={organizationType}
                onChange={(e) => setOrganizationType(e.target.value)}
                className="w-full bg-warm border border-warm-border rounded-2xl px-3 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
              >
                <option value="Restaurant">Restaurant / Cafe</option>
                <option value="Bakery">Bakery / Patisserie</option>
                <option value="Cafeteria">College / Corporate Cafeteria</option>
                <option value="Supermarket">Supermarket</option>
                <option value="Other">Catering & Banquet Hall</option>
              </select>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-sage py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-hover"
            >
              <span>{loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-warm-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-forest/40">
              <span className="bg-white px-2">Or continue with</span>
            </div>
          </div>

          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={async () => {
              setLoading(true);
              try {
                await switchRole(role || 'donor');
                setSuccessMsg(`Signed in with Google as ${role.toUpperCase()}!`);
                setTimeout(() => onClose(), 1000);
              } finally {
                setLoading(false);
              }
            }}
            className="w-full py-2.5 px-4 rounded-2xl border border-warm-border text-forest font-bold text-xs hover:bg-warm transition-colors flex items-center justify-center gap-2.5 shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign In with Google</span>
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="mt-5 text-center text-xs text-forest/60">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-sage-700 font-bold hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-sunburst-600 font-bold hover:underline"
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
