import React, { useState } from 'react';
import { Store, MapPin, Leaf, Clock, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import apiClient from '../../services/apiClient';

const OfferCard = ({ offer, onOfferUpdated, onDiscardOffer }) => {
  const [loading, setLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleAction = async (action) => {
    setLoading(true);
    const offerId = offer.matchId || offer._id;

    try {
      if (action === 'accept') {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#8BA888', '#F59E0B'],
        });
        setIsAccepted(true);
        setToastMsg('🎉 Accepted! Dispatched to Volunteer board.');

        // Trigger API update
        apiClient.post(`/shelters/offers/${offerId}/respond`, { action }).catch((err) =>
          console.warn('API error accepting offer:', err.message)
        );

        // After brief confirmation animation, remove from incoming queue and rearrange cards
        setTimeout(() => {
          if (onDiscardOffer) onDiscardOffer(offerId, 'accept');
          else if (onOfferUpdated) onOfferUpdated();
        }, 1100);
      } else {
        // Discard card immediately and let remaining cards rearrange and fill space
        if (onDiscardOffer) {
          onDiscardOffer(offerId, 'pass');
        } else if (onOfferUpdated) {
          onOfferUpdated();
        }

        // Fire API cascade in background
        apiClient.post(`/shelters/offers/${offerId}/respond`, { action: 'pass' }).catch((err) =>
          console.warn('API error passing offer:', err.message)
        );
      }
    } catch (err) {
      console.warn('Fallback handling action:', err.message);
      if (action === 'accept') {
        setIsAccepted(true);
        setTimeout(() => {
          if (onDiscardOffer) onDiscardOffer(offerId, 'accept');
          else if (onOfferUpdated) onOfferUpdated();
        }, 1100);
      } else {
        if (onDiscardOffer) onDiscardOffer(offerId, 'pass');
        else if (onOfferUpdated) onOfferUpdated();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-warm-border shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between animate-in fade-in zoom-in-95">
      <div>
        {/* Card Image Banner with LIVE badge */}
        <div className="relative aspect-[16/10] overflow-hidden bg-sage-50">
          <img
            src={offer.photoUrl}
            alt={offer.foodName}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-sage-800 shadow-sm flex items-center gap-1.5 border border-sage-200">
            <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
            <span>LIVE</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <h3 className="font-display font-extrabold text-xl text-forest tracking-tight">
            {offer.foodName}
          </h3>

          {/* Donor Information */}
          <div className="flex items-center gap-2 mt-2">
            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Store className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-forest flex items-center gap-1">
                <span>{offer.donorName}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-sage-600 fill-sage-600/20" />
              </div>
              <div className="text-[10px] text-forest/50 font-medium">Local Restaurant • Verified Donor</div>
            </div>
          </div>

          {/* Distance & Veg Tags */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-warm-border/60 text-xs font-semibold text-forest/70">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sage-600" />
              <span>{offer.distanceKm} km away</span>
            </span>
            <span className="text-forest/20">•</span>
            <span className="flex items-center gap-1 text-emerald-700">
              <Leaf className="w-3.5 h-3.5" />
              <span>{offer.dietaryType || 'Veg Only'}</span>
            </span>
          </div>

          {/* Countdown Timer Pill */}
          <div className="mt-4 p-2.5 rounded-2xl bg-amber-50/80 border border-sunburst-200/80 flex items-center justify-center gap-2 text-xs font-bold text-sunburst-700">
            <Clock className="w-4 h-4 text-sunburst-500 animate-pulse" />
            <span>Expires in {offer.expiresInText || '1 hr 15 min'}</span>
          </div>

          {toastMsg && (
            <div className="mt-3 p-2 rounded-xl bg-sage-50 text-sage-800 text-xs font-semibold text-center border border-sage-300 animate-in fade-in">
              {toastMsg}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-0 space-y-2.5">
        {isAccepted ? (
          <div className="w-full py-3 px-4 rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-xs text-center flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Accepted • Dispatched to Volunteer</span>
          </div>
        ) : (
          <>
            <button
              onClick={() => handleAction('accept')}
              disabled={loading}
              className="w-full btn-sage text-xs py-3 rounded-2xl shadow-sm hover:shadow-hover flex items-center justify-center gap-1.5 font-bold cursor-pointer"
            >
              <span>Accept Donation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleAction('pass')}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-2xl border border-sunburst-300 text-sunburst-700 hover:bg-sunburst-50 font-semibold text-xs transition-colors flex items-center justify-center cursor-pointer"
            >
              Pass to Next Shelter
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OfferCard;
