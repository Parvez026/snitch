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

export const getCart=async()=>{
    const response=await cartAPI.get("/")
    return response.data
}

export const removeItem=async({productId,variantId})=>{
    const response=await cartAPI.delete(`/remove/${productId}/${variantId}`)
    return response.data
}

export const incrementCartItemQuantity=async({productId,variantId})=>{
    const response=await cartAPI.patch(`/quantity/increment/${productId}/${variantId}`)
    return response.data
}

export const decrementCartItemQuantity=async({productId,variantId})=>{
    const response=await cartAPI.patch(`/quantity/decrement/${productId}/${variantId}`)
    return response.data
}

export const createCartOrder=async()=>{
    const response=await cartAPI.post("/payment/create/order")
    return response.data
}


export const verifyCartOrder = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const response = await cartAPI.post("/payment/verify/order", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    })

    return response.data
}