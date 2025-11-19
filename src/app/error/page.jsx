
"use client"
 import React, { useEffect } from 'react'
 
 const page = () => {
  useEffect(() => {
    setTimeout(() => {
      window.opener?.postMessage("500", window.location.origin);
      window.close();
    }, 3000);
  }, []);
   return (
     <div>page</div>
   )
 }
 
 export default page