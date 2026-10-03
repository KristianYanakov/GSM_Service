import { useEffect, useState } from "react";
import {
  Container, Typography, Grid, Paper, Box, ImageList, ImageListItem, Alert,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getLocations, getGallery, getShopInfo } from "../api/shopInfo";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Fix default marker icon issue with Leaflet + bundlers (Vite/Webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Forces Leaflet to recalculate its container size after the surrounding
// MUI Grid/Box layout has settled — without this, the map can render
// with 0 width and appear completely blank.
function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
}

function LocationPage() {
  const [locations, setLocations] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [shopInfo, setShopInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getLocations(), getGallery(), getShopInfo()])
      .then(([locRes, galRes, infoRes]) => {
        const locData = Array.isArray(locRes.data) ? locRes.data : locRes.data.results;
        const galData = Array.isArray(galRes.data) ? galRes.data : galRes.data.results;
        setLocations(locData || []);
        setGallery(galData || []);
        setShopInfo(infoRes.data);
      })
      .catch(() => setError("Failed to load location info."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const mainLocation = locations[0];

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Visit Us</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {shopInfo && (
        <Typography variant="body1" sx={{ mb: 3 }}>
          {shopInfo.about_text}
        </Typography>
      )}

      {mainLocation && (
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom>{mainLocation.name}</Typography>
              <Typography variant="body1">{mainLocation.address}</Typography>
              {mainLocation.phone && (
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Phone: {mainLocation.phone}
                </Typography>
              )}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Working Hours</Typography>
                <Typography variant="body2">
                  {mainLocation.workdays_text}: {mainLocation.working_hours_weekdays}
                </Typography>
                <Typography variant="body2">
                  Weekends: {mainLocation.working_hours_weekends || "Closed"}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ height: 350, width: "100%", borderRadius: 2, overflow: "hidden" }}>
              <MapContainer
                center={[parseFloat(mainLocation.latitude), parseFloat(mainLocation.longitude)]}
                zoom={16}
                style={{ height: "100%", width: "100%" }}
              >
                <MapResizeHandler />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <Marker position={[parseFloat(mainLocation.latitude), parseFloat(mainLocation.longitude)]}>
                  <Popup>{mainLocation.name}</Popup>
                </Marker>
              </MapContainer>
            </Box>
          </Grid>
        </Grid>
      )}

      {gallery.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>Gallery</Typography>
          <ImageList cols={3} gap={12}>
            {gallery.map((img) => (
              <ImageListItem key={img.id}>
                <img
                  src={img.image}
                  alt={img.caption || "Shop photo"}
                  loading="lazy"
                  style={{ borderRadius: 8 }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      )}
    </Container>
  );
}

export default LocationPage;