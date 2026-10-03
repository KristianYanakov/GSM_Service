import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container, Grid, Typography, Button, Box, Chip, Alert,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { getProductBySlug } from "../api/catalog";
import { addItem } from "../features/cart/cartSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";

function ProductDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProductBySlug(slug)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Product not found."))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    dispatch(addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images?.[0]?.image,
      quantity: 1,
    }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
  if (!product) return null;

  const mainImage = product.images?.[0]?.image;

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={mainImage || "https://via.placeholder.com/500"}
            alt={product.name}
            sx={{ width: "100%", borderRadius: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Chip label={product.category?.name} size="small" sx={{ mb: 1 }} />
          <Typography variant="h4" gutterBottom>{product.name}</Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            {product.price} лв
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {product.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {product.stock_quantity > 0
              ? `${product.stock_quantity} in stock`
              : "Out of stock"}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
          >
            Add to Cart
          </Button>
          {added && (
            <Alert severity="success" sx={{ mt: 2 }}>Added to cart!</Alert>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductDetailPage;