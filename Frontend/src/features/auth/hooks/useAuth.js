import { useDispatch } from "react-redux"
import { getMe, login, register } from "../services/auth.api"
import { setLoading, setUser } from "../state/auth.slice"


export const useAuth=()=>{

   const dispatch=useDispatch()

    async function handleRegister({email,contact,password,fullName,isSeller=false}){
     const data=await register({email,contact,password,fullName,isSeller})
     dispatch(setUser(data.user))

     return data.user
    }

    async function handleLogin({email,password}){
        const data=await login({email,password})
        dispatch(setUser(data.user))
        return data.user
    }

    async function handleGetMe(){
    try {
        dispatch(setLoading(true))
        const data=await getMe()
        dispatch(setUser(data.user))
        
    } catch (error) {
        console.log(error);
    }finally{
     dispatch(setLoading(false))
    }

    }

    return {handleRegister,handleLogin,handleGetMe}
}