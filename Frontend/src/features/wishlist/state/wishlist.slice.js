import { createSlice } from "@reduxjs/toolkit";


const wishlistSlice=createSlice({
    name:"wishlist",
    initialState:{
        wishlistItems:[]
    },
    reducers:{
        setWishlist:(state,action)=>{
            state.wishlistItems=action.payload;
        }
    }
})

export const {setWishlist} =wishlistSlice.actions;
export default wishlistSlice.reducer;