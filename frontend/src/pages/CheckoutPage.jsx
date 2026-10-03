import { useState, useEffect } from "react";
import {
  Container, Typography, TextField, Button, Box, Grid,
  Paper, Alert, CircularProgress, Divider,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCartItems, selectCartTotal } from "../features/cart/cartSelectors";
import { clearCart } from "../features/cart/cartSlice";
import { createOrder } from "../api/orders";

function CheckoutPage() {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    econt_office: "",
    shipping_address: "",
    notes: "",
    website: "", // honeypot — stays empty for real users
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Redirect to /store if cart is empty — but not right after we just placed an order
  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      navigate("/store");
    }
  }, [items.length, orderPlaced, navigate]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...form,
      items: items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      const res = await createOrder(payload);
      setOrderPlaced(true);           // NEW — set before clearing cart
      dispatch(clearCart());
      navigate(`/order/${res.data.order_number}`);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        const messages = Object.entries(data)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
          .join(" | ");
        setError(messages);
      } else {
        setError("Something went wrong submitting your order. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Full Name"
                fullWidth required margin="normal"
                value={form.full_name}
                onChange={handleChange("full_name")}
              />
              <TextField
                label="Phone"
                fullWidth required margin="normal"
                value={form.phone}
                onChange={handleChange("phone")}
              />
              <TextField
                label="Email (optional)"
                type="email"
                fullWidth margin="normal"
                value={form.email}
                onChange={handleChange("email")}
              />
              <TextField
                label="Econt Office"
                fullWidth margin="normal"
                helperText="Name/location of the Econt office for pickup"
                value={form.econt_office}
                onChange={handleChange("econt_office")}
              />
              <TextField
                label="Or Shipping Address (for courier delivery)"
                fullWidth margin="normal"
                value={form.shipping_address}
                onChange={handleChange("shipping_address")}
              />
              <TextField
                label="Notes (optional)"
                fullWidth multiline rows={3} margin="normal"
                value={form.notes}
                onChange={handleChange("notes")}
              />

              {/* Honeypot field — invisible to real users */}
              <input
                type="text"
                name="website"
                autoComplete="off"
                tabIndex={-1}
                style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }}
                aria-hidden="true"
                value={form.website}
                onChange={handleChange("website")}
              />

              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3 }}
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} /> : "Place Order (Cash/Card on Delivery)"}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            {items.map((item) => (
              <Box key={item.productId} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">{item.name} × {item.quantity}</Typography>
                <Typography variant="body2">{(item.price * item.quantity).toFixed(2)} лв</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">{total.toFixed(2)} лв</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CheckoutPage;