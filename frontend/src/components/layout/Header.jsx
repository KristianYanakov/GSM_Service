import { AppBar, Toolbar, Typography, Button, Box, Badge, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartItemCount } from "../../features/cart/cartSelectors";

function Header() {
  const itemCount = useSelector(selectCartItemCount);

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ color: "inherit", textDecoration: "none" }}
        >
          GSM Shop
        </Typography>

        <Box>
          <Button color="inherit" component={RouterLink} to="/store">Store</Button>
          <Button color="inherit" component={RouterLink} to="/services">Services</Button>
          <Button color="inherit" component={RouterLink} to="/location">Location</Button>
          <IconButton color="inherit" component={RouterLink} to="/cart">
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;