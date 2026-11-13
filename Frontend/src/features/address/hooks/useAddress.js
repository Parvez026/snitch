import { useDispatch } from "react-redux"
import { createAddressApi, deleteAddressApi, getAllAddressApi, setDefaultAddressApi, updateAddressApi } from "../services/address.api.js"
import { addAddress, removeAddress, setAddress, setDefaultAddress, updateAddress } from "../state/address.slice"


export const useAddress=()=>{

    const dispatch=useDispatch()

    const handleCreateAddress=async(formData)=>{
       const data=await createAddressApi(formData)
       dispatch(addAddress(data.address))
    }

    const handleGetAllAddress=async()=>{
      const data=await getAllAddressApi()
      dispatch(setAddress(data.addresses))
    }

    const handleUpdateAddress=async(addressId,formData)=>{
      const data=await updateAddressApi(addressId,formData)
      dispatch(updateAddress(data.address))
    }

    const handleDeleteAddress=async(addressId)=>{
      await deleteAddressApi(addressId)
      dispatch(removeAddress(addressId))
    }

    const handleSetDefaultAddress=async(addressId)=>{
        const data=await setDefaultAddressApi(addressId)
        dispatch(setDefaultAddress(data.address))
    }

    return{
       handleCreateAddress,
       handleGetAllAddress,
       handleUpdateAddress,
       handleDeleteAddress,
       handleSetDefaultAddress 
    }
}