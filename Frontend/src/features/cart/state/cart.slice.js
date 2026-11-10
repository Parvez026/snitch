
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    totalPrice: null,
    currency: null,
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
          item.product?._id === productId &&
          item.variant === variantId
      );

      if (item) {
        item.quantity += 1;
        state.totalPrice += item.product.variants.price.amount;
      }
    },

    decrementCartItems: (state, action) => {
      const { productId, variantId } = action.payload;

      const item = state.items.find(
        (item) =>
          item.product?._id === productId &&
          item.variant === variantId
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalPrice -= item.product.variants.price.amount;
      }
    },

    removeItemByIds: (state, action) => {
      const { productId, variantId } = action.payload;

      const item = state.items.find(
        (item) =>
          item.product?._id === productId &&
          item.variant === variantId
      );

      if (item) {
        state.totalPrice -= item.product.variants.price.amount * item.quantity;

        state.items = state.items.filter(
          (item) =>
            !(
              item.product?._id === productId &&
              item.variant === variantId
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
