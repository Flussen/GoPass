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
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import WysiwygRoundedIcon from '@mui/icons-material/WysiwygRounded';
interface OptionsOverlayProps {
  setShowGenerator: (show: boolean) => void;
  showGenerator: boolean;
  children: React.ReactNode;
  userName: string;
  setShowDashboard: (show: boolean) => void;
  setShowProfile: (show: boolean) => void;

}

const OptionsOverlay: React.FC<OptionsOverlayProps> = ({ setShowDashboard, setShowGenerator, showGenerator, children, userName, setShowProfile }) => {

  const [showSecureFiles, setShowSecureFiles] = useState(false);

  async function Logout() {
    try {

      await DoLogout();
      setShowDashboard(false);

    } catch {
      alert('error al logout')
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await Logout();


  };

  return (


    <div id="Options" className="fixed flex flex-col justify-between 2xl:w-[16%] w-[100px]  bg-darkgray  py-[2.5%]   h-full ">
      <div className="flex-col justify-center w-full  ">


        <div className='flex justify-center bg-gray text-white h-12 w-full'>

        </div>

        <div className="">
          <div onClick={() => { setShowGenerator(false) }} className={`flex items-center 2xl:justify-start justify-center w-full  h-16 space-x-2 cursor-pointer text-whitegray  font-semibold 2xl:text-xl pl-5 ${!showGenerator ? ' bg-black border-l-2 border-primary' : ' hover:text-blackwhite'}`}>

            <GridViewRoundedIcon sx={{ fontSize: 32 }} />

            <div className={`2xl:flex hidden `}>Dashboard</div>
          </div>
          <div onClick={() => { setShowGenerator(false) }} className={`flex items-center 2xl:justify-start justify-center w-full h-16 space-x-2 cursor-pointer text-whitegray  font-semibold 2xl:text-xl pl-5 ${false ? 'bg-black border-l-2 border-primary' : 'hover:text-blackwhite'}`}>

            <WysiwygRoundedIcon sx={{ fontSize: 32 }} />


            <div className=" 2xl:flex hidden">My Groups</div>
          </div>
          <div onClick={() => { setShowGenerator(false) }} className={`flex items-center 2xl:justify-start justify-center w-full  h-16 space-x-2 cursor-pointer text-whitegray  font-semibold 2xl:text-xl pl-5 ${false ? 'bg-black border-l-2 border-primary' : 'hover:text-blackwhite'}`}>

          <CreditCardRoundedIcon sx={{ fontSize: 32 }} />


<div className=" 2xl:flex hidden">My Cards</div>
          </div>
          <div onClick={() => { setShowGenerator(true) }} className={`flex items-center 2xl:justify-start justify-center w-full  h-16 space-x-2 cursor-pointer text-whitegray  font-semibold 2xl:text-xl pl-5 ${showGenerator ? 'bg-black border-l-2 border-primary' : 'hover:text-blackwhite'}`}>

            <PasswordRoundedIcon sx={{ fontSize: 32 }} />


            <div className=" 2xl:flex hidden">Pass Generator</div>
          </div>
          <div onClick={() => { setShowSecureFiles(false) }} className={`flex items-center 2xl:justify-start justify-center w-full  h-16 space-x-2 cursor-pointer text-whitegray  font-semibold 2xl:text-xl pl-5 ${showSecureFiles ? ' bg-black border-l-2 border-primary' : 'hover:text-blackwhite'}`}>
            <FolderRoundedIcon sx={{ fontSize: 32 }} />
            <div className=" 2xl:flex hidden">Secure Files</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between w-full 2xl:px-[15%]  px-[20px]  space-y-2 mt-[5.5rem]  ">
        <div onClick={() => { setShowProfile(true) }} className="flex items-center 2xl:justify-start justify-center 2xl:pl-[10%]  h-14 rounded-2xl  hover:text-primary space-x-2 cursor-pointer text-xl font-semibold text-whitegray opacity-75 hover:opacity-100" >
          <SettingsRoundedIcon />
          <div className=" 2xl:flex hidden">
            Settings
          </div>
        </div>
        <div onClick={handleSubmit} className="flex items-center 2xl:justify-start justify-center 2xl:pl-[10%] h-14 rounded-2xl  hover:text-primary space-x-2 cursor-pointer text-xl font-semibold text-whitegray opacity-75 hover:opacity-100">
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