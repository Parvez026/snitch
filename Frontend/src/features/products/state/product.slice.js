
import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",

  initialState: {
    sellerProduct: [],
    products: [],
  },

  reducers: {
    setSellerProduct: (state, action) => {
      state.sellerProduct = action.payload;
    },

    setProducts: (state, action) => {
      state.products = action.payload;
    },

    removeSellerProduct: (state, action) => {
      state.sellerProduct = state.sellerProduct.filter(
        (product) => product._id !== action.payload
      );
    },
  },
});

export const {
  setSellerProduct,
  setProducts,
  removeSellerProduct,
} = productSlice.actions;

export default productSlice.reducer;
