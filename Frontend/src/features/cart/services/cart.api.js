import axios from "axios";

const cartAPI=axios.create({
    baseURL:`${import.meta.env.VITE_API_URL ||""}/api/cart`,
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

export const createCartOrder=async(addressId)=>{
    const response=await cartAPI.post("/payment/create/order",
        {addressId}
    )
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

export const getOrderDetails = async (orderId) => {
  const response = await cartAPI.get(`/order/${orderId}`);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await cartAPI.get("/my-orders");
  return response.data;
};

// Get logged-in seller's orders
export const getSellerOrders = async () => {
  const response = await cartAPI.get("/seller/orders");
  return response.data;
};

// Update seller's order status
export const updateSellerOrderStatus = async ({ orderId, orderStatus }) => {
  const response = await cartAPI.patch(
    `/seller/orders/${orderId}/status`,
    { orderStatus }
  );

  return response.data;
};