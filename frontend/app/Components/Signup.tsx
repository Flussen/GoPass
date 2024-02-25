"use client"
import React from 'react';
import { DoRegister } from '@/wailsjs/wailsjs/go/app/App';
import { useState } from 'react';

interface SignupProps {
  setShowSignup: (value: boolean) => void;
  handleLoginSignup: () => void;
  version: string;
}



const Signup: React.FC<SignupProps> = ({ setShowSignup, version, handleLoginSignup }) => {



  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function pullRegister() {

    try {
      const response = await DoRegister(name, email, password);
      if (response) {
        handleLoginSignup();
      } else {
        alert('Error al registrar usuario '+ response);
      }
    } catch (error) {
      console.error('Error fetching version:', error);
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Previene la recarga de la página
    await pullRegister(); // Llama a la función pullRegister
  };


  return (
    <div className='flex flex-col items-center justify-center h-screen space-y-2' id='signup'>
      <h1 className='w-full flex justify-center text-3xl font-semibold mb-8'>SIGN UP</h1>
      <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center space-y-2 w-screen'>

        <input className='rounded-xl h-10 pl-4 border-grey border-[1px] text-black w-96 bg-transparent' type="text"  placeholder='Username' id="name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className='rounded-xl h-10 pl-4 border-grey border-[1px] text-black w-96 bg-transparent' type="email" placeholder='Email' id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className='rounded-xl h-10 pl-4 border-grey border-[1px] text-black w-96 bg-transparent' type="password" minLength={8} placeholder='Password' id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className='rounded-xl h-10 pl-4 text-white w-96 bg-black' type="submit" >Sign Up</button>
      </form>
      <div className='flex-col items-center justify-center mt-[-310px]'>
        <div className='text-black flex justify-center items-center opacity-80'>
          Already have an account? <a className='hover:text-blue' href="#login" onClick={() => setShowSignup(false)}>&nbsp;Login</a>
        </div>
        <h3 className='flex justify-center items-center opacity-50 text-xs select-none'>{version}</h3>
      </div>
    </div>
  );
};

export default Signup;
