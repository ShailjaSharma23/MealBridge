import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Activity } from 'lucide-react';

const CityRescueMap = ({ heatmapPoints, stats }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const defaultPoints = [
    { id: 1, name: 'Bistro 42', area: 'Green Park', lat: 28.5582, lng: 77.2023, activity: 'High', type: 'donor' },
    { id: 2, name: 'Hope Shelter', area: 'Lajpat Nagar', lat: 28.5677, lng: 77.2433, activity: 'High', type: 'shelter' },
    { id: 3, name: 'Green Valley Cafe', area: 'Hauz Khas', lat: 28.5494, lng: 77.2001, activity: 'Medium', type: 'donor' },
    { id: 4, name: 'City Bites', area: 'Connaught Place', lat: 28.6315, lng: 77.2167, activity: 'High', type: 'donor' },
    { id: 5, name: 'Fresh Bites Bakery', area: 'Karol Bagh', lat: 28.6521, lng: 77.1906, activity: 'Medium', type: 'donor' },
    { id: 6, name: 'Sunshine Food Bank', area: 'Civil Lines', lat: 28.6814, lng: 77.2228, activity: 'Medium', type: 'shelter' },
    { id: 7, name: 'Care Haven Shelter', area: 'Dwarka', lat: 28.5921, lng: 77.046, activity: 'High', type: 'shelter' },
    { id: 8, name: 'Taste Hub Kitchen', area: 'Rohini', lat: 28.7041, lng: 77.1025, activity: 'High', type: 'donor' },
  ];

  const points = heatmapPoints && heatmapPoints.length > 0 ? heatmapPoints : defaultPoints;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Center over Delhi NCR
    const map = L.map(mapContainerRef.current, {
      center: [28.6139, 77.209],
      zoom: 11,
      scrollWheelZoom: false,
    });
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 18,
    }).addTo(map);

    const markersGroup = L.featureGroup();

    points.forEach((pt) => {
      const isDonor = pt.type === 'donor';
      const bgColor = isDonor ? '#F59E0B' : '#8BA888';
      const iconEmoji = isDonor ? '🏪' : '🏠';

      const customIcon = L.divIcon({
        className: 'city-heatmap-marker',
        html: `
          <div style="background-color: ${bgColor}; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.25); border: 2px solid white; font-size: 14px;">
            ${iconEmoji}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      // Marker
      const marker = L.marker([pt.lat, pt.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
          <strong style="color: #1E352F;">${pt.name}</strong><br/>
          <span style="color: #6B7280;">${pt.area} • ${isDonor ? 'Donor Kitchen' : 'Shelter Hub'}</span><br/>
          <span style="color: ${bgColor}; font-weight: bold;">Activity: ${pt.activity}</span>
        </div>
      `);
      markersGroup.addLayer(marker);

      // Activity density circle
      L.circle([pt.lat, pt.lng], {
        radius: pt.activity === 'High' ? 1400 : 900,
        color: bgColor,
        fillColor: bgColor,
        fillOpacity: 0.15,
        weight: 1,
      }).addTo(map);
    });

    map.fitBounds(markersGroup.getBounds().pad(0.15));

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [points]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-warm-border shadow-card mt-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="text-xs font-semibold text-sage-600 tracking-wider">
            Spatial Distribution
          </div>
          <h3 className="font-display font-black text-xl sm:text-2xl text-forest">
            City Rescue Density & Routing Hotspots
          </h3>
          <p className="text-xs text-forest/60 mt-0.5">
            Real-time surplus pickup nodes and shelter intake distribution across Delhi NCR.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-bold text-forest">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sunburst-500 shadow-xs" />
            <span>Donor Hubs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sage-500 shadow-xs" />
            <span>Shelter Hubs</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-warm-border shadow-sm">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating City Analytics Card */}
        <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-warm-border shadow-md max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="text-xs font-black text-forest">Active Metro Routing</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-forest/70">
            <div>
              <span className="text-forest font-black block text-sm">
                {stats?.activeLocations || 48}
              </span>
              <span>Active Nodes</span>
            </div>
            <div>
              <span className="text-forest font-black block text-sm">
                {stats?.ongoingPickups || 23}
              </span>
              <span>Ongoing Routes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityRescueMap;
