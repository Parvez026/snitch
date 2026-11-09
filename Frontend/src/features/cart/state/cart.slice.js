
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    totalPrice: 0,
    currency: "INR",
    items: [],
  },

  reducers: {
    setItem: (state, action) => {
      state.items = action.payload.items;
      state.totalPrice = action.payload.totalPrice;
      state.currency = action.payload.currency;
    },

    addItem: (state, action) => {
      state.items.push(action.payload);
    },

    incrementCartItems: (state, action) => {
      const { productId, variantId } = action.payload;

      const item = state.items.find(
        (item) =>
          String(item.product?._id) === String(productId) &&
          String(item.variant) === String(variantId)
      );

      if (item) {
        item.quantity += 1;
        state.totalPrice += item.price.amount;
      }
    },

    decrementCartItems: (state, action) => {
      const { productId, variantId } = action.payload;

      const item = state.items.find(
        (item) =>
          String(item.product?._id) === String(productId) &&
          String(item.variant) === String(variantId)
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalPrice -= item.price.amount;
      }
    },

    removeItemByIds: (state, action) => {
      const { productId, variantId } = action.payload;

      const item = state.items.find(
        (item) =>
          String(item.product?._id) === String(productId) &&
          String(item.variant) === String(variantId)
      );

      if (item) {
        state.totalPrice -= item.price.amount * item.quantity;

        state.items = state.items.filter(
          (item) =>
            !(
              String(item.product?._id) === String(productId) &&
              String(item.variant) === String(variantId)
            )
        );
      }
    },
  },
});

export const {
  setItem,
  addItem,
  incrementCartItems,
  decrementCartItems,
  removeItemByIds,
} = cartSlice.actions;

export default cartSlice.reducer;
