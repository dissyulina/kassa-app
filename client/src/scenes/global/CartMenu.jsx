import React, {useState} from 'react';
import { Box, Button, Divider, IconButton, TextField, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';
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
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [amountGiven, setAmountGiven] = useState(null);
  const [change, setChange] = useState(null);

  const totalPrice = cart.reduce((total, item) => {
    return total + item.count * item.attributes.price;
  }, 0);

  async function saveOrders() {
    const requestBody = cart.map((product) => ({
      id: product.id,
      name: product.attributes.name,
      count: product.count,
      price: product.attributes.price,
    }))
  
    const payload = { data: {products: requestBody, payment: selectedPayment, total: totalPrice}}

    const response = await fetch("http://localhost:1337/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      //body: JSON.stringify({ data: [{ id: 3, name: 'Siomay', count: 1, price: 10 }, { id: 2, name: 'Bubur Ayam', count: 1, price: 5.5 }] }),
    });
    const session = await response.json();

    if (response) {
      if (response.status === 200) {
        getAlertMessage('success', "Data is saved.")
      }
    }
    if (session.error) {
      getAlertMessage('warning', session.error.name || session.error.title)
    }
    setTimeout(() => {
      dispatch(setIsCartOpen({}));
      dispatch(emptyCart({}));
    }, 1500)
  }

  const handleCalculate = () => {
    setChange(amountGiven - totalPrice);
  }

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
                    <FlexBox>
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
                    <FlexBox m="0">
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
              <Typography fontWeight="bold">€{totalPrice}</Typography>
            </FlexBox>
            
            {/* PAYMENT */}
            <Box>
              <FormControl>
                <FormLabel id="payment-label">Payment Method</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="payment-label"
                  name="payment"
                  value={selectedPayment}
                  onChange={(event) => setSelectedPayment(event.target.value)}
                >
                  <FormControlLabel value="cash" control={<Radio />} label="Cash" />
                  <FormControlLabel value="sumup" control={<Radio />} label="Sum Up" />
                  <FormControlLabel value="qrcode" control={<Radio />} label="QR Code" />
                </RadioGroup>
              </FormControl>
            </Box>
            {selectedPayment === 'cash' && 
            <Box padding='30px 20px 20px 20px' marginTop='1rem' sx={{ backgroundColor: shades.neutral[100]}}>
              <Box display='flex'>
                <TextField
                  label={'Amount given'}
                  value={amountGiven || ''}
                  onChange={(event) => setAmountGiven(event.target.value)}
                  type='number'
                  InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                  }}
                />
                <Button sx={{ backgroundColor: shades.primary[300], color: "white", "&:hover": {backgroundColor: shades.primary[200]} }}
                  onClick={handleCalculate}
                >
                  Calculate change
                </Button>
              </Box>
              <Box>
                <Typography variant='h6'>The change: €<b>{change}</b></Typography>
              </Box>
            </Box>
            }
            <Button
              sx={{
                backgroundColor: shades.primary[400],
                color: "white",
                borderRadius: 0,
                minWidth: "100%",
                padding: "20px 40px",
                m: "20px 0",
                "&:hover": {backgroundColor: shades.primary[300]} 
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
