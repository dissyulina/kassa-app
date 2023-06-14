import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCartOpen: false,
  cart: [],
  item: [],
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },

    addToCart: (state, action) => {
      if (state.cart.find((item) => item.id === action.payload.item.id)) {
        state.cart = state.cart.map((item) => {
          if (item.id === action.payload.item.id) {
            item.count++;
          }
          return item;
        })
      } else {
        state.cart = [...state.cart, action.payload.item];
      }
    },

    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload.id);
    },

    emptyCart: (state) => {
      state.cart = [];
    },

    increaseCount: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item.id === action.payload.id) {
          item.count++;
        }
        return item;
      });
    },

    decreaseCount: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item.id === action.payload.id && item.count > 1) {
          item.count--;
        }
        return item;
      });
    },

    setIsCartOpen: (state) => {
      state.isCartOpen = !state.isCartOpen;
    }
  }
});

export const {
  setItems,
  addToCart,
  removeFromCart,
  emptyCart,
  increaseCount, 
  decreaseCount,
  setIsCartOpen
} = cartSlice.actions;

export default cartSlice.reducer;
