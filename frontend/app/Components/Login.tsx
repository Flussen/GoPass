"use client"
import React from 'react';
import { useState } from 'react';
import { DoLogin } from '@/wailsjs/wailsjs/go/app/App';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import Image from "next/image";
import Women from "../../Public/undraw_secure_login_pdn4.svg"



interface LoginProps {
  setShowSignup: (value: boolean) => void;
  handleLoginSignup: () => void; // Añadir esta línea
  version: string;
  token: string;
  userKey: string;
  setUserKey: (userKey: string) =>void;
  setUserName: (userKey: string) =>void;
  setShowDashboard: (show: boolean) => void;
 setIsLoading: (show: boolean) => void;
}

interface LoginState {
  token: string;
  userKey: string;
}



const Login: React.FC<LoginProps> = ({ setShowSignup, handleLoginSignup, version, setUserKey, setUserName,setShowDashboard, setIsLoading }) => {


  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  async function pullLogin() {
    setIsLoading(true); 

    try {
      const response = await DoLogin(name, password);
      const result = JSON.parse(response) as LoginState;
      if (result.token !== null && result.token !== '' && result.userKey !== null && result.userKey !== '') {
        setUserKey(result.userKey);
        setUserName(name);
        setShowDashboard(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      
    } finally {
      setIsLoading(false); 
    }
  }


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Previene la recarga de la página
    await pullLogin(); // Llama a la función pullLogin
    // Simula una carga o espera por una operación asíncrona
    
  };
  return (
    <div id='login' className='bg-back'>
      {/* Header */}
      <div className='flex justify-between items-center px-[5%] pt-[3%]'>

        <div className='text-blue font-bold text-5xl'>
          Go<span className='text-bkblue'>Pass</span>
        </div>
        <div className='border-2 border-lightgrey p-2 flex justify-center items-center rounded-xl '>
          <MenuRoundedIcon className='text-grey' sx={{ fontSize: 40 }} />
        </div>
      </div>
      {/* Login Box */}
      <div className=' flex justify-center items-center   mt-10'>
        <div className='xl:grid xl:grid-cols-2 flex justify-center w-[90%] rounded-xl py-32  bg-box shadow-shadow '>
          <div className='hidden xl:flex justify-center items-center xl:opacity-100'>

            <Image src={Women} alt='Women' className='2xl:scale-100 scale-80' />
          </div>

          <form onSubmit={handleSubmit}>
            <div className='flex flex-col justify-center items-center h-full space-y-4 font-semibold text-xl '>
              <div className='text-5xl font-bold mb-8'>
                Welcome Back!
              </div>
              <div className='flex items-center w-full 2xl:px-40 xl:px-24 '>
                <PersonIcon className='absolute ml-4 text-grey' />
                <input type="text" className='flex rounded-2xl border-grey border-[2px] pl-12  xl:w-full w-[34rem] h-14 py-2 bg-transparent focus:outline-none' placeholder='Username' value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className='flex items-center w-full 2xl:px-40 xl:px-24 '>
                <KeyIcon className='absolute ml-4 text-grey ' />
                <input type="password" className='flex rounded-2xl  border-grey border-[2px] pl-12 w-full h-14 py-2 focus:outline-none bg-transparent' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className='flex items-center w-full 2xl:px-40 xl:px-24 ' >
                <button className='flex items-center justify-center w-full h-14 bg-blue rounded-2xl text-back'>
                  Login
                </button>
              </div>

              <div className='text-grey font-medium'>
                I dont have an account. <span className='text-blue font-semibold cursor-pointer' onClick={() => setShowSignup(true)}>Register</span>
              </div>
              <h3 className='flex justify-center items-center opacity-50 text-xs select-none text-grey'>{version}</h3>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;