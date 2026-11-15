import React from 'react'
import Nav from '../features/shared/components/Nav'
import { Outlet } from 'react-router'
import Footer from '../features/shared/components/Footer'

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
   <Nav/>
   <main className="flex-1">
      <Outlet />
   </main>
   <Footer/>
   </div>
  )
}

export default AppLayout