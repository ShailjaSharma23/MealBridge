import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { User, ChevronDown, Check, Menu, X, Sparkles, Settings, LogIn, LogOut } from 'lucide-react';
import RoleProfileModal from './RoleProfileModal.jsx';
import AuthModal from './AuthModal.jsx';

const Navbar = () => {
  const { currentRole, currentUser, switchRole, logout } = useRole();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Donate', path: '/donate' },
    { name: 'Receive', path: '/receive' },
    { name: 'Volunteer', path: '/volunteer' },
    { name: 'AI Learn Hub', path: '/ai-learn' },
    { name: 'Impact', path: '/impact' },
  ];

  const roles = [
    { id: 'donor', label: 'Donor Profile', desc: 'Post surplus food & track meals' },
    { id: 'shelter', label: 'Shelter / NGO', desc: 'Accept incoming food offers' },
    { id: 'volunteer', label: 'Volunteer', desc: 'Claim pickups & deliver meals' },
    { id: 'guest', label: 'Public / Guest', desc: 'Explore city impact & AI helper' },
  ];

  const currentRoleLabel = roles.find((r) => r.id === currentRole)?.label || 'Profile: Donor';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-warm-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Enhanced Typography */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/logo.png"
                alt="MealBridge Logo"
                className="w-10 h-10 rounded-2xl object-cover shadow-md shadow-sage-300/40 group-hover:scale-105 group-hover:rotate-1 transition-all duration-300 ring-2 ring-sage-200/80"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-300 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="font-display font-black text-2xl tracking-tight leading-none flex items-center">
                <span className="text-forest">Meal</span>
                <span className="bg-gradient-to-r from-sage-600 via-emerald-600 to-teal-700 bg-clip-text text-transparent">Bridge</span>
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-forest/45 mt-0.5">Surplus &bull; Shelter</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive ? 'text-forest font-semibold' : 'text-forest/70 hover:text-forest'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage-400 rounded-full animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Role Switcher & Auth Dropdown (Top Right) */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-400 text-white font-medium text-sm shadow-sm transition-all hover:bg-sage-500 active:scale-95"
              aria-label="Switch User Profile Role"
            >
              <User className="w-4 h-4" />
              <span>{currentRoleLabel}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-warm-border p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {/* Active User Information Card */}
                {currentUser && (
                  <div className="p-2.5 bg-warm rounded-xl mb-2 border border-warm-border">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-forest/50">Logged In User</span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    </div>
                    <div className="text-xs font-bold text-forest truncate mt-0.5">{currentUser.name}</div>
                    <div className="text-[11px] text-forest/60 truncate">{currentUser.email}</div>
                  </div>
                )}

                {/* Profile Form Action */}
                <div className="p-1 border-b border-warm-border space-y-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setProfileModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-sage-50 hover:bg-sage-100 text-sage-900 transition-colors text-xs font-bold"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-sage-600" />
                      <span>Edit {currentRoleLabel} Form</span>
                    </div>
                    <span className="text-[10px] text-sage-700 bg-white px-2 py-0.5 rounded-full border border-sage-200">
                      Settings
                    </span>
                  </button>

                  {currentUser ? (
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50 text-rose-700 transition-colors text-xs font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>Sign Out</span>
                      </div>
                      <span className="text-[10px] text-rose-500">Exit</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setAuthModalOpen(true);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-warm text-forest transition-colors text-xs font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <LogIn className="w-4 h-4 text-sunburst-600" />
                        <span>Sign In / Create Account</span>
                      </div>
                      <span className="text-[10px] text-forest/40">Auth &rarr;</span>
                    </button>
                  )}
                </div>

                <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-forest/50 uppercase tracking-wider">
                  Switch Active Role (Demo)
                </div>
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      switchRole(r.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors ${
                      currentRole === r.id
                        ? 'bg-sage-50/70 text-sage-800 font-semibold'
                        : 'hover:bg-warm text-forest/80'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="text-xs font-bold flex items-center justify-between">
                        {r.label}
                        {currentRole === r.id && <Check className="w-3.5 h-3.5 text-sage-500" />}
                      </div>
                      <div className="text-[11px] text-forest/50 font-normal mt-0.5">{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-forest/80 hover:text-forest"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-warm-border px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-medium text-forest hover:bg-sage-50"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}

      {/* Interactive Role Profile Settings Modal */}
      <RoleProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Interactive Authentication Modal (Sign In / Register) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </header>
  );
};

export default Navbar;
