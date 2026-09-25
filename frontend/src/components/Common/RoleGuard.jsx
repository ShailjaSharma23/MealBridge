import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { ShieldAlert, ArrowRight, Lock, Home, RefreshCw } from 'lucide-react';

const roleMeta = {
  donor: {
    title: 'Food Donor',
    portalUrl: '/donate',
    portalName: 'Donor Portal',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  shelter: {
    title: 'Shelter / NGO Receiver',
    portalUrl: '/receive',
    portalName: 'Shelter Intake Portal',
    badgeColor: 'bg-sage-100 text-sage-800 border-sage-300',
  },
  volunteer: {
    title: 'Volunteer Courier',
    portalUrl: '/volunteer',
    portalName: 'Volunteer Rescue Board',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
  },
};

const RoleGuard = ({ allowedRole, children }) => {
  const { currentRole, currentUser, switchRole } = useRole();
  const navigate = useNavigate();

  // If role matches, grant access immediately
  if (currentRole === allowedRole) {
    return children;
  }

  const targetMeta = roleMeta[allowedRole] || {
    title: allowedRole,
    portalUrl: '/',
    portalName: 'Portal',
    badgeColor: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  const activeMeta = roleMeta[currentRole] || {
    title: 'Public Guest',
    portalUrl: '/',
    portalName: 'Home',
    badgeColor: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-warm-border shadow-card text-center relative overflow-hidden animate-in fade-in zoom-in-95">
        {/* Top Decorative Alert Banner */}
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-sunburst-200 text-sunburst-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 mb-4">
          <Lock className="w-3.5 h-3.5" />
          <span>Confidentiality & Integrity Guard Active</span>
        </div>

        <h1 className="font-display font-black text-2xl sm:text-3xl text-forest tracking-tight">
          Access Restricted to Verified {targetMeta.title}s
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-forest/70 max-w-lg mx-auto leading-relaxed">
          To maintain strict data privacy, supply-chain confidentiality, and prevent accidental tampering,
          this portal is reserved exclusively for registered <strong>{targetMeta.title}s</strong>.
        </p>

        {/* Current Role Context Box */}
        <div className="mt-6 p-4 rounded-2xl bg-warm border border-warm-border max-w-md mx-auto flex items-center justify-between text-xs">
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-forest/50">Your Active Role</div>
            <div className="font-bold text-forest mt-0.5">
              {currentUser?.name || 'Active Session'}{' '}
              <span className="text-forest/60 font-medium">({currentRole.toUpperCase()})</span>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${activeMeta.badgeColor}`}>
            {currentRole}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Switch Role Button for Judges / Testers */}
          <button
            type="button"
            onClick={() => switchRole(allowedRole)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-forest text-white font-bold text-xs hover:bg-forest/90 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sunburst-400" />
            <span>Switch to {targetMeta.title} Role</span>
          </button>

          {/* Go to Active User's Authorized Portal */}
          {currentRole !== 'guest' && (
            <button
              type="button"
              onClick={() => navigate(activeMeta.portalUrl)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-warm-border text-forest font-semibold text-xs hover:bg-warm transition-colors cursor-pointer"
            >
              <span>Go to My {activeMeta.portalName}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Return Home */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-warm-border text-forest/70 font-semibold text-xs hover:bg-warm transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleGuard;
