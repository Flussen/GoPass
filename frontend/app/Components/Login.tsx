"use client"
import React from 'react';
import { useState } from 'react';
import { Login } from '@/wailsjs/wailsjs/go/main/App';

interface LoginProps {
  setShowSignup: (value: boolean) => void;
  handleLoginSignup: () => void; // Añadir esta línea
  version: string;
}



const LoginPage: React.FC<LoginProps> = ({ setShowSignup, handleLoginSignup, version }) => {


  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  async function pullLogin() {
    try {
      const response = await Login(name, password);
      if (response!==null) {
        handleLoginSignup();
        alert('Sesión iniciada');
      } else {
        alert('Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error fetching version:', error);
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Previene la recarga de la página
    await pullLogin(); // Llama a la función pullLogin
  };
  return (
    <div className='flex flex-col items-center justify-center h-screen space-y-2' id='login'>
      <h1 className='w-full flex justify-center text-3xl font-semibold mb-8'>LOGIN</h1>
      <form onSubmit={handleSubmit}>
        <input className='rounded-xl h-10 pl-4 border-grey border-[1px] text-black w-96 bg-transparent' type="text" placeholder='Username' value={name} onChange={(e) => setName(e.target.value)} />
        <input className='rounded-xl h-10 pl-4 border-grey border-[1px] text-black w-96  bg-transparent' type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className='rounded-xl h-10 pl-4 text-white w-96 bg-black' type="submit" >Login</button>
      </form>
      <div className='flex-col  items-center justify-center mt-[-310px]'>
        <div className='text-black flex justify-center items-center opacity-80'>
          Don&apos;t have an account? <a className='hover:text-blue' href="#signup" onClick={() => setShowSignup(true)}> &nbsp;Register</a>
        </div>
        <h3 className='flex justify-center items-center opacity-50 text-xs select-none'>{version}</h3>

      </div>
    </div>
  );
};

export default LoginPage;
