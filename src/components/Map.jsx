import {
  TileLayer,
  MapContainer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import styles from "./map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "./hooks/useGeolocation";
import Button from "./Button";
import useUrlPosition from "./hooks/useUrlPosition";

function Map() {
  const [lat, lng] = useUrlPosition();

  const [position, setPosition] = useState([36.2605, 59.6168]);
  const { cities } = useCities();
  const { isLoading, getPosition, position: geoPosition } = useGeolocation();

  useEffect(() => {
    if (lat && lng) setPosition([lat, lng]);
  }, [lat, lng]);

  useEffect(() => {
    if (geoPosition) setPosition([geoPosition.lat, geoPosition.lng]);
  }, [geoPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geoPosition && (
        <Button type={"position"} onclick={getPosition}>
          {isLoading ? "Loading ..." : "Use your position"}
        </Button>
      )}
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        className={`leaflet-container ${styles.map}`}
      >
        <TileLayer
          url="https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}"
          attribution=""
          minZoom={0}
          maxZoom={22}
          accessToken="xUYdIoKcs1WnLyRxVk54tUoy81cFrz9ASUZMLyxVA9vubtuuju0CdgkaDYUzw3Dk"
        />

        {cities.map((city) => (
          <Marker position={city.position} key={city.id}>
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={[position[0], position[1]]} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.flyTo(position);
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
