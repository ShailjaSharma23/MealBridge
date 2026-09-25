import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Handshake, User, Truck, Heart } from 'lucide-react';
import apiClient from '../../services/apiClient';

const ProgressTracker = ({ refreshTrigger }) => {
  const [pipelineData, setPipelineData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPipeline = async () => {
      try {
        const res = await apiClient.get('/donations/active-pipeline');
        if (res.data.success) {
          setPipelineData(res.data);
        }
      } catch (err) {
        console.warn('Using default pipeline data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPipeline();
  }, [refreshTrigger]);

  const defaultSteps = [
    {
      step: 1,
      title: '1. Posted',
      description: 'Your donation has been posted successfully.',
      timestamp: 'Today, 2:34 PM',
      status: 'completed',
      icon: CheckCircle2,
    },
    {
      step: 2,
      title: '2. Matched with Hope Shelter',
      description: 'Your food has been matched with Hope Shelter (2.4 km away).',
      timestamp: 'Today, 2:37 PM',
      status: 'live',
      icon: Handshake,
    },
    {
      step: 3,
      title: '3. Volunteer Assigned',
      description: 'A volunteer is on their way to pick up your donation.',
      timestamp: 'Pending',
      status: 'pending',
      icon: User,
    },
    {
      step: 4,
      title: '4. Delivered',
      description: 'Your food will soon reach the shelter and make a difference!',
      timestamp: 'Pending',
      status: 'pending',
      icon: Truck,
    },
  ];

  const [showDemoPreview, setShowDemoPreview] = useState(false);
  const hasActiveDonation = Boolean(pipelineData?.donation);
  const steps = hasActiveDonation
    ? pipelineData?.trackerSteps || []
    : showDemoPreview
    ? defaultSteps
    : [];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-border shadow-card flex flex-col justify-between h-full min-h-[460px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-warm-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-forest">Active Donations</h2>
              <div className="text-xs font-semibold text-sunburst-600">Progress Tracker</div>
            </div>
          </div>

          {hasActiveDonation ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live Active
            </span>
          ) : showDemoPreview ? (
            <button
              onClick={() => setShowDemoPreview(false)}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
            >
              Close Demo
            </button>
          ) : null}
        </div>

        <p className="text-xs sm:text-sm text-forest/70 mt-3 mb-6">
          {hasActiveDonation
            ? `Tracking: ${pipelineData.donation.foodName} (${pipelineData.donation.quantityKg} kg)`
            : 'Track your donation\'s journey from your kitchen to a shelter\'s table in real time.'}
        </p>

        {/* 4-Step Vertical Stepper OR Clean Empty State for New Donor */}
        {!hasActiveDonation && !showDemoPreview ? (
          <div className="py-10 px-4 text-center my-auto flex flex-col items-center justify-center bg-warm/50 rounded-2xl border border-warm-border/60">
            <div className="w-14 h-14 rounded-2xl bg-sage-100 text-sage-700 flex items-center justify-center mb-3 shadow-xs">
              <Heart className="w-7 h-7 text-sage-600 animate-pulse" />
            </div>
            <h3 className="font-display font-black text-base text-forest mb-1">
              No Active Donations Right Now
            </h3>
            <p className="text-xs text-forest/70 max-w-xs leading-relaxed mb-5">
              Ready to rescue food? Fill out the 30-Second Donation Form on the left to dispatch surplus meals.
            </p>
            <button
              type="button"
              onClick={() => setShowDemoPreview(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-warm-border text-xs font-bold text-forest hover:bg-sage-50 transition-all shadow-xs"
            >
              <span>Preview Live 4-Step Pipeline Demo</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {steps.map((st, idx) => {
              const isCompleted = st.status === 'completed';
              const isLive = st.status === 'live';

              return (
                <div
                  key={st.step || idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    isLive
                      ? 'bg-sage-50/80 border-sage-300 shadow-soft'
                      : isCompleted
                      ? 'bg-warm border-warm-border'
                      : 'bg-warm/40 border-warm-border/60 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {/* Step Icon Badge */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-700'
                            : isLive
                            ? 'bg-sage-400 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : isLive ? (
                          <Handshake className="w-5 h-5 animate-pulse" />
                        ) : idx === 2 ? (
                          <User className="w-5 h-5" />
                        ) : (
                          <Truck className="w-5 h-5" />
                        )}
                      </div>

                      {/* Step Info */}
                      <div>
                        <div className="text-sm font-bold text-forest flex items-center gap-2">
                          <span>{st.title}</span>
                          {isLive && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sage-200 text-sage-800 border border-sage-300 animate-pulse">
                              LIVE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-forest/70 mt-1 leading-relaxed">
                          {st.description}
                        </p>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <span className="text-[11px] font-semibold text-forest/50 whitespace-nowrap ml-2">
                      {st.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Illustration / Annotation */}
      <div className="mt-8 pt-6 border-t border-warm-border text-center">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-sage-700">
          <span>Real Food. Real Impact.</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
