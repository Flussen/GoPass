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
interface OptionsOverlayProps {
  setShowGenerator: (show: boolean) => void;
showGenerator: boolean;
  children: React.ReactNode;
  userName: string;
}

const OptionsOverlay: React.FC<OptionsOverlayProps> = ({ setShowGenerator, showGenerator, children, userName }) => {


  return (


    <div id="Options" className="fixed flex flex-col justify-between 2xl:w-[20%] w-[100px] h-screen bg-box rounded-tr-2xl rounded-br-2xl shadow-shadow pt-20">
      <div className="flex-col justify-center w-full  2xl:px-[15%]  px-[20px]  space-y-16">


        <div className='flex justify-center text-blue font-bold 2xl:text-5xl text-md'>
          Go<span className='text-bkblue'>Pass</span>
        </div>
        <div className="flex justify-center items-center text-xl space-x-2 ">
          <AccountCircleRoundedIcon sx={{ fontSize: 50 }} />
          <div className=" 2xl:flex hidden text-grey font-semibold">
            {userName}
          </div>
        </div>
        <div className="space-y-2">
          <div onClick={() => { setShowGenerator(false) }} className={`flex items-center 2xl:justify-start justify-center 2xl:pl-[10%] h-14 rounded-2xl space-x-2 cursor-pointer  font-semibold 2xl:text-xl  ${!showGenerator ? 'bg-bgblue text-blue' : 'text-grey  hover:text-blue'}`}>
            <GridViewRoundedIcon sx={{ fontSize: 28 }} />
            <div className=" 2xl:flex hidden">My Passwords</div>
          </div>
          <div onClick={() => { setShowGenerator(true) }} className={`flex items-center 2xl:justify-start justify-center 2xl:pl-[10%] h-14 rounded-2xl space-x-2 cursor-pointer 2xl:text-xl xl:text-base  font-semibold ${showGenerator ? 'bg-bgblue text-blue' : 'text-grey  hover:text-blue'}`}>
            <PasswordRoundedIcon sx={{ fontSize: 28 }} />
            <div className=" 2xl:flex hidden">Pass Generator</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between w-full 2xl:px-[15%]  px-[20px]  space-y-2 mb-10">
        <div className="flex items-center 2xl:justify-start justify-center 2xl:pl-[10%]  h-14 rounded-2xl  hover:text-blue space-x-2 cursor-pointer text-xl font-semibold text-grey" >
          <SettingsRoundedIcon />
          <div className=" 2xl:flex hidden">
            Settings
          </div>
        </div>
        <div className="flex items-center 2xl:justify-start justify-center 2xl:pl-[10%] h-14 rounded-2xl  hover:text-red space-x-2 cursor-pointer text-xl font-semibold text-grey">
          <ExitToAppRoundedIcon />
          <div className=" 2xl:flex hidden">
            Log Out
          </div>
        </div>
      </div>

    </div>

  )
}

export default OptionsOverlay;