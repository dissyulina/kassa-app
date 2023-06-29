import { useDispatch, useSelector } from "react-redux";
import { Badge, Box, IconButton } from "@mui/material";
import {
  AdminPanelSettingsOutlined,
  ShoppingBasketOutlined,
  BarChartOutlined,
  TableRowsOutlined,
  PersonOutline
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { shades } from "../../theme";
import { setIsCartOpen } from '../../state';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);

  const numberOfItem = cart.reduce((sum, obj) => {
    return sum + obj.count;
  }, 0);

  return (
    <Box
      display="flex"
      alignItems="center"
      width="100%"
      height="60px"
      backgroundColor="rgba(255, 255, 255, 0.95)"
      color="black"
      position="fixed"
      top="0"
      left="0"
      zIndex="1"
    >
      <Box
        width="80%"
        margin="auto"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display='flex' justifyContent="space-between" columnGap="20px">
          <Box
            onClick={() => navigate("/")}
            sx={{ "&:hover": { cursor: "pointer" }, fontWeight: 'bold' }}
            color={shades.primary[500]}
          >
            NEW ORDER
          </Box>
          <Box
            onClick={() => navigate("/retur")}
            sx={{ "&:hover": { cursor: "pointer" }, fontWeight: 'bold' }}
            color={shades.primary[500]}
          >
            RETURN
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          columnGap="20px"
          zIndex="2"
        >
          <Badge
            badgeContent={numberOfItem}
            color="secondary"
            invisible={numberOfItem === 0}
            sx={{
              "& .MuiBadge-badge": {
                right: 5,
                top: 5,
                padding: "0 4px",
                height: "14px",
                minWidth: "13px",
              },
            }}
          >
            <IconButton
              onClick={() => dispatch(setIsCartOpen({}))}
              sx={{ color: "black" }}
            >
              <ShoppingBasketOutlined />
            </IconButton>
          </Badge>
          <IconButton sx={{ color: "black" }} onClick={() => navigate("/allorders")}>
            <TableRowsOutlined />
          </IconButton>
          <IconButton sx={{ color: "black" }} onClick={() => navigate("/overview")}>
            <BarChartOutlined />
          </IconButton>
          {/* <IconButton sx={{ color: "black" }} onClick={() => navigate("/admin")}>
            <AdminPanelSettingsOutlined />
          </IconButton> */}
        </Box>
      </Box>
    </Box>
  );
}

export default Navbar;