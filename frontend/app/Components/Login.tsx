"use client"
import React, { use } from 'react';
import { useState } from 'react';
import { DoLogin } from '@/wailsjs/wailsjs/go/app/App';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PersonIcon from '../../Public/person.svg';
import KeyIcon from '../../Public/key.svg';
import Image from "next/image";
import Women from "../../Public/undraw_secure_login_pdn4.svg"
import Shield from "../../Public/sheild-dynamic-gradient.svg"
import LoadingComp from "./Loading"

interface LoginProps {
  setShowSignup: (value: boolean) => void;
  version: string;
  token: string;
  userKey: string;
  setUserKey: (userKey: string) => void;
  setUserName: (userKey: string) => void;
  setShowDashboard: (show: boolean) => void;
  setIsLoading: (show: boolean) => void;
  setToken: (toke: string) => void;
}

interface LoginState {
  token: string;
  userKey: string;
}



const Login: React.FC<LoginProps> = ({ setShowSignup, version, setUserKey, setUserName, setShowDashboard, setIsLoading, setToken }) => {


  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordIncorrect, setPasswordIncorrect] = useState(false);
 const [loadingIsOpen, setLoadingIsOpen] = useState(false);

  async function pullLogin() {
    
setLoadingIsOpen(true)
    try {
      const response = await DoLogin(name, password);
      console.log(response)
      const result = JSON.parse(response) as LoginState;
      console.log(result)
      if (result.token !== null && result.token !== '' && result.userKey !== null && result.userKey !== '') {
        setUserKey(result.userKey);
        setShowDashboard(true);
        console.log('Token Saved:' + result.token)

      }
    } catch (error) {
      console.log(error)
      setPasswordIncorrect(true)
    } finally{
      setLoadingIsOpen(false)
    }
  }


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Previene la recarga de la página
    await pullLogin(); // Llama a la función pullLogin
    // Simula una carga o espera por una operación asíncrona

  };
  return (
    <div id='login' className='bg-black h-screen'>
      {/* Header */}
      <div className='flex justify-between items-center px-[5%] pt-[3%]'>

        <div className=' font-bold text-5xl'>
          <span className='bg-gradient bg-clip-text text-transparent'>Go</span> <span className='text-back'>Pass</span>
        </div>
        <div className='border-2 border-border p-2 flex justify-center items-center rounded-lg '>
          <MenuRoundedIcon className='text-darkgrey' sx={{ fontSize: 40 }} />
        </div>
      </div>
      {/* Login Box */}
      <div className=' flex justify-center items-center  mt-10'>
        <div className='xl:grid xl:grid-cols-2 flex justify-center w-[90%] rounded-lg border-2 border-border bg-blackbox  max-xl:py-20  '>
          <div className='hidden xl:flex justify-center items-center xl:opacity-100'>

            <Image src={Shield} alt='Women' className='absolute2xl:scale-100 scale-80 moveCircle' />
          </div>

          <form onSubmit={handleSubmit}>
            <div className='flex flex-col justify-center items-center h-full font-semibold text-xl '>
              <div className='text-5xl font-bold mb-12 text-back '>
                <span className='bg-gradient bg-clip-text text-transparent'>Welcome</span>  Back!
              </div>
              <div className='flex items-center w-full 2xl:px-40 xl:px-24 mb-4 '>
                <Image src={PersonIcon} alt='persona' className='absolute ml-4' />
                <input autoComplete="nope" type="text" className='flex rounded-lg border-border border-[2px] pl-12  text-back xl:w-full w-[34rem] h-14 py-2 bg-black focus:outline-none placeholder:text-darkgrey' placeholder='Username' value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className='flex items-center w-full 2xl:px-40 xl:px-24 mb-4  '>
                <Image src={KeyIcon} alt='key' className='absolute ml-4' />
                <input autoComplete="nope" type="password" className='flex rounded-lg border-border text-back border-[2px] pl-12 w-full h-14 py-2 focus:outline-none bg-black placeholder:text-darkgrey' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />

              </div>
              <div className={`flex items-center w-full 2xl:px-40 xl:px-24 ${passwordIncorrect ? 'mb-2' : 'mb-4'} `} >
                <div className=' flex  w-full rounded-lg p-0.5 bg-gradient bn5 '>
                  <button className='flex items-center justify-center w-full h-14 bg-black rounded-lg group'>
                    <span className='bg-gradient bg-clip-text text-transparent group-hover:text-back'>
                      Login
                    </span>
                  </button>


                </div>

              </div>
              {
                passwordIncorrect ? <span className='text-red text-sm mb-1  '>Incorrect Credentials</span>
                  :
                  <></>
              }

              <div className='text-back font-medium'>
                I dont have an account. <span className='font-semibold cursor-pointer bg-gradient bg-clip-text text-transparent' onClick={() => setShowSignup(true)}> Register</span>
              </div>
              <h3 className='flex justify-center items-center opacity-50 text-xs select-none text-grey'>{version}</h3>
            </div>
          </form>
{loadingIsOpen?
          <LoadingComp/>:
          <></>}
        </div>

      </div>
    </div>
  );
};

export default Login;