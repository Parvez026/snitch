import { useDispatch } from "react-redux"
import {
  addItem,
  getCart,
  incrementCartItemQuantity,
  decrementCartItemQuantity,
  removeItem,
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
    return data
  }

  async function handleGetCart() {
    const data = await getCart()
    dispatch(setItem(data.cart.items))
  }

  async function handleIncrementCartItem({ productId, variantId }) {
        await incrementCartItemQuantity({ productId, variantId })
        dispatch(incrementCartItems({ productId, variantId }))
    }

  async function handleDecrementCartItem({ productId, variantId, currentQty }) {
    if (currentQty <= 1) return
    await decrementCartItemQuantity({ productId, variantId })
    dispatch(decrementCartItems({ productId, variantId }))
  }

  async function handleRemoveItem({ productId, variantId }) {
    dispatch(removeItemByIds({ productId, variantId }))
    try {
      await removeItem({ productId, variantId })
    } catch (err) {
      console.error("Remove failed:", err)
      // Re-fetch cart to restore state on error
      await handleGetCart()
    }
  }

  return {
    handleAddItem,
    handleGetCart,
    handleIncrementCartItem,
    handleDecrementCartItem,
    handleRemoveItem,
  }
}
