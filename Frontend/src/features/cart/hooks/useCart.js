import { useDispatch } from "react-redux"
import {
  addItem,
  getCart,
  incrementCartItemQuantity,
  decrementCartItemQuantity,
  removeItem,
  createCartOrder,
  verifyCartOrder,
} from "../services/cart.api"
import {
  setItem,
  incrementCartItems,
  decrementCartItems,
  removeItemByIds,
} from "../state/cart.slice"

export const useCart = () => {
  const dispatch = useDispatch()

  async function handleAddItem({ productId, variantId }) {
    const data = await addItem({ productId, variantId })

    await handleGetCart();
    return data
  }

  async function handleGetCart() {
    const data = await getCart()
    console.log(data.cart)
     dispatch(setItem(data.cart))
  }

 async function handleIncrementCartItem({ productId, variantId }) {
  await incrementCartItemQuantity({ productId, variantId });

  dispatch(incrementCartItems({ productId, variantId }));
  console.log("Increment dispatched");
}

 async function handleDecrementCartItem({ productId, variantId }) {
  await decrementCartItemQuantity({ productId, variantId });

    dispatch(decrementCartItems({ productId, variantId }));
}

  async function handleRemoveItem({ productId, variantId }) {
    await removeItem({ productId, variantId })

    dispatch(removeItemByIds({ productId, variantId }))
  }

  async function handleCreteCartOrder(){
    const data =await createCartOrder();
    return data.order
  }

    async function handleVerifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
        const data = await verifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
        return data.success
    }

  return {
    handleAddItem,
    handleGetCart,
    handleIncrementCartItem,
    handleDecrementCartItem,
    handleRemoveItem,
    handleCreteCartOrder,
    handleVerifyCartOrder
  }
}
