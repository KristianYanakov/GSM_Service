import { Card, CardMedia, CardContent, Typography, CardActionArea } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function ProductCard({ product }) {
  const imageUrl = product.primary_image?.image;

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
    </Card>
  );
}

export default ProductCard;