"use client"
import React, { useState, useEffect } from 'react';
import { Greet } from '@/wailsjs/go/main/App';
import { Login } from '@/wailsjs/wailsjs/go/main/App';

import Link from 'next/link';



export default function Home() {
  const [greeting, setGreeting] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  useEffect(() => {
    async function fetchGreeting() {
      try {
        // Llama a la función Greet de Go y espera por la respuesta
        const response = await Greet("Test");
        let response2 = await Login
        setGreeting(response);
      } catch (error) {
        console.error('Error fetching greeting:', error);
      }
    }

    fetchGreeting();
  }, []);

  return (
    <div>
      {
        showSignup ? (
          <>
            <div className='flex flex-col items-center justify-center h-screen space-y-2' id='login'>
              <h1 className='w-full flex justify-center text-3xl font-semibold mb-8'>SIGN UP</h1>
              <input className='rounded-xl h-10 pl-4 border-grey border-2 text-black w-96' type="text" placeholder='Username' />
              <input className='rounded-xl h-10 pl-4 border-grey border-2 text-black w-96' type="text" placeholder='Correo' />

              <input className='rounded-xl h-10 pl-4 border-grey border-2 text-black w-96' type="password" placeholder='Password' />

              <button className='rounded-xl h-10 pl-4 border-grey border-2 text-white w-96 bg-black' type="submit" >
                Sign Up
              </button>


              <div className='flex-col  items-center justify-center mt-[-310px]'>
                <div className='text-black flex justify-center items-center '>
                  Have you an account?  <a href="#signup" onClick={() => setShowSignup(false)}> &nbsp;Login</a>
                </div>
                <h3 className='flex justify-center items-center opacity-50 text-sm'>
                  Version Alpha 0.1
                </h3>
              </div>

            </div>


          </>
        ) : (
          <>
            <div className='flex flex-col items-center justify-center h-screen space-y-2' id='login'>
              <h1 className='w-full flex justify-center text-3xl font-semibold mb-8'>LOGIN</h1>

              <input className='rounded-xl h-10 pl-4 border-grey border-2 text-black w-96' type="text" placeholder='Username' />

              <input className='rounded-xl h-10 pl-4 border-grey border-2 text-black w-96' type="password" placeholder='Password' />

              <button className='rounded-xl h-10 pl-4 border-grey border-2 text-white w-96 bg-black' type="submit" >
                Login
              </button>


              <div className='flex-col  items-center justify-center mt-[-310px]'>
                <div className='text-black flex justify-center items-center '>
                  Have you an account?  <a href="#signup" onClick={() => setShowSignup(true)}> &nbsp;Register</a>
                </div>
                <h3 className='flex justify-center items-center opacity-50 text-sm'>
                  Version Alpha 0.1
                </h3>
              </div>

            </div>


          </>
        )
      }
    </div>
  );

}