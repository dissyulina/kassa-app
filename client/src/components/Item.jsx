import { useState } from "react";
import { useDispatch } from "react-redux";
import { IconButton, Box, Typography, useTheme, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { shades } from "../theme";
import { addToCart } from "../state";
import { useNavigate } from "react-router-dom";


const Item = ({ item, width }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const {
    palette: { neutral },
  } = useTheme();

  const { category, price, name, image } = item.attributes;

  return (
    <Box width={width}>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" padding="2rem" border="1px solid black">
        <Typography variant='h5'><b>{name}</b></Typography>
        <Typography>€ {price}</Typography> 
      </Box>
      <Box display="flex" justifyContent="space-between">
        {/* AMOUNT */}
        <Box
          display="flex"
          alignItems="center"
          backgroundColor={shades.neutral[100]}
          borderRadius="3px"
        >
          <IconButton onClick={() => setCount(Math.max(count - 1, 1))}>
            <RemoveIcon />
          </IconButton>
          <Typography color={shades.primary[300]}>{count}</Typography>
          <IconButton onClick={() => setCount(count + 1)}>
            <AddIcon />
          </IconButton>
        </Box>

        {/* BUTTON */}
        <Button
          onClick={() => {
            dispatch(addToCart({ item: { ...item, count } }));
          }}
          sx={{ backgroundColor: shades.primary[300], color: "white" }}
        >
          Add to Cart
        </Button>
      </Box>
    </Box>
  )
};

export default Item;