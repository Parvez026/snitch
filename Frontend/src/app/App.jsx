import "./App.css";
import { RouterProvider } from "react-router";
import { Router } from "./app.routes.jsx";
function App() {


  return (
    <>
       <RouterProvider router={Router}/>
    </>
  )
}

export default App
