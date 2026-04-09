import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function Layout({ children }){

 const [sidebarOpen, setSidebarOpen] = useState(false);

 return(

  <div className="bg-gray-950 text-white min-h-screen flex">

   {/* Sidebar */}
   <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

   {/* Main */}
   <div className="flex flex-col flex-1 md:ml-64">

    <Navbar setSidebarOpen={setSidebarOpen} />

    <div className="flex-1 p-4 md:p-6 mt-16">
     {children}
    </div>

    <Footer />

   </div>

  </div>

 );

}

export default Layout;