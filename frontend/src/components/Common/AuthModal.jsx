import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import {
  X,
  Lock,
  Mail,
  User,
  Store,
  Home,
  Truck,
  CheckCircle2,
  ArrowRight,
  KeyRound,
  ShieldCheck,
  Send,
  AlertCircle,
  Settings,
  Phone,
  MapPin,
  Refrigerator,
  Tag,
} from 'lucide-react';
import apiClient from '../../services/apiClient';

const AuthModal = ({ isOpen, onClose }) => {
  const { switchRole, loginUserSession } = useRole();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('password'); // 'password' or 'otp'
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password login / register form fields
  const [role, setRole] = useState('donor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [organizationType, setOrganizationType] = useState('Restaurant');

  // Role-specific registration fields
  const [fssaiLicense, setFssaiLicense] = useState('');
  const [capacityKg, setCapacityKg] = useState('50');
  const [foodPreferences, setFoodPreferences] = useState(['Veg Only', 'Cooked Meals Accepted']);
  const [contactPerson, setContactPerson] = useState('');
  const [vehicleType, setVehicleType] = useState('Two-Wheeler / Scooter');

  // OTP flow states
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpHint, setOtpHint] = useState('');

  // Live Backend URL Configuration
  const [showUrlConfig, setShowUrlConfig] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('mealbridge_api_url') || '' : ''
  );

  if (!isOpen) return null;

  // Centralized authentication completion handler with smooth role-based routing
  const completeAuthentication = (user, token, message) => {
    loginUserSession(user, token);
    setSuccessMsg(message);
    setTimeout(() => {
      onClose();
      // Smoothly navigate to relevant portal based on role if on root or restricted page
      const currentPath = window.location.pathname;
      if (currentPath === '/' || currentPath === '/impact' || currentPath === '/ai-learn') {
        if (user.role === 'donor') navigate('/donate');
        else if (user.role === 'shelter') navigate('/receive');
        else if (user.role === 'volunteer') navigate('/volunteer');
      } else if (
        (user.role === 'donor' && currentPath !== '/donate') ||
        (user.role === 'shelter' && currentPath !== '/receive') ||
        (user.role === 'volunteer' && currentPath !== '/volunteer')
      ) {
        if (user.role === 'donor') navigate('/donate');
        else if (user.role === 'shelter') navigate('/receive');
        else if (user.role === 'volunteer') navigate('/volunteer');
      }
    }, 1000);
  };

  // Handle setting a custom Render backend URL from the modal UI
  const handleSaveCustomUrl = (e) => {
    e.preventDefault();
    if (!customUrlInput.trim()) {
      localStorage.removeItem('mealbridge_api_url');
      apiClient.defaults.baseURL = 'https://mealbridge-backend.onrender.com/api';
      setErrorMsg('');
      setSuccessMsg('Reset backend URL to default.');
      setShowUrlConfig(false);
      return;
    }
    const clean = customUrlInput.trim().endsWith('/api')
      ? customUrlInput.trim()
      : `${customUrlInput.trim().replace(/\/+$/, '')}/api`;
    localStorage.setItem('mealbridge_api_url', clean);
    apiClient.defaults.baseURL = clean;
    setErrorMsg('');
    setSuccessMsg(`Backend URL updated to: ${clean}! Retrying...`);
    setShowUrlConfig(false);
  };

  // Handle Standard Password Login / Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isRegister) {
        const res = await apiClient.post('/users/register', {
          name,
          email,
          password,
          role,
          phone,
          address,
          organizationType,
          fssaiLicense: role === 'donor' ? fssaiLicense : undefined,
          capacityKg: role === 'shelter' ? Number(capacityKg) || 50 : undefined,
          foodPreferences: role === 'shelter' ? foodPreferences : undefined,
          contactPerson: role === 'shelter' ? (contactPerson || name) : undefined,
          vehicleType: role === 'volunteer' ? vehicleType : undefined,
        });

        if (res.data.success) {
          completeAuthentication(res.data.user, res.data.token, `Welcome to MealBridge, ${res.data.user.name}!`);
        }
      } else {
        const res = await apiClient.post('/users/login', {
          email,
          password,
        });

        if (res.data.success) {
          completeAuthentication(res.data.user, res.data.token, `Welcome back, ${res.data.user.name}!`);
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sending OTP via Brevo
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email to receive an OTP.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await apiClient.post('/users/send-otp', { email });
      if (res.data.success) {
        setOtpSent(true);
        setSuccessMsg(res.data.message || 'OTP sent to your email!');
        if (res.data.demoHint) {
          setOtpHint(res.data.demoHint);
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle Verifying OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await apiClient.post('/users/verify-otp', {
        email,
        otp: otpCode,
        role,
        name: name || undefined,
      });

      if (res.data.success) {
        completeAuthentication(res.data.user, res.data.token, `OTP verified successfully! Welcome, ${res.data.user.name}.`);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const googleEmail = email || `${role}.user@gmail.com`;
      const googleName = name || (email ? email.split('@')[0] : `Google ${role.charAt(0).toUpperCase() + role.slice(1)}`);

      const res = await apiClient.post('/users/google-login', {
        email: googleEmail,
        name: googleName,
        role,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      });

      if (res.data.success) {
        completeAuthentication(res.data.user, res.data.token, `Signed in with Google as ${res.data.user.name}!`);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-forest/60 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 text-center sm:text-left">
        <div
          className="bg-white rounded-3xl max-w-md w-full my-6 sm:my-8 border border-warm-border shadow-2xl p-5 sm:p-8 relative text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            type="button"
            aria-label="Close Authentication Dialog"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full hover:bg-warm text-forest/60 hover:text-forest transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-3 relative flex items-center justify-center">
            <img
              src="/logo.png"
              alt="MealBridge Logo"
              className="w-14 h-14 rounded-2xl object-cover shadow-md ring-2 ring-sage-200"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-xs border border-sage-200">
              {authMode === 'otp' ? (
                <KeyRound className="w-3 h-3 text-sunburst-600" />
              ) : (
                <Lock className="w-3 h-3 text-sage-600" />
              )}
            </div>
          </div>
          <h2 className="font-display font-black text-2xl tracking-tight text-forest">
            {authMode === 'otp' ? (
              <span>Email OTP Verification</span>
            ) : isRegister ? (
              <span>Join <span className="bg-gradient-to-r from-sage-600 to-emerald-600 bg-clip-text text-transparent">MealBridge</span></span>
            ) : (
              <span>Welcome Back</span>
            )}
          </h2>
          <p className="text-xs text-forest/60 mt-1">
            {authMode === 'otp'
              ? 'Sign in securely with a 6-digit One-Time Password sent to your email.'
              : isRegister
              ? 'Select your role and create your verified account.'
              : 'Sign in to manage food donations and rescue dispatches.'}
          </p>
        </div>

        {/* Tabs: Password vs OTP */}
        <div className="flex rounded-2xl bg-warm p-1 border border-warm-border mb-5">
          <button
            type="button"
            onClick={() => {
              setAuthMode('password');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              authMode === 'password'
                ? 'bg-white text-forest shadow-xs'
                : 'text-forest/60 hover:text-forest'
            }`}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('otp');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'otp'
                ? 'bg-white text-forest shadow-xs'
                : 'text-forest/60 hover:text-forest'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-sunburst-600" />
            <span>Email OTP</span>
          </button>
        </div>

        {/* Form Error / Success feedback */}
        {loading && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200 text-center animate-pulse flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Connecting to live server... (Render cold-start may take ~20-30s if idle)</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200 animate-in fade-in">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div>{errorMsg}</div>
                {(errorMsg.includes('404') || errorMsg.includes('unreachable') || errorMsg.includes('connect')) && (
                  <div className="mt-2 pt-2 border-t border-rose-200/80">
                    <div className="text-[11px] text-rose-700">
                      <strong>Target API:</strong>{' '}
                      <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-rose-200 text-[10px]">
                        {apiClient.defaults.baseURL}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-rose-600">Have a custom Render backend URL?</span>
                      <button
                        type="button"
                        onClick={() => setShowUrlConfig(!showUrlConfig)}
                        className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg font-bold text-[10px] transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Settings className="w-3 h-3 text-rose-600" />
                        <span>{showUrlConfig ? 'Close' : 'Set Backend URL'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Backend URL Config Box */}
        {showUrlConfig && (
          <form onSubmit={handleSaveCustomUrl} className="mb-4 p-3.5 rounded-2xl bg-sage-50 border border-sage-300 animate-in fade-in space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-forest flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-sage-600" />
                <span>Render Backend URL:</span>
              </span>
              <button
                type="button"
                onClick={() => setShowUrlConfig(false)}
                className="text-[10px] text-forest/60 hover:text-forest font-semibold"
              >
                ✕ Cancel
              </button>
            </div>
            <p className="text-[11px] text-forest/70">
              Paste the URL shown at the top of your Render Web Service dashboard:
            </p>
            <div className="flex gap-1.5">
              <input
                type="url"
                required
                placeholder="https://mealbridge-backend-xxxx.onrender.com"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                className="flex-1 bg-white border border-sage-300 rounded-xl px-2.5 py-1.5 text-xs text-forest focus:outline-none focus:ring-1 focus:ring-sage-500 font-mono"
              />
              <button
                type="submit"
                className="btn-sage px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs whitespace-nowrap"
              >
                Save & Connect
              </button>
            </div>
          </form>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ----------------- MODE 1: OTP AUTHENTICATION ----------------- */}
        {authMode === 'otp' ? (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-forest mb-1.5">
                    Your Role:
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
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
                          className={`p-2 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                            isSelected
                              ? 'bg-forest text-white border-forest shadow-sm'
                              : 'bg-warm text-forest/70 border-warm-border hover:bg-white'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest mb-1">
                    Enter Email Address for OTP
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3.5 top-3 text-forest/40" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-warm border border-warm-border rounded-2xl pl-9 pr-4 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-sage py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-hover"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Sending OTP Code...' : 'Send 6-Digit OTP to Email'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
                <div className="text-center">
                  <div className="text-xs text-forest/70">
                    We sent a 6-digit code to <strong className="text-forest">{email}</strong>
                  </div>
                  {otpHint && (
                    <div className="mt-1 text-[11px] font-mono font-bold text-sage-700 bg-sage-50 py-1 px-3 rounded-xl border border-sage-200 inline-block">
                      {otpHint}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest mb-1 text-center">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="••••••"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.trim())}
                    className="w-full bg-warm border border-warm-border rounded-2xl py-3 text-center text-xl font-mono font-black tracking-widest text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
                  />
                  <div className="text-[11px] text-center text-forest/50 mt-1">
                    Tip: You can use the code from email or <strong className="text-forest">123456</strong> for instant demo.
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-1/3 py-2.5 rounded-2xl border border-warm-border text-xs font-semibold text-forest/70 hover:bg-warm"
                  >
                    Change Email
                  </button>
                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="flex-1 btn-sage py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{loading ? 'Verifying...' : 'Verify & Sign In'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* ----------------- MODE 2: PASSWORD AUTHENTICATION ----------------- */
          <form onSubmit={handleSubmit} className="space-y-3.5">
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

            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-forest mb-1">
                  {role === 'donor'
                    ? 'Contact Phone (Pickup Bay)'
                    : role === 'shelter'
                    ? 'Emergency Intake Phone'
                    : 'Phone / WhatsApp'}
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3.5 top-3 text-forest/40" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98112 34567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-warm border border-warm-border rounded-2xl pl-9 pr-4 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
                  />
                </div>
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-forest mb-1">
                  {role === 'donor'
                    ? 'Pickup Bay Address & City'
                    : role === 'shelter'
                    ? 'Shelter Intake Address & City'
                    : 'Operating Base / Neighborhood'}
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3.5 top-3 text-forest/40" />
                  <input
                    type="text"
                    required
                    placeholder={
                      role === 'donor'
                        ? '123, Green Park Market, New Delhi'
                        : role === 'shelter'
                        ? 'Community Hall 4, Lajpat Nagar, New Delhi'
                        : 'South Delhi / Hauz Khas'
                    }
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-warm border border-warm-border rounded-2xl pl-9 pr-4 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
                  />
                </div>
              </div>
            )}

            {/* DONOR SPECIFIC REGISTRATION FIELDS */}
            {isRegister && role === 'donor' && (
              <div className="space-y-3 pt-1 border-t border-warm-border/60">
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">
                    Establishment Type
                  </label>
                  <select
                    value={organizationType}
                    onChange={(e) => setOrganizationType(e.target.value)}
                    className="w-full bg-warm border border-warm-border rounded-2xl px-3 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
                  >
                    <option value="Restaurant">Fine Dining / Restaurant / Cafe</option>
                    <option value="Bakery">Bakery & Patisserie</option>
                    <option value="Cafeteria">Corporate / College Cafeteria</option>
                    <option value="Supermarket">Supermarket & Grocery Retail</option>
                    <option value="Other">Catering & Banquet Hall</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-forest">
                      FSSAI Food License Number
                    </label>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Safety Compliance
                    </span>
                  </div>
                  <div className="relative">
                    <ShieldCheck className="w-3.5 h-3.5 absolute left-3.5 top-3 text-emerald-600" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. FSSAI-DEL-2026-98104"
                      value={fssaiLicense}
                      onChange={(e) => setFssaiLicense(e.target.value)}
                      className="w-full bg-warm border border-warm-border rounded-2xl pl-9 pr-4 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SHELTER SPECIFIC REGISTRATION FIELDS */}
            {isRegister && role === 'shelter' && (
              <div className="space-y-3 pt-1 border-t border-warm-border/60">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full bg-warm border border-warm-border rounded-2xl px-3 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">
                      Cold Storage (kg)
                    </label>
                    <div className="relative">
                      <Refrigerator className="w-3.5 h-3.5 absolute left-3 top-3 text-forest/40" />
                      <input
                        type="number"
                        min="10"
                        max="1000"
                        required
                        placeholder="50"
                        value={capacityKg}
                        onChange={(e) => setCapacityKg(e.target.value)}
                        className="w-full bg-warm border border-warm-border rounded-2xl pl-8 pr-3 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest mb-1.5">
                    Dietary Acceptance Preferences
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Veg Only', 'Cooked Meals Accepted', 'Bakery & Breads Accepted', 'Packaged Goods'].map((pref) => {
                      const isSelected = foodPreferences.includes(pref);
                      return (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setFoodPreferences(foodPreferences.filter((p) => p !== pref));
                            } else {
                              setFoodPreferences([...foodPreferences, pref]);
                            }
                          }}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                            isSelected
                              ? 'bg-sage-600 text-white border-sage-600 shadow-xs'
                              : 'bg-warm text-forest/70 border-warm-border hover:bg-white'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{pref}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* VOLUNTEER SPECIFIC REGISTRATION FIELDS */}
            {isRegister && role === 'volunteer' && (
              <div className="pt-1 border-t border-warm-border/60">
                <label className="block text-xs font-bold text-forest mb-1">
                  Rescue Vehicle Type
                </label>
                <div className="relative">
                  <Truck className="w-3.5 h-3.5 absolute left-3.5 top-3 text-forest/40" />
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full bg-warm border border-warm-border rounded-2xl pl-9 pr-4 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
                  >
                    <option value="Two-Wheeler / Scooter">Two-Wheeler / Scooter / Motorcycle</option>
                    <option value="Electric Cargo Van / Auto">Electric Cargo Van / Auto</option>
                    <option value="Bicycle / Eco Courier">Bicycle / Eco Courier</option>
                    <option value="Four-Wheeler / Car">Four-Wheeler / Car / SUV</option>
                  </select>
                </div>
              </div>
            )}

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
          </form>
        )}

        {/* Divider */}
        <div className="relative my-3 pt-1">
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
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-2xl border border-warm-border text-forest font-bold text-xs hover:bg-warm transition-colors flex items-center justify-center gap-2.5 shadow-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>{loading ? 'Authenticating with Google...' : 'Sign In with Google (1-Click)'}</span>
        </button>

        {/* Toggle between Login and Register (for Password mode) */}
        {authMode === 'password' && (
          <div className="mt-3.5 text-center text-xs text-forest/60">
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
        )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
