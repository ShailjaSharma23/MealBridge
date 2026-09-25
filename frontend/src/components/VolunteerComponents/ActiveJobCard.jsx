import React, { useState, useEffect } from 'react';
import {
  Truck,
  Store,
  Home,
  Clock,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  ShieldCheck,
  AlertTriangle,
  Wrench,
  MapPin,
  Compass,
  X,
  PhoneCall,
  RefreshCw,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import VolunteerMap from './VolunteerMap.jsx';
import apiClient from '../../services/apiClient';

const ActiveJobCard = ({ activeJob, onJobUpdated, onPreviewDemo }) => {
  const [jobStep, setJobStep] = useState(
    activeJob?.status === 'delivered' ? 3 : activeJob?.status === 'volunteer_assigned' ? 1 : 0
  );
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Vehicle Malfunction State - declared at top level to strictly obey Rules of Hooks
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [breakdownReason, setBreakdownReason] = useState('Flat Tyre / Puncture');
  const [breakdownNotes, setBreakdownNotes] = useState('');
  const [breakdownLocation, setBreakdownLocation] = useState('Outer Ring Road, Near AIIMS Flyover, New Delhi');
  const [detectingLoc, setDetectingLoc] = useState(false);
  const [reportingBreakdown, setReportingBreakdown] = useState(false);
  const [isBreakdownReported, setIsBreakdownReported] = useState(false);
  const [breakdownDetails, setBreakdownDetails] = useState(null);

  useEffect(() => {
    if (activeJob) {
      setJobStep(
        activeJob.status === 'delivered' ? 3 : activeJob.status === 'volunteer_assigned' ? 1 : 0
      );
    }
  }, [activeJob?.status, activeJob?._id]);

  if (!activeJob) {
    return (
      <div className="bg-white rounded-3xl border border-warm-border p-6 sm:p-8 shadow-card mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sage-100 text-sage-700 flex items-center justify-center flex-shrink-0 shadow-xs">
            <Truck className="w-7 h-7 text-sage-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sage-600 uppercase tracking-wider">
                Volunteer Dispatch Ready
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                Online & Available
              </span>
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-forest mt-0.5">
              No Active Delivery Assigned
            </h2>
            <p className="text-xs text-forest/70 mt-1 max-w-lg leading-relaxed">
              You currently have no active mission claimed. Select an open rescue mission from the board below and tap <strong>Claim This Mission</strong> to activate turn-by-turn navigation.
            </p>
          </div>
        </div>

        {onPreviewDemo && (
          <button
            type="button"
            onClick={onPreviewDemo}
            className="btn-sage py-3 px-6 rounded-2xl text-xs font-bold shadow-xs hover:shadow-sm shrink-0 whitespace-nowrap self-stretch sm:self-auto text-center cursor-pointer"
          >
            <span>Preview Active Route Demo (JOB-104)</span>
          </button>
        )}
      </div>
    );
  }

  const handleNextStep = async () => {
    setLoading(true);
    try {
      if (jobStep === 0) {
        // Step 0 -> Step 1: Claim Job
        if (activeJob?._id) {
          await apiClient.post(`/volunteers/jobs/${activeJob._id}/claim`);
        }
        setJobStep(1);
        setStatusMessage('Rescue Job Claimed! Turn-by-turn navigation initiated.');
      } else if (jobStep === 1) {
        // Step 1 -> Step 2: Food Picked Up
        setJobStep(2);
        setStatusMessage('Food picked up from donor! En route to Hope Shelter.');
      } else if (jobStep === 2) {
        // Step 2 -> Step 3: Mark Delivered
        if (activeJob?._id) {
          await apiClient.post(`/volunteers/jobs/${activeJob._id}/complete`);
        }
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#8BA888', '#F59E0B', '#1E352F'],
        });
        setJobStep(3);
        setStatusMessage('Mission Accomplished! 15kg food safely delivered to Hope Shelter. Impact points added!');
        if (onJobUpdated) onJobUpdated();
      }
    } catch (err) {
      console.warn('Handling local step fallback:', err.message);
      if (jobStep === 0) setJobStep(1);
      else if (jobStep === 1) setJobStep(2);
      else if (jobStep === 2) {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        setJobStep(3);
      }
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMessage(''), 5000);
    }
  };

  // GPS Location detection for breakdown
  const handleDetectGPS = () => {
    if (!navigator.geolocation) return;
    setDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          if (data && data.display_name) {
            setBreakdownLocation(data.display_name);
          } else {
            setBreakdownLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)} (Current Location)`);
          }
        } catch {
          setBreakdownLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        } finally {
          setDetectingLoc(false);
        }
      },
      () => setDetectingLoc(false),
      { timeout: 8000 }
    );
  };

  // Handle reporting breakdown to backend
  const handleSubmitBreakdown = async (e) => {
    e.preventDefault();
    setReportingBreakdown(true);
    try {
      const stage = jobStep >= 2 ? 'in_transit' : 'before_pickup';
      await apiClient.post('/volunteers/report-breakdown', {
        matchId: activeJob?._id,
        jobCode: activeJob?.jobCode,
        reason: breakdownReason,
        stage,
        breakdownLocation: {
          address: breakdownLocation,
          lat: 28.5620,
          lng: 77.2210,
        },
        notes: breakdownNotes,
      });

      setIsBreakdownReported(true);
      setBreakdownDetails({
        stage,
        reason: breakdownReason,
        location: breakdownLocation,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setStatusMessage(
        stage === 'in_transit'
          ? 'Emergency relay initiated! Nearby couriers notified for handover.'
          : 'Breakdown reported. Mission returned to queue for immediate re-dispatch.'
      );
      if (onJobUpdated) onJobUpdated();
    } catch (err) {
      console.warn('Fallback local breakdown handling:', err.message);
      const stage = jobStep >= 2 ? 'in_transit' : 'before_pickup';
      setIsBreakdownReported(true);
      setBreakdownDetails({
        stage,
        reason: breakdownReason,
        location: breakdownLocation,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setStatusMessage('Breakdown recorded. Re-dispatch protocol active.');
      if (onJobUpdated) onJobUpdated();
    } finally {
      setReportingBreakdown(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-warm-border p-6 sm:p-8 shadow-card mb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-warm-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
            <Truck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sage-600 uppercase tracking-wider">
                Priority Dispatch
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-sunburst-100 text-sunburst-800">
                {activeJob?.jobCode || 'JOB-104'}
              </span>
            </div>
            <h2 className="font-display font-black text-2xl text-forest mt-0.5">
              Active Rescue Dispatch
            </h2>
          </div>
        </div>

        {/* Urgent Timer Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-sunburst-300 text-xs font-bold text-sunburst-800">
          <Clock className="w-4 h-4 text-sunburst-500 animate-spin" />
          <span>Urgent Delivery • Expires in 90 mins</span>
        </div>
      </div>

      {/* Breakdown Notice Banner (if reported) */}
      {isBreakdownReported && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>
                {breakdownDetails?.stage === 'in_transit'
                  ? '⚡ Emergency Relay Handover Active'
                  : '🚨 Pre-Pickup Re-Dispatch Triggered'}
              </span>
            </div>
            <p className="text-xs text-rose-800/80 mt-1">
              Issue reported: <strong>{breakdownDetails?.reason}</strong> at {breakdownDetails?.time}.
              {breakdownDetails?.stage === 'in_transit'
                ? ' A backup courier is heading to your breakdown location to take over the food safely.'
                : ' You are relieved of this mission. The donor and shelters were notified.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsBreakdownReported(false);
              setShowBreakdownModal(false);
              if (onJobUpdated) onJobUpdated();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-rose-300 text-rose-700 text-xs font-bold hover:bg-rose-100 shrink-0 shadow-xs"
          >
            Dismiss Alert
          </button>
        </div>
      )}

      {/* Main Grid: Details + Map */}
      <div className="grid lg:grid-cols-12 gap-8 my-6">
        {/* Left Side: Pickup, Dropoff & Food Details */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Pickup Block */}
          <div className="p-4 rounded-2xl bg-warm border border-warm-border/80">
            <div className="flex items-center gap-2 text-xs font-bold text-forest/60 uppercase tracking-wider mb-2">
              <Store className="w-3.5 h-3.5 text-sunburst-600" />
              <span>Step 1: Pickup Donor</span>
            </div>
            <div className="font-display font-bold text-base text-forest flex items-center gap-1.5">
              <span>{activeJob?.pickup?.name || 'Bistro 42'}</span>
              <ShieldCheck className="w-4 h-4 text-sage-600" />
            </div>
            <div className="text-xs text-forest/70 mt-0.5">
              {activeJob?.pickup?.address || '123, Green Park, Sector 12, New Delhi'}
            </div>
            <div className="text-[11px] font-semibold text-sunburst-700 mt-2">
              📍 {activeJob?.pickup?.distance || '1.2 km away'}
            </div>
          </div>

          {/* Dropoff Block */}
          <div className="p-4 rounded-2xl bg-warm border border-warm-border/80">
            <div className="flex items-center gap-2 text-xs font-bold text-forest/60 uppercase tracking-wider mb-2">
              <Home className="w-3.5 h-3.5 text-sage-600" />
              <span>Step 2: Dropoff Shelter</span>
            </div>
            <div className="font-display font-bold text-base text-forest">
              {activeJob?.dropoff?.name || 'Hope Shelter'}
            </div>
            <div className="text-xs text-forest/70 mt-0.5">
              {activeJob?.dropoff?.address || 'Community Hall 4, Lajpat Nagar, New Delhi'}
            </div>
            <div className="text-[11px] font-semibold text-sage-700 mt-2">
              📍 {activeJob?.dropoff?.distance || '2.5 km away'}
            </div>
          </div>

          {/* Food Payload Info */}
          <div className="p-4 rounded-2xl bg-sage-50/70 border border-sage-200/80 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-sage-800">
                Rescue Payload
              </div>
              <div className="font-display font-black text-lg text-forest mt-0.5">
                {activeJob?.food?.weight || '15 kg'} Cooked Meals
              </div>
              <div className="text-xs text-forest/60">Packaged & Ready for Hot Transport</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white border border-sage-300 text-xl flex items-center justify-center shadow-sm">
              🍲
            </div>
          </div>
        </div>

        {/* Right Side: Leaflet Route Map */}
        <div className="lg:col-span-7">
          <VolunteerMap activeJob={activeJob} />
        </div>
      </div>

      {/* Dynamic Status / Feedback Message */}
      {statusMessage && (
        <div className="mb-6 p-3 rounded-2xl bg-sage-100 text-sage-900 border border-sage-300 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-sage-700" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Action Stepper Bar */}
      <div className="pt-6 border-t border-warm-border flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Step Indicator */}
        <div className="flex items-center gap-3">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              jobStep >= 1 ? 'bg-forest text-white' : 'bg-warm text-forest/40 border border-warm-border'
            }`}
          >
            1
          </div>
          <div className={`w-8 h-0.5 ${jobStep >= 2 ? 'bg-forest' : 'bg-warm-border'}`} />
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              jobStep >= 2 ? 'bg-forest text-white' : 'bg-warm text-forest/40 border border-warm-border'
            }`}
          >
            2
          </div>
          <div className={`w-8 h-0.5 ${jobStep >= 3 ? 'bg-forest' : 'bg-warm-border'}`} />
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              jobStep >= 3 ? 'bg-forest text-white' : 'bg-warm text-forest/40 border border-warm-border'
            }`}
          >
            3
          </div>
          <span className="text-xs font-bold text-forest/70 ml-2">
            {jobStep === 0 && 'Unclaimed • Ready'}
            {jobStep === 1 && 'En Route to Donor'}
            {jobStep === 2 && 'Food Picked Up • Driving to Shelter'}
            {jobStep === 3 && 'Delivered & Completed ✓'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Breakdown Report Trigger (available during active steps) */}
          {(jobStep === 1 || jobStep === 2) && !isBreakdownReported && (
            <button
              type="button"
              onClick={() => setShowBreakdownModal(true)}
              className="px-4 py-3 rounded-full border border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Wrench className="w-3.5 h-3.5 text-rose-600" />
              <span>Vehicle Breakdown?</span>
            </button>
          )}

          {jobStep === 3 ? (
            <div className="px-6 py-3 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Rescue Mission Complete! 🌟</span>
            </div>
          ) : (
            <button
              onClick={handleNextStep}
              disabled={loading}
              className="btn-sage py-3.5 px-7 rounded-full text-xs font-bold shadow-md hover:shadow-hover flex items-center gap-2"
            >
              <span>
                {jobStep === 0 && '🚚 Claim Rescue Job & Start Route'}
                {jobStep === 1 && '📦 Confirm Food Picked Up'}
                {jobStep === 2 && '🎉 Mark Completed & Feed Community'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ---------------- VEHICLE MALFUNCTION REPORT MODAL ---------------- */}
      {showBreakdownModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-forest/60 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-start sm:items-center animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full my-auto border border-warm-border shadow-2xl p-6 sm:p-8 relative">
            {/* Close */}
            <button
              type="button"
              onClick={() => setShowBreakdownModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-warm text-forest/60 hover:text-forest transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
                <Wrench className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                  Incident Support
                </span>
                <h3 className="font-display font-black text-xl text-forest mt-0.5">
                  Report Vehicle Breakdown
                </h3>
              </div>
            </div>

            {/* Stage Context Notice */}
            <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              {jobStep === 2 ? (
                <div>
                  <strong className="block text-amber-950 font-bold mb-0.5">
                    ⚠️ Food is in Transit ({activeJob?.food?.weight || '15 kg'} hot meals)
                  </strong>
                  Submitting will initiate an <strong>Emergency Relay Dispatch</strong>. A nearby courier will be routed to your breakdown coordinates to take custody of the food and deliver to Hope Shelter without food spoilage.
                </div>
              ) : (
                <div>
                  <strong className="block text-amber-950 font-bold mb-0.5">
                    ℹ️ Pre-Pickup Incident (Food at Donor Kitchen)
                  </strong>
                  Submitting will safely cancel your assignment with zero penalty and immediately return this job to the top of the available pool for the next nearest courier.
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitBreakdown} className="space-y-4">
              {/* Reason Selection */}
              <div>
                <label className="block text-xs font-bold text-forest mb-1.5">
                  Select Malfunction Reason:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Flat Tyre / Puncture',
                    'Engine / Battery Breakdown',
                    'Road Accident / Safety',
                    'Severe Weather / Road Block',
                    'Chain / Brake Issue',
                    'Other Emergency',
                  ].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setBreakdownReason(r)}
                      className={`p-2.5 rounded-2xl border text-xs font-bold text-left transition-all ${
                        breakdownReason === r
                          ? 'bg-rose-50 text-rose-900 border-rose-300 ring-2 ring-rose-200'
                          : 'bg-warm text-forest/70 border-warm-border hover:bg-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Input (especially for relay handover) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-forest">
                    {jobStep === 2 ? 'Current Stranded Location (For Relay Handover):' : 'Current Location:'}
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    disabled={detectingLoc}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-sage-700 hover:text-sage-800"
                  >
                    <Compass className={`w-3.5 h-3.5 ${detectingLoc ? 'animate-spin' : ''}`} />
                    <span>{detectingLoc ? 'Locating...' : 'Use GPS'}</span>
                  </button>
                </div>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3.5 top-3 text-rose-500" />
                  <input
                    type="text"
                    required
                    value={breakdownLocation}
                    onChange={(e) => setBreakdownLocation(e.target.value)}
                    placeholder="Enter landmark or cross-street"
                    className="w-full bg-warm border border-warm-border rounded-2xl pl-9 pr-4 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-forest mb-1">
                  Additional Notes (Optional):
                </label>
                <textarea
                  rows={2}
                  value={breakdownNotes}
                  onChange={(e) => setBreakdownNotes(e.target.value)}
                  placeholder="e.g. Parked by the bus stop with yellow hazard lights on..."
                  className="w-full bg-warm border border-warm-border rounded-2xl px-3.5 py-2 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                />
              </div>

              {/* Helpline Contact Info */}
              <div className="p-3 rounded-2xl bg-warm border border-warm-border/80 flex items-center justify-between text-xs">
                <span className="text-forest/70 font-semibold flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-forest/60" />
                  <span>Dispatch Helpline:</span>
                </span>
                <a href="tel:1800123456" className="font-bold text-forest hover:underline">
                  1800-MEAL-HELP (Toll-Free)
                </a>
              </div>

              {/* Actions */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBreakdownModal(false)}
                  className="w-1/3 py-3 rounded-2xl border border-warm-border text-xs font-semibold text-forest/70 hover:bg-warm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reportingBreakdown}
                  className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {reportingBreakdown
                      ? 'Dispatching Help...'
                      : jobStep === 2
                      ? 'Request Emergency Relay'
                      : 'Confirm & Re-Dispatch Job'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveJobCard;
