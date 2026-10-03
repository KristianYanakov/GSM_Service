import {
  Container, Typography, Box, IconButton, Button,
  Table, TableBody, TableCell, TableHead, TableRow, TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectCartItems, selectCartTotal,
} from "../features/cart/cartSelectors";
import { removeItem, updateQuantity } from "../features/cart/cartSlice";

function CartPage() {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>Your cart is empty</Typography>
        <Button variant="contained" onClick={() => navigate("/store")}>
          Browse Store
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Your Cart</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Subtotal</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.productId}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.price.toFixed(2)} лв</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  size="small"
                  value={item.quantity}
                  inputProps={{ min: 1 }}
                  sx={{ width: 70 }}
                  onChange={(e) =>
                    dispatch(updateQuantity({
                      productId: item.productId,
                      quantity: parseInt(e.target.value, 10) || 1,
                    }))
                  }
                />
              </TableCell>
              <TableCell>{(item.price * item.quantity).toFixed(2)} лв</TableCell>
              <TableCell>
                <IconButton onClick={() => dispatch(removeItem(item.productId))}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={{ mt: 3, textAlign: "right" }}>
        <Typography variant="h6">Total: {total.toFixed(2)} лв</Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </Button>
      </Box>
    </Container>
  );
}

export default CartPage;