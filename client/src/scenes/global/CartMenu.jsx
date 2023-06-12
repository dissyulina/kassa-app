import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import styled from "@emotion/styled";
import { shades } from "../../theme";
import {
  decreaseCount,
  increaseCount,
  removeFromCart,
  emptyCart,
  setIsCartOpen,
} from "../../state";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../hooks/useSnackbar";
import { Alert, AlertColor, Snackbar } from '@mui/material';

const FlexBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const isCartOpen = useSelector((state) => state.cart.isCartOpen);
  const { AlertMessage, isVisible, getAlertMessage } = useSnackbar();

  const totalPrice = cart.reduce((total, item) => {
    return total + item.count * item.attributes.price;
  }, 0);

  console.log("cart", cart)

  async function saveOrders(values) {
    // const requestBody = {
    //   //time: new Date(),
    //   data: cart.map((product) => ({
    //     id: product.id,
    //     name: product.attributes.name,
    //     count: product.count,
    //     price: product.attributes.price,
    //   })),
    // };

    const requestBody = cart.map((product) => ({
      id: product.id,
      name: product.attributes.name,
      count: product.count,
      price: product.attributes.price,
    }))
  
    const payload = { data: {products: requestBody}}
    
    console.log("requestBody", requestBody)

    const response = await fetch("http://localhost:1337/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      //body: JSON.stringify({ data: [{ id: 3, name: 'Siomay', count: 1, price: 10 }, { id: 2, name: 'Bubur Ayam', count: 1, price: 5.5 }] }),
    });
    const session = await response.json();
    console.log(session)
    if (response) {
      if (response.status === 200) {
        console.log("SUCCESS");
        getAlertMessage('success', "Data is saved.")
      }
    }
    if (session.error) {
      console.log(session);
      getAlertMessage('warning', session.error.name)
    }
    setTimeout(() => {
      dispatch(setIsCartOpen({}));
      dispatch(emptyCart({}));
    }, 1500)
  }

  console.log(isVisible)

  return (
    <Box
    display={isCartOpen ? "block" : "none"}
    backgroundColor="rgba(0, 0, 0, 0.4)"
    position="fixed"
    zIndex={10}
    width="100%"
    height="100%"
    left="0"
    top="0"
    overflow="auto"
  >
    <Box
      position="fixed"
      right="0"
      bottom="0"
      width="max(400px, 30%)"
      height="100%"
      backgroundColor="white"
    >
      <Box padding="30px" overflow="auto" height="100%">
        {/* HEADER */}
        <FlexBox mb="15px">
          <Typography variant="h3">ORDERS ({cart.length})</Typography>
          <IconButton onClick={() => dispatch(setIsCartOpen({}))}>
            <CloseIcon />
          </IconButton>
        </FlexBox>

        {/* CART LIST */}
        <Box>
          {cart.map((item) => (
            <Box key={`${item.attributes.name}-${item.id}`}>
              <FlexBox p="15px 0">
                <Box flex="1 1 100%">
                  <FlexBox mb="5px">
                    <Typography fontWeight="bold">
                      {item.attributes.name}
                    </Typography>
                    <IconButton
                      onClick={() =>
                        dispatch(removeFromCart({ id: item.id }))
                      }
                    >
                      <CloseIcon />
                    </IconButton>
                  </FlexBox>
                  <FlexBox m="15px 0">
                    <Box
                      display="flex"
                      alignItems="center"
                      border={`1.5px solid ${shades.neutral[500]}`}
                    >
                      <IconButton
                        onClick={() =>
                          dispatch(decreaseCount({ id: item.id }))
                        }
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography>{item.count}</Typography>
                      <IconButton
                        onClick={() =>
                          dispatch(increaseCount({ id: item.id }))
                        }
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                    <Typography fontWeight="bold">
                      ${item.attributes.price}
                    </Typography>
                  </FlexBox>
                </Box>
              </FlexBox>
              <Divider />
            </Box>
          ))}
        </Box>

        {/* ACTIONS */}
        <Box m="20px 0">
          <FlexBox m="20px 0">
            <Typography fontWeight="bold">SUBTOTAL</Typography>
            <Typography fontWeight="bold">${totalPrice}</Typography>
          </FlexBox>
          <Button
            sx={{
              backgroundColor: shades.primary[400],
              color: "white",
              borderRadius: 0,
              minWidth: "100%",
              padding: "20px 40px",
              m: "20px 0",
            }}
            onClick={() => {     
              saveOrders();
            }}
          >
            Save
          </Button>
        </Box>
        {isVisible === true ? <AlertMessage /> : ''}
      </Box>
    </Box>
  </Box>
  )
}

export default CartMenu;
