import "./App.css";
import { RouterProvider } from "react-router";
import { Router } from "./app.routes.jsx";
import { useEffect } from "react";
import { useAuth } from "../features/auth/hooks/useAuth.js";
import { useSelector } from "react-redux";
import Footer from "../features/shared/components/Footer.jsx";
import { useCart } from "../features/cart/hooks/useCart.js";


function App() {

  const {handleGetMe}=useAuth()
  const { handleGetCart } = useCart();
  const user=useSelector((state)=>state.auth.user)
  console.log(user);
  
useEffect(()=>{
handleGetMe()
handleGetCart()
},[])
  return (
    <>
       <RouterProvider router={Router}/>
    <Footer/>
    </>
  )
}

export default App
