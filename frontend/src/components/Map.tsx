import React, { useEffect, useRef } from "react";

interface Location {
  _id: string;
  description: string;
  type: string;
  coordinates: number[];
  day: number;
}

interface MapProps {
  locations: Location[];
  tourName: string;
}

const Map: React.FC<MapProps> = ({ locations, tourName }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    // Load Mapbox script dynamically
    const loadMapbox = async () => {
      if (typeof window !== "undefined" && !window.mapboxgl) {
        const script = document.createElement("script");
        script.src = "https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.js";
        script.onload = initMap;
        document.head.appendChild(script);

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.css";
        document.head.appendChild(link);
      } else {
        initMap();
      }
    };

    const initMap = () => {
      if (!mapRef.current || !locations.length) return;

      // You'll need to add your Mapbox access token here
      const mapboxgl = (window as any).mapboxgl;
      if (!mapboxgl) return;

      // Replace with your actual Mapbox access token
      mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN";

      const bounds = new mapboxgl.LngLatBounds();

      // Add locations to bounds
      locations.forEach((location) => {
        bounds.extend(location.coordinates);
      });

      // Create map
      mapInstance.current = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        scrollZoom: false,
      });

      // Fit map to bounds
      mapInstance.current.fitBounds(bounds, {
        padding: {
          top: 200,
          bottom: 150,
          left: 100,
          right: 100,
        },
      });

      // Add markers for each location
      locations.forEach((location, index) => {
        const el = document.createElement("div");
        el.className = "marker";

        new mapboxgl.Marker({
          element: el,
          anchor: "bottom",
        })
          .setLngLat(location.coordinates)
          .setPopup(
            new mapboxgl.Popup({
              offset: 30,
            }).setHTML(
              `<h3>Day ${location.day}</h3><p>${location.description}</p>`
            )
          )
          .addTo(mapInstance.current);
      });

      // Add navigation controls
      mapInstance.current.addControl(new mapboxgl.NavigationControl());
    };

    loadMapbox();

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, [locations, tourName]);

  return (
    <section className="section-map">
      <div
        id="map"
        ref={mapRef}
        data-locations={JSON.stringify(locations)}
      ></div>
    </section>
  );
};

export default Map;
