import { useDispatch } from "react-redux"
import { addToWishlistApi, fetchWishlistItemsApi, removeFromWishlistApi } from "../services/wishist.api"
import { setWishlist } from "../state/wishlist.slice"


const useWishlist=()=>{

   const dispatch=useDispatch()

   async function handleAddToWishlist(productId){
      const data=await addToWishlistApi(productId)
      await handleGetWishlist()
      return data.wishlist
   }

   async function handleRemoveFromWishlist(productId){
      const data=await removeFromWishlistApi(productId)
      await handleGetWishlist()

      return data.wishlist
   }

   async function handleGetWishlist(){
    const data=await fetchWishlistItemsApi()

    dispatch(setWishlist(data.wishlist||[]))

    return data
   }


    return {
       handleAddToWishlist,
       handleRemoveFromWishlist,
       handleGetWishlist
    }
}

export default useWishlist