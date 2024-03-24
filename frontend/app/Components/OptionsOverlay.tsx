"use client"
import React from "react";
import { useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket, faGear, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons/faLayerGroup";
import { faKey } from "@fortawesome/free-solid-svg-icons/faKey";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import foursquare from "../../Public/foursquare.svg";
import gridsquares from "../../Public/grid_view.svg";
import { DoLogout } from "@/wailsjs/wailsjs/go/app/App";
import DashboardIconColor from "../../Public/grid_view.svg"
import PasswordIconColor from "../../Public/password.svg"
import FolderCopyRoundedIcon from '@mui/icons-material/FolderCopyRounded';

interface OptionsOverlayProps {
  setShowGenerator: (show: boolean) => void;
  showGenerator: boolean;
  children: React.ReactNode;
  userName: string;
  setShowDashboard:(show: boolean)=> void;
  setShowProfile: (show: boolean) => void;

}

const OptionsOverlay: React.FC<OptionsOverlayProps> = ({setShowDashboard,  setShowGenerator, showGenerator, children, userName , setShowProfile}) => {

  const[showSecureFiles, setShowSecureFiles]= useState(false);

  async function Logout(){
    try{

      await DoLogout();
      setShowDashboard(false);
      
    }catch{
      alert('error al logout')
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await Logout(); 


  };

  return (


    <div id="Options" className="fixed flex flex-col justify-between 2xl:w-[20%] w-[100px]  bg-darkgray  rounded-lg  shadow-shadow ml-8 mt-8 mb-8 pt-[4.5rem] h-[92%] ">
      <div className="flex-col justify-center w-full  2xl:px-[15%]  px-[20px]  space-y-[3rem]">


        <div className='flex justify-center text-white font-bold 2xl:text-5xl text-md'>
          <span className='bg-green bg-clip-text text-transparent'>Go</span><span >Pass</span>
        </div>
        <div onClick={() => { setShowProfile(true) }} className="flex justify-center items-center text-xl space-x-2 text-back cursor-pointer ">
          <AccountCircleRoundedIcon sx={{ fontSize: 50 }} className="text-green" />
          <div className=" 2xl:flex hidden text-white font-semibold">
            {userName}
          </div>
        </div>
        <div className="space-y-2">
          <div onClick={() => { setShowGenerator(false) }} className={`flex items-center 2xl:justify-start justify-center 2xl:pl-[10%] h-14 rounded-lg  space-x-2 cursor-pointer  font-semibold 2xl:text-xl  ${!showGenerator ? ' text-green max-2xl:bg-gray' : 'text-whitegray  hover:text-whitegray opacity-75'}`}>
          
          <GridViewRoundedIcon sx={{ fontSize: 25}}/>
       
            <div className={`2xl:flex hidden `}>My Passwords</div>
          </div>
          <div onClick={() => { setShowGenerator(true) }} className={`flex items-center 2xl:justify-start justify-center 2xl:pl-[10%] h-14 rounded-lg space-x-2 cursor-pointer 2xl:text-xl xl:text-base  font-semibold ${showGenerator ? 'text-green max-2xl:bg-gray' : 'text-whitegray opacity-75 hover:opacity-100 hover:text-green'}`}>
            
            <PasswordRoundedIcon sx={{ fontSize: 25 }} />

          
            <div className=" 2xl:flex hidden">Pass Generator</div>
          </div>
          <div onClick={() => { setShowSecureFiles(false) }} className={`flex items-center 2xl:justify-start justify-center 2xl:pl-[10%] h-14 rounded-2xl space-x-2 cursor-pointer 2xl:text-xl xl:text-base  font-semibold ${showSecureFiles ? ' text-back max-2xl:bg-gray' : 'text-whitegray opacity-75 hover:opacity-100 hover:text-green'}`}>
            <FolderCopyRoundedIcon sx={{ fontSize: 25 }} />
            <div className=" 2xl:flex hidden">Secure Files</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between w-full 2xl:px-[15%]  px-[20px]  space-y-2 mt-[5.5rem] mb-5 ">
        <div onClick={() => { setShowProfile(true) }} className="flex items-center 2xl:justify-start justify-center 2xl:pl-[10%]  h-14 rounded-2xl  hover:text-green space-x-2 cursor-pointer text-xl font-semibold text-whitegray opacity-75 hover:opacity-100" >
          <SettingsRoundedIcon />
          <div className=" 2xl:flex hidden">
            Settings
          </div>
        </div>
        <div onClick={handleSubmit} className="flex items-center 2xl:justify-start justify-center 2xl:pl-[10%] h-14 rounded-2xl  hover:text-green space-x-2 cursor-pointer text-xl font-semibold text-whitegray opacity-75 hover:opacity-100">
          <ExitToAppRoundedIcon />
          <div  className=" 2xl:flex hidden">
            Log Out
          </div>
        </div>
      </div>

    </div>

  )
}

export default OptionsOverlay;