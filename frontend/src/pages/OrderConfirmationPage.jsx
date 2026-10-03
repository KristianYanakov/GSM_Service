import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Container, Typography, Paper, Box, Chip, Divider, Button, Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getOrderByNumber } from "../api/orders";
import LoadingSpinner from "../components/common/LoadingSpinner";

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  paid: "Paid",
  cancelled: "Cancelled",
};

function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderByNumber(orderNumber)
      .then((res) => setOrder(res.data))
      .catch(() => setError("Order not found."))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <Alert severity="error">{error}</Alert>
        <Button component={RouterLink} to="/store" sx={{ mt: 2 }}>Back to Store</Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }} maxWidth="sm">
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h5" gutterBottom>Order Placed!</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Save this link to check your order status later.
        </Typography>

        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1"><strong>Name:</strong> {order.full_name}</Typography>
          <Typography variant="body1"><strong>Phone:</strong> {order.phone}</Typography>
          <Chip
            label={STATUS_LABELS[order.status] || order.status}
            color="primary"
            sx={{ my: 2 }}
          />

          <Divider sx={{ my: 2 }} />

          {order.items.map((item) => (
            <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2">{item.product_name} × {item.quantity}</Typography>
              <Typography variant="body2">{item.price_at_purchase} лв</Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">{order.total_price} лв</Typography>
          </Box>
        </Box>

        <Button component={RouterLink} to="/store" variant="contained" sx={{ mt: 4 }}>
          Continue Shopping
        </Button>
      </Paper>
    </Container>
  );
}

export default OrderConfirmationPage;