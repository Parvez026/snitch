import axios from "axios";

const wishlistApi=axios.create({
    baseURL:`${import.meta.env.VITE_API_URL||""}/api/wishlist`,
    withCredentials:true
})



export const fetchWishlistItemsApi=async () =>{
    const response =await wishlistApi.get("/get-wishlist");
    return response.data;
}

export const addToWishlistApi=async (productId) =>{
    const response =await wishlistApi.post(`/add/${productId}`);
    return response.data;
}

export const removeFromWishlistApi=async (productId)=>{
    const response=await wishlistApi.delete(`/remove/${productId}`);
    return response.data;
}

