import axios from "axios";

const axiosInstance=axios.create({
    baseURL:"http://localhost:3000/api/auth",
    withCredentials:true
})

export async function register({email,contact,password,fullName,isSeller}){

    const response=await axiosInstance.post('/register',{
        email,
        contact,
        password,
        fullName,
        isSeller
    })

    return response.data
}