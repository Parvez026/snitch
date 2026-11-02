import { useDispatch } from "react-redux"
import { createProduct, getAllProducts, getSellerProduct } from "../services/product.api"
import { setProducts, setSellerProduct } from "../state/product.slice"



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

const handleGetAllProducts=async()=>{
   const data=await getAllProducts()

   dispatch(setProducts(data.products))
}

return {
 handleCreateProduct,handleGetSellerProduct,handleGetAllProducts
}

}