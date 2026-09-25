import React, { useState, useEffect } from 'react';
import CapacityBar from '../components/ShelterComponents/CapacityBar.jsx';
import OfferCard from '../components/ShelterComponents/OfferCard.jsx';
import { Leaf, Users, Heart, Globe, Sparkles, Package, CheckCircle2 } from 'lucide-react';
import apiClient from '../services/apiClient';

const initialFallbackOffers = [
  {
    _id: 'off-1',
    matchId: 'off-1',
    foodName: '15kg Cooked Rice & Curry',
    donorName: 'Bistro 42',
    distanceKm: 1.8,
    dietaryType: 'Veg Only',
    expiresInText: '1 hr 15 min',
    photoUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop',
  },
  {
    _id: 'off-2',
    matchId: 'off-2',
    foodName: '12kg Vegetable Pasta',
    donorName: 'Green Valley Cafe',
    distanceKm: 2.4,
    dietaryType: 'Veg Only',
    expiresInText: '2 hr 5 min',
    photoUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop',
  },
  {
    _id: 'off-3',
    matchId: 'off-3',
    foodName: '10kg Dal & Rice',
    donorName: 'City Bites',
    distanceKm: 3.1,
    dietaryType: 'Veg Only',
    expiresInText: '2 hr 47 min',
    photoUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop',
  },
  {
    _id: 'off-4',
    matchId: 'off-4',
    foodName: '8kg Veg Sandwiches',
    donorName: 'Fresh Bites Bakery',
    distanceKm: 2.7,
    dietaryType: 'Veg Only',
    expiresInText: '1 hr 32 min',
    photoUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop',
  },
  {
    _id: 'off-5',
    matchId: 'off-5',
    foodName: '20kg Mixed Veg Curry',
    donorName: 'Taste Hub',
    distanceKm: 4.2,
    dietaryType: 'Veg Only',
    expiresInText: '3 hr 10 min',
    photoUrl: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=600&auto=format&fit=crop',
  },
  {
    _id: 'off-6',
    matchId: 'off-6',
    foodName: '10kg Fresh Fruits',
    donorName: 'Healthy House',
    distanceKm: 1.5,
    dietaryType: 'Veg Only',
    expiresInText: '2 hr 21 min',
    photoUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop',
  },
];

const ShelterPortal = () => {
  const [offers, setOffers] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [capacityTrigger, setCapacityTrigger] = useState(0);
  const [toastNotification, setToastNotification] = useState(null);

  const fetchOffers = async () => {
    try {
      const res = await apiClient.get('/shelters/incoming-offers');
      if (res.data.success && res.data.offers && res.data.offers.length > 0) {
        setOffers(res.data.offers);
        setIsDemoMode(false);
      } else {
        setOffers([]);
      }
    } catch (err) {
      console.warn('Could not fetch shelter offers:', err.message);
      setOffers([]);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Handle discarding (passed) or accepting an offer:
  // Card is immediately removed, and CSS grid rearranges remaining cards into space
  const handleDiscardOffer = (offerId, action) => {
    setOffers((prevOffers) => prevOffers.filter((o) => (o.matchId || o._id) !== offerId));
    setCapacityTrigger((prev) => prev + 1);

    if (action === 'pass') {
      setToastNotification({
        type: 'pass',
        message: 'Offer declined. Removed from your board and routed onward.',
      });
    } else if (action === 'accept') {
      setToastNotification({
        type: 'accept',
        message: 'Donation accepted! Dispatched to nearby volunteer couriers.',
      });
    }

    setTimeout(() => {
      setToastNotification(null);
    }, 3200);
  };

  const handleEnableDemoOffers = () => {
    setOffers(initialFallbackOffers);
    setIsDemoMode(true);
  };

  const handleDisableDemoOffers = () => {
    setOffers([]);
    setIsDemoMode(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Shelter Capacity & Preferences Bar */}
      <CapacityBar capacityTrigger={capacityTrigger} />

      {/* 2. Section Header matching Photo 3 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-semibold text-sage-600 tracking-wider mb-1">
            Good Food • Real Help
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-forest tracking-tight">
            Incoming Matched <span className="text-sunburst-500">Food Offers</span>
          </h1>
          <p className="text-xs sm:text-sm text-forest/70 mt-1 max-w-xl">
            Fresh, surplus food from local businesses, matched to your shelter in real time.
          </p>
        </div>

        <div className="text-xs font-bold text-sunburst-600 italic flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-sunburst-500" />
          <span>Real Food. Real Impact. ♡</span>
        </div>
      </div>

      {/* Dynamic Toast Feedback when a card is accepted or discarded */}
      {toastNotification && (
        <div
          className={`mb-6 p-3.5 sm:p-4 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 border ${
            toastNotification.type === 'accept'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-warm text-forest border-warm-border'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold">
            {toastNotification.type === 'accept' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-sunburst-600 shrink-0" />
            )}
            <span>{toastNotification.message}</span>
          </div>
          <button
            onClick={() => setToastNotification(null)}
            className="text-xs font-bold text-forest/50 hover:text-forest ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. 3x2 Grid of Matched Food Offer Cards or Clean Empty State */}
      {offers.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-warm-border shadow-card text-center max-w-2xl mx-auto my-8">
          <div className="w-16 h-16 rounded-3xl bg-sage-50 border border-sage-200 text-sage-600 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-display font-black text-2xl text-forest mb-2">
            No Incoming Matched Offers Right Now
          </h3>
          <p className="text-xs sm:text-sm text-forest/70 max-w-md mx-auto mb-6 leading-relaxed">
            Your intake depot is all set up! When nearby food businesses post surplus donations that match your storage capacity and dietary criteria, they will automatically appear here for instant acceptance.
          </p>
          <button
            type="button"
            onClick={handleEnableDemoOffers}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-forest text-white font-bold text-xs hover:bg-forest/90 transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-sunburst-400" />
            <span>Preview Sample Matched Offers (Demo)</span>
          </button>
        </div>
      ) : (
        <>
          {isDemoMode && (
            <div className="mb-6 p-4 bg-amber-50/90 border border-sunburst-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-sunburst-600 shrink-0" />
                <span>Showing Sample Incoming Offers (Interactive Demo Preview)</span>
              </div>
              <button
                type="button"
                onClick={handleDisableDemoOffers}
                className="text-xs font-bold text-amber-800 underline hover:text-amber-950 ml-4 shrink-0 cursor-pointer"
              >
                Hide Demo
              </button>
            </div>
          )}

          {/* Responsive grid that automatically rearranges when cards are discarded */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 transition-all duration-300">
            {offers.map((offer) => (
              <OfferCard
                key={offer._id || offer.matchId}
                offer={offer}
                onDiscardOffer={handleDiscardOffer}
                onOfferUpdated={() => setCapacityTrigger((prev) => prev + 1)}
              />
            ))}
          </div>
        </>
      )}

      {/* 4. Bottom Section: Every Donation Builds a Healthier Community */}
      <div className="mt-16 pt-10 border-t border-warm-border text-center">
        <h3 className="font-display font-bold text-lg text-forest mb-6">
          Every Donation Builds a Healthier Community ♡
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="p-4 rounded-2xl bg-white border border-warm-border shadow-sm flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-forest">Less Food Waste</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-warm-border shadow-sm flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-forest">More Healthy Meals</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-warm-border shadow-sm flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-forest">Stronger Communities</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-warm-border shadow-sm flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-2">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-forest">Greener Planet</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShelterPortal;
