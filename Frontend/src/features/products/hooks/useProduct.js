import { useDispatch } from "react-redux"
import { createProduct, getSellerProduct } from "../services/product.api"
import { setSellerProduct } from "../state/product.slice"



export const useProduct=()=>{

const dispatch=useDispatch()

const handleCreateProduct=async(formData)=>{
  const data=await createProduct(formData)

  return data.product
}

const handleGetSellerProduct=async()=>{
    try {
        const data=await getSellerProduct()
        const productList = data?.sellProducts || data?.products || (Array.isArray(data) ? data : [])
        dispatch(setSellerProduct(productList))
        return productList
    } catch (err) {
        console.error("Failed to fetch seller products:", err)
        throw err
    }
}

return {
 handleCreateProduct,handleGetSellerProduct
}

}