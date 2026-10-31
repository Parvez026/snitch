import "./App.css";
import { RouterProvider } from "react-router";
import { Router } from "./app.routes.jsx";
import { useEffect } from "react";
import { useAuth } from "../features/auth/hooks/useAuth.js";
import { useSelector } from "react-redux";


function App() {

  const {handleGetMe}=useAuth()
  const user=useSelector((state)=>state.auth.user)
  console.log(user);
  

useEffect(()=>{
handleGetMe()
},[])
  return (
    <>
       <RouterProvider router={Router}/>
    </>
  )
}

export default App
