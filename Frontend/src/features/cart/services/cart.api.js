import axios from "axios";

const cartAPI=axios.create({
    baseURL:"/api/cart",
    withCredentials:true
})

export const addItem=async({productId,variantId})=>{
    const response=await cartAPI.post(`/add/${productId}/${variantId}`,{
        quantity:1
    })

    return response.data
}