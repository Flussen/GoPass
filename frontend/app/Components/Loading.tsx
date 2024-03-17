"use client"
import React, { useState, useEffect } from 'react';




const LoadingComp=({}) => {


  return (
    <div className='flex  items-center justify-center h-screen space-x-2 bg-black' id='loading'>
      <div className='bg-gradient  w-2 animate-loading '/>
      <div className='bg-gradient w-2 animate-loading delay-500'/>
      <div className='bg-gradient w-2 animate-loading delay-1000'/>

    </div>
  );
};
export default LoadingComp;