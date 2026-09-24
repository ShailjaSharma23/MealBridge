import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Navigation, MapPin } from 'lucide-react';

const VolunteerMap = ({ activeJob }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const pickupLat = activeJob?.pickup?.lat || 28.5582;
  const pickupLng = activeJob?.pickup?.lng || 77.2023;
  const dropoffLat = activeJob?.dropoff?.lat || 28.5677;
  const dropoffLng = activeJob?.dropoff?.lng || 77.2433;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing map instance if already initialized
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Map
    const map = L.map(mapContainerRef.current, {
      center: [(pickupLat + dropoffLat) / 2, (pickupLng + dropoffLng) / 2],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: false,
    });
    mapInstanceRef.current = map;

    // Tile Layer: CartoDB Positron for clean modern light map
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Custom HTML divIcon for Pickup (Sunburst Amber)
    const pickupIcon = L.divIcon({
      className: 'custom-map-marker-pickup',
      html: `
        <div style="background-color: #F59E0B; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(245, 158, 11, 0.4); border: 2px solid white; font-weight: bold; font-size: 14px;">
          🏪
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    // Custom HTML divIcon for Dropoff (Sage Green)
    const dropoffIcon = L.divIcon({
      className: 'custom-map-marker-dropoff',
      html: `
        <div style="background-color: #8BA888; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(139, 168, 136, 0.4); border: 2px solid white; font-weight: bold; font-size: 14px;">
          🏠
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    // Pickup Marker
    const pickupMarker = L.marker([pickupLat, pickupLng], { icon: pickupIcon }).addTo(map);
    pickupMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
        <strong style="color: #1E352F;">Pickup: ${activeJob?.pickup?.name || 'Bistro 42'}</strong><br/>
        <span style="color: #6B7280;">${activeJob?.pickup?.address || '123 Green Park'}</span>
      </div>
    `);

    // Dropoff Marker
    const dropoffMarker = L.marker([dropoffLat, dropoffLng], { icon: dropoffIcon }).addTo(map);
    dropoffMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
        <strong style="color: #1E352F;">Dropoff: ${activeJob?.dropoff?.name || 'Hope Shelter'}</strong><br/>
        <span style="color: #6B7280;">${activeJob?.dropoff?.address || 'Lajpat Nagar'}</span>
      </div>
    `);

    // Polyline Route connecting Pickup & Dropoff
    const routeCoordinates = [
      [pickupLat, pickupLng],
      [pickupLat + 0.004, (pickupLng + dropoffLng) / 2],
      [dropoffLat, dropoffLng],
    ];

    const polyline = L.polyline(routeCoordinates, {
      color: '#8BA888',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8',
      lineCap: 'round',
    }).addTo(map);

    // Fit map bounds to show full route
    const group = L.featureGroup([pickupMarker, dropoffMarker, polyline]);
    map.fitBounds(group.getBounds().pad(0.2));

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [pickupLat, pickupLng, dropoffLat, dropoffLng, activeJob]);

  return (
    <div className="relative w-full h-[340px] rounded-3xl overflow-hidden border border-warm-border shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Route Info Badge */}
      <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-warm-border shadow-md flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center">
          <Navigation className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-forest">Live Rescue Route</div>
          <div className="text-xs font-extrabold text-sage-700">
            {activeJob?.pickup?.name || 'Bistro 42'} &rarr; {activeJob?.dropoff?.name || 'Hope Shelter'}
          </div>
        </div>
      </div>

      {/* Bottom Route Summary Pill */}
      <div className="absolute bottom-4 right-4 z-[400] bg-forest/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-semibold shadow-md flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-sunburst-400" />
        <span>Total Distance: ~3.7 km • Est. 14 mins</span>
      </div>
    </div>
  );
};

export default VolunteerMap;
