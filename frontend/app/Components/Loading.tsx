"use client"
import React, { useState, useEffect } from 'react';




const LoadingComp=({}) => {


  return (
    <div className=' absolute top-0 right-0 flex  items-center justify-center h-screen w-screen space-x-2 bg-black z-50 ' id='loading'>
      <div className='bg-primary  w-2 animate-loading '/>
      <div className='bg-primary w-2 animate-loading delay-500'/>
      <div className='bg-primary w-2 animate-loading delay-1000'/>
    </div>
  );
};
export default LoadingComp;