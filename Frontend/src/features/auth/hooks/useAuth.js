import { useDispatch } from "react-redux"
import { register } from "../services/auth.api"
import { setUser } from "../auth.slice"


export const useAuth=()=>{

   const dispatch=useDispatch()
    async function handleRegister({email,contact,password,fullName,isSeller=false}){
     const data=await register({email,contact,password,fullName,isSeller})
     dispatch(setUser(data.user))

     return data.user
    }

    return {handleRegister}
}