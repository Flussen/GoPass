"use client"
import React from 'react';
import {Register} from '@/wailsjs/wailsjs/go/main/App';

interface SignupProps {
  setShowSignup: (value: boolean) => void;
  handleLoginSignup: () => void;
  version: string;
}



const Signup: React.FC<SignupProps> = ({ setShowSignup, version, handleLoginSignup }) => {

    let username= document.getElementById('username')

    async function pullRegister(username: string, email: string, password: string){

        try {
            const response = await Register(username, email, password);
            if (response){
                handleLoginSignup();
            }else {
                alert('Error al registrar usuario');
            }
        } catch (error) {
            console.error('Error fetching version:', error);
        }
      }

    


  return (
    <div className='flex flex-col items-center justify-center h-screen space-y-2' id='signup'>
      <h1 className='w-full flex justify-center text-3xl font-semibold mb-8'>SIGN UP</h1>
      
      <input className='rounded-xl h-10 pl-4 border-grey border-[1px] text-black w-96 bg-transparent' type="text" placeholder='Username' id="username"/>
      <input className='rounded-xl h-10 pl-4 border-grey border-[1px] text-black w-96 bg-transparent' type="text" placeholder='Email' />
      <input className='rounded-xl h-10 pl-4 border-grey border-[1px] text-black w-96 bg-transparent' type="password" placeholder='Password' />

      <button className='rounded-xl h-10 pl-4 text-white w-96 bg-black' type="submit" >Sign Up</button>
     
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
