"use client"
import React from 'react';

interface LoginProps {
    setShowSignup: (value: boolean) => void;
    handleLoginSignup: () => void; // Añadir esta línea
    version: string;
  }

  const Login: React.FC<LoginProps> = ({ setShowSignup, handleLoginSignup, version }) => {
    return (
    <div className='flex flex-col items-center justify-center h-screen space-y-2' id='login'>
      <h1 className='w-full flex justify-center text-3xl font-semibold mb-8'>LOGIN</h1>
      <input className='rounded-xl h-10 pl-4 border-grey border-[1px] text-black w-96 bg-transparent' type="text" placeholder='Username' />
      <input className='rounded-xl h-10 pl-4 border-grey border-[1px] text-black w-96  bg-transparent' type="password" placeholder='Password' />
      <button className='rounded-xl h-10 pl-4 text-white w-96 bg-black' type="submit"  onClick={handleLoginSignup}>Login</button>
      <div className='flex-col  items-center justify-center mt-[-310px]'>
        <div className='text-black flex justify-center items-center opacity-80'>
          Don't have an account? <a className='hover:text-blue' href="#signup" onClick={() => setShowSignup(true)}> &nbsp;Register</a>
        </div>
        <h3 className='flex justify-center items-center opacity-50 text-xs select-none'>{version}</h3>
      </div>
    </div>
  );
};

export default Login;
