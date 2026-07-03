import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png?url";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png?url";
import iconShadow from "leaflet/dist/images/marker-shadow.png?url";
import { COMPANY_INFO } from "../../../constants/company";

// Fix the default Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: iconUrl,
  iconRetinaUrl: iconRetinaUrl,
  shadowUrl: iconShadow,
});

interface ContactMapIslandProps {
  addressTranslation: string;
}

export default function ContactMapIsland({ addressTranslation }: ContactMapIslandProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const position: [number, number] = [
    COMPANY_INFO.coordinates.latitude,
    COMPANY_INFO.coordinates.longitude,
  ];

  if (!isMounted) return null;

  return (
    <div className="w-full h-full animate-fade-in-scale">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position}>
          <Popup>
            {COMPANY_INFO.name} <br /> {addressTranslation}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
