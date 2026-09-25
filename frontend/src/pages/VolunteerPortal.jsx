import React, { useState, useEffect } from 'react';
import JobFilterTabs from '../components/VolunteerComponents/JobFilterTabs.jsx';
import ActiveJobCard from '../components/VolunteerComponents/ActiveJobCard.jsx';
import AvailableJobList from '../components/VolunteerComponents/AvailableJobList.jsx';
import VolunteerStats from '../components/VolunteerComponents/VolunteerStats.jsx';
import apiClient from '../services/apiClient';

const VolunteerPortal = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeJob, setActiveJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [counts, setCounts] = useState({ all: 6, near: 3, urgent: 2 });

  // Default fallback data for initial hydration
  const fallbackActiveJob = {
    _id: 'job-104',
    jobCode: 'JOB-104',
    isUrgent: true,
    pickup: {
      name: 'Bistro 42',
      address: '123, Green Park, Sector 12, New Delhi',
      distance: '1.2 km away',
      lat: 28.5582,
      lng: 77.2023,
    },
    dropoff: {
      name: 'Hope Shelter',
      address: 'Community Hall 4, Lajpat Nagar, New Delhi',
      distance: '2.5 km away',
      lat: 28.5677,
      lng: 77.2433,
    },
    food: {
      weight: '15 kg',
      category: 'Cooked Food',
      name: '15kg Cooked Rice & Curry',
      hoursRemaining: '2.5 hours remaining',
    },
    status: 'volunteer_assigned',
  };

  const fallbackJobs = [
    {
      _id: 'job-105',
      jobCode: 'JOB-105',
      pickupLocation: { name: 'Green Valley Cafe', distanceKm: 2.4 },
      dropoffLocation: { name: 'Sunshine Community Home', distanceKm: 1.8 },
      foodDetails: { name: '12kg Vegetable Pasta', category: 'Cooked Food', quantityKg: 12, hoursRemaining: '2.0 hrs' },
      isUrgent: true,
    },
    {
      _id: 'job-106',
      jobCode: 'JOB-106',
      pickupLocation: { name: 'City Bites', distanceKm: 1.1 },
      dropoffLocation: { name: 'Aashray Shelter', distanceKm: 3.2 },
      foodDetails: { name: '10kg Dal & Rice', category: 'Cooked Meals', quantityKg: 10, hoursRemaining: '3.0 hrs' },
      isUrgent: false,
    },
    {
      _id: 'job-107',
      jobCode: 'JOB-107',
      pickupLocation: { name: 'Fresh Bites Bakery', distanceKm: 2.7 },
      dropoffLocation: { name: 'Hope Shelter', distanceKm: 2.5 },
      foodDetails: { name: '8kg Veg Sandwiches', category: 'Bakery', quantityKg: 8, hoursRemaining: '1.5 hrs' },
      isUrgent: true,
    },
    {
      _id: 'job-108',
      jobCode: 'JOB-108',
      pickupLocation: { name: 'Taste Hub', distanceKm: 4.2 },
      dropoffLocation: { name: 'Lajpat Care Home', distanceKm: 2.1 },
      foodDetails: { name: '20kg Mixed Veg Curry', category: 'Cooked Meals', quantityKg: 20, hoursRemaining: '3.5 hrs' },
      isUrgent: false,
    },
  ];

  const fetchActiveJob = async () => {
    try {
      const res = await apiClient.get('/volunteers/active-job');
      if (res.data.success && res.data.activeJob) {
        setActiveJob(res.data.activeJob);
      } else {
        setActiveJob(fallbackActiveJob);
      }
    } catch (err) {
      console.warn('Using fallback active job:', err.message);
      setActiveJob(fallbackActiveJob);
    }
  };

  const fetchJobs = async (filterType = 'all') => {
    try {
      const res = await apiClient.get(`/volunteers/jobs?filter=${filterType}`);
      if (res.data.success && res.data.jobs) {
        setJobs(res.data.jobs);
      } else {
        setJobs(fallbackJobs);
      }
    } catch (err) {
      console.warn('Using fallback available jobs:', err.message);
      setJobs(fallbackJobs);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await apiClient.get('/volunteers/stats');
      if (res.data.success && res.data.stats) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.warn('Using fallback volunteer stats:', err.message);
    }
  };

  useEffect(() => {
    fetchActiveJob();
    fetchJobs(activeFilter);
    fetchStats();
  }, []);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    fetchJobs(filterId);
  };

  const handleJobClaimed = () => {
    fetchJobs(activeFilter);
    fetchActiveJob();
  };

  const handleJobUpdated = () => {
    fetchActiveJob();
    fetchJobs(activeFilter);
    fetchStats();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Header Section matching Photo 4 */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-sage-600 tracking-wider mb-1">
          Every Delivery Feeds Hope • Real-Time Routing
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-forest tracking-tight">
          Volunteer <span className="text-sunburst-500">Rescue Board</span>
        </h1>
        <p className="text-xs sm:text-sm text-forest/70 mt-1 max-w-2xl">
          Pick up surplus food from donors and deliver directly to verified shelters in your neighborhood.
        </p>
      </div>

      {/* 2. Top Banner: Active Rescue Dispatch #JOB-104 with Leaflet Route Map */}
      <ActiveJobCard activeJob={activeJob || fallbackActiveJob} onJobUpdated={handleJobUpdated} />

      {/* 3. Section: Available Rescue Missions */}
      <div className="mt-12 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl text-forest">
            Available Rescue Missions
          </h2>
          <p className="text-xs text-forest/60">
            Accept open food rescue dispatches nearby.
          </p>
        </div>

        {/* Filter Tabs */}
        <JobFilterTabs
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          counts={counts}
        />
      </div>

      {/* 4. Available Jobs Grid */}
      <AvailableJobList jobs={jobs.length > 0 ? jobs : fallbackJobs} onJobClaimed={handleJobClaimed} />

      {/* 5. Volunteer Milestones & Stats */}
      <VolunteerStats stats={stats} />
    </div>
  );
};

export default VolunteerPortal;
