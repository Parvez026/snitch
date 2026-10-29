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
    const data=await getSellerProduct()

    dispatch(setSellerProduct(data.products))
    
    return data.products
}

return {
 handleCreateProduct,handleGetSellerProduct
}

}