"use client"
import React, { use, useEffect } from 'react';
import { useState } from 'react';
import { DoLogin } from '@/wailsjs/wailsjs/go/app/App';
import { GetVersion } from '@/wailsjs/wailsjs/go/app/App';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PersonIcon from '../../Public/person.svg';
import KeyIcon from '../../Public/key.svg';
import Image from "next/image";
import Women from "../../Public/undraw_secure_login_pdn4.svg"
import Shield from "../../Public/sheild-dynamic-gradient.svg"
import LoadingComp from "../Loading"
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import World from "../../Public/world.svg"
import { request, response, models } from '@/wailsjs/wailsjs/go/models';
import RegisterOverlay from './RegisterOverlay';
import LoginOverlay from './LoginOverlay';
import RegiResult from "./RegisResult"
import RecoverOverlay from './RecoverOverlay';


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
  setTheme:(theme:string)=>void;
  theme:string;
}

interface LoginState {
  token: string;
  userKey: string;

}



const Login: React.FC<LoginProps> = ({ setShowSignup, version, setUserKey, setUserName, setShowDashboard, setIsLoading, setToken, setTheme, theme }) => {


  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordIncorrect, setPasswordIncorrect] = useState(false);
  const [loadingIsOpen, setLoadingIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSeed, setShowSeed] = useState(false);
  const [seedList, setSeedList] = useState(['']);
  const [showRecover, setShowRecover] = useState(false);
 const[startTemp, setSartTemp] = useState(false)

  






  
  return (
    <div id='login' className=' h-screen'>
      {/* Header */}
      <div className='flex justify-between items-center px-[5%] pt-[3%]'>

        <div className=' font-bold text-4xl'>
          <span className='bg-primary bg-clip-text text-transparent'>Go</span> <span className='text-whitebg'>Pass</span>
        </div>
        <div className='bg-darkgray p-2 flex justify-center items-center rounded-full h-12 w-12'>
          <MenuRoundedIcon className='text-primary' sx={{ fontSize: 24 }} />
        </div>
      </div>
      {/* Login Box */}
      <div className=' flex justify-center items-center h-[83%] pb-[3%]  mt-10'>
        <div className='xl:grid xl:grid-cols-2 flex flex-col justify-center  w-[90%] h-full rounded-lg bg-darkgray  max-xl:py-20  '>
          <div className='flex flex-col justify-center max-xl:items-center rounded-lg text-whitebg xl:pl-[15%] '>
            <div className='text-whitegray text-2xl font-semibold'>
              Welcome to
            </div>
            <div className='text-7xl font-bold mb-5'>
              <span className='text-primary'>Go</span> Pass
            </div>
            <div className='max-xl:hidden  text-2xl text-whitegray'>
              Your Open Source password manager with local storage. Security and privacity in your control.
            </div>
          </div>
          <div className='flex flex-col justify-center items-center h-full  font-semibold text-lg space-y-3 '>

            <div className='text-4xl font-semibold text-whitebg mb-6'>
              Join Now!
            </div>
            <div className="flex items-center w-full  px-[15%] mb-4 ">
              <button onClick={() => setShowRegister(true)} className='flex items-center justify-center w-full h-12 bg-primary text-black  rounded-full group hover:bg-darkprimary'>
                Register
              </button>
            </div>

            <div className='text-whitebg font-medium'>
              Alredy have an account?
            </div>
            <div className="flex items-center w-full  px-[15%] mb-4 ">
              <button onClick={() => setShowLogin(true)} className='flex items-center justify-center w-full h-12 bg-black border-2 border-primary text-whitebg  rounded-full group hover:bg-darkprimary'>
                Login
              </button>
            </div>
            <h3 className='flex justify-center items-center  text-xs select-none text-gray'>{version}</h3>

          </div>
        </div>

      </div>
      <RegisterOverlay setIsLoading={setIsLoading} isOpen={showRegister} onClose={() => setShowRegister(!showRegister)} setShowSeed={setShowSeed} setSeedList={setSeedList} setStartTemp={setSartTemp}>
        <></>
      </RegisterOverlay>
      <LoginOverlay isOpen={showLogin} onClose={() => setShowLogin(!showLogin)} setShowRecover={setShowRecover} setUserKey={setUserKey}  setUserName={setUserName}  setShowDashboard={setShowDashboard} setTheme={setTheme} theme={theme}>
        <></>
      </LoginOverlay>
      <RegiResult isOpen={showSeed} onClose={() => setShowSeed(!showSeed)} seedList={seedList} startTemp={startTemp} setStartTemp={setSartTemp}/>
      <RecoverOverlay isOpen={showRecover} onClose={() => setShowRecover(!showRecover)} />

    </div>
  );
};

export default Login;