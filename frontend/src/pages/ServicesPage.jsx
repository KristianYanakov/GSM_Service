import { useEffect, useState } from "react";
import {
  Container, Typography, Grid, Card, CardContent, Chip, Box, Alert,
} from "@mui/material";
import { getServices } from "../api/services";
import LoadingSpinner from "../components/common/LoadingSpinner";

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getServices()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setServices(data || []);
      })
      .catch(() => setError("Failed to load services."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  // Group services by category for nicer display
  const grouped = services.reduce((acc, service) => {
    const categoryName = service.category?.name || "Other";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(service);
    return acc;
  }, {});

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Our Services</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {Object.entries(grouped).map(([categoryName, categoryServices]) => (
        <Box key={categoryName} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{categoryName}</Typography>
          <Grid container spacing={2}>
            {categoryServices.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {service.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {service.description}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="subtitle2" color="primary">
                        From {service.price_from} лв
                      </Typography>
                      {service.turnaround_time && (
                        <Chip label={service.turnaround_time} size="small" variant="outlined" />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {services.length === 0 && !error && (
        <Typography color="text.secondary">No services available right now.</Typography>
      )}
    </Container>
  );
}

export default ServicesPage;