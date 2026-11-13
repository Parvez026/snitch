import axios from "axios";

const addressApi=axios.create({
    baseURL:"/api/address",
    withCredentials:true
})


export const createAddressApi=async(formData)=>{
       
    const response=await addressApi.post("/create",formData)
    return response.data
}

export const getAllAddressApi=async()=>{
    const response=await addressApi.get("/get-address")
    return response.data
}

export const updateAddressApi = async (addressId, addressData) => {
    const response = await addressApi.patch(`/${addressId}`,addressData);
    return response.data;
};

export const deleteAddressApi = async (addressId) => {
    const response = await addressApi.delete(`/${addressId}`);
    return response.data;
};

export const setDefaultAddressApi = async (addressId) => {
    const response = await addressApi.patch(`/${addressId}/default`);
    return response.data;
};