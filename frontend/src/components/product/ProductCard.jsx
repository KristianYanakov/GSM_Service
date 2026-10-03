import { Card, CardMedia, CardContent, Typography, CardActionArea, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../../features/cart/cartSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const imageUrl = product.primary_image?.image;

  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent the card link navigation
    dispatch(addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: imageUrl,
      quantity: 1,
    }));
  };

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/store/${product.slug}`}>
        <CardMedia
          component="img"
          height="180"
          image={imageUrl || "https://via.placeholder.com/300x180?text=No+Image"}
          alt={product.primary_image?.alt_text || product.name}
        />
        <CardContent>
          <Typography variant="subtitle1" noWrap>{product.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {product.price} лв
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box sx={{ p: 1 }}>
        <Button fullWidth size="small" variant="outlined" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </Box>
    </Card>
  );
}

export default ProductCard;