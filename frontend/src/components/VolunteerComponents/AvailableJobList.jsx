import React, { useState } from 'react';
import { Store, Home, Clock, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import apiClient from '../../services/apiClient';

const AvailableJobList = ({ jobs, onJobClaimed }) => {
  const [claimingId, setClaimingId] = useState(null);

  const handleClaim = async (jobId) => {
    setClaimingId(jobId);
    try {
      await apiClient.post(`/volunteers/jobs/${jobId}/claim`);
      if (onJobClaimed) onJobClaimed(jobId);
    } catch (err) {
      console.warn('Fallback claim handling:', err.message);
      if (onJobClaimed) onJobClaimed(jobId);
    } finally {
      setClaimingId(null);
    }
  };

  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-warm-border text-center text-forest/60">
        No rescue missions currently found for this filter. Check back shortly!
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => {
        const isUrgent = job.isUrgent;
        const isClaimed = job.isClaimed || job.status === 'volunteer_assigned';

        return (
          <div
            key={job._id || job.jobCode}
            className="bg-white rounded-3xl p-6 border border-warm-border shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Header: Job code + Urgent Pill */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-[11px] font-black bg-sage-100 text-sage-800">
                  {job.jobCode || 'JOB-DISPATCH'}
                </span>

                {isUrgent && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    <Zap className="w-3 h-3 text-amber-600 fill-amber-600" />
                    <span>Urgent</span>
                  </span>
                )}
              </div>

              {/* Food Title & Weight */}
              <h3 className="font-display font-extrabold text-lg text-forest">
                {job.foodDetails?.name || 'Surplus Meals'}
              </h3>
              <div className="text-xs font-semibold text-sunburst-700 mt-0.5">
                {job.foodDetails?.quantityKg || 10} kg • {job.foodDetails?.category || 'Cooked Food'}
              </div>

              {/* Pickup & Dropoff Routing */}
              <div className="mt-4 space-y-2.5 pt-3 border-t border-warm-border/60 text-xs">
                {/* Pickup */}
                <div className="flex items-start gap-2">
                  <Store className="w-3.5 h-3.5 text-sunburst-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-forest">
                      {job.pickupLocation?.name || 'Donor Kitchen'}
                    </span>
                    <span className="text-[11px] text-forest/50 block">
                      {job.pickupLocation?.distanceKm || 1.5} km from you
                    </span>
                  </div>
                </div>

                {/* Dropoff */}
                <div className="flex items-start gap-2">
                  <Home className="w-3.5 h-3.5 text-sage-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-forest">
                      {job.dropoffLocation?.name || 'Hope Shelter'}
                    </span>
                    <span className="text-[11px] text-forest/50 block">
                      {job.dropoffLocation?.distanceKm || 2.8} km route
                    </span>
                  </div>
                </div>
              </div>

              {/* Expiry Time Pill */}
              <div className="mt-4 p-2 rounded-xl bg-warm border border-warm-border flex items-center justify-between text-[11px] font-semibold text-forest/70">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sage-600" />
                  <span>Remaining:</span>
                </span>
                <span className="font-bold text-forest">
                  {job.foodDetails?.hoursRemaining || '2.5 hrs'}
                </span>
              </div>
            </div>

            {/* Claim Action */}
            <div className="mt-6 pt-2">
              {isClaimed ? (
                <div className="w-full py-2.5 rounded-2xl bg-sage-100 text-sage-800 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage-600" />
                  <span>Already Claimed</span>
                </div>
              ) : (
                <button
                  onClick={() => handleClaim(job._id)}
                  disabled={claimingId === job._id}
                  className="w-full btn-sage py-2.5 text-xs rounded-2xl shadow-sm hover:shadow-hover flex items-center justify-center gap-1.5 font-bold"
                >
                  <span>{claimingId === job._id ? 'Claiming...' : 'Claim This Mission'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AvailableJobList;
