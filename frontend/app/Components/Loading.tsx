"use client"
import React, { useState, useEffect } from 'react';


export default function Loading() {
  return (
    <div className='flex flex-col items-center justify-center h-screen space-y-2' id='loading'>
      <h1 className='w-full flex justify-center text-3xl font-semibold mb-8'>LOADING</h1>
    </div>
  );
};