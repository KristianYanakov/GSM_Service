import { useEffect, useState } from "react";
import { Container, Typography, Alert } from "@mui/material";
import { getProducts } from "../api/catalog";
import ProductGrid from "../components/product/ProductGrid";
import LoadingSpinner from "../components/common/LoadingSpinner";

function StorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data.results))
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Store</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <ProductGrid products={products} />
    </Container>
  );
}

export default StorePage;