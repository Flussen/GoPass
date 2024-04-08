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
  setOptionName: (show: string) => void;
  optionName: string;
  children: React.ReactNode;
  userName: string;
  setShowDashboard: (show: boolean) => void;
  setShowProfile: (show: boolean) => void;

}

const OptionsOverlay: React.FC<OptionsOverlayProps> = ({ setShowDashboard, setOptionName, optionName, children, userName, setShowProfile }) => {

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


    <div id="Options" className="fixed flex flex-col justify-between xl:w-[16%] w-[75px]  dark:bg-darkgray bg-white  py-12   h-full ">
      <div className="flex-col justify-center w-full  ">


        <div className='flex justify-center bg-gray text-white h-12 w-full'>

        </div>

        <div className="">
          <div onClick={() => { setOptionName('') }} className={`flex items-center xl:justify-start justify-center w-full  border-l-2  h-16 space-x-2 cursor-pointer dark:text-whitegray text-gray  font-semibold xl:text-xl xl:pl-5 ${optionName == '' ? ' dark:bg-black bg-whitebg border-primary' : ' dark:hover:text-blackwhite dark:border-darkgray hover:text-darkgray border-white'}`}>

            <GridViewRoundedIcon sx={{ fontSize: 32 }} />

            <div className={`xl:flex hidden `}>Dashboard</div>
          </div>
          <div onClick={() => { setOptionName('Groups') }} className={`flex items-center xl:justify-start justify-center w-full  border-l-2 h-16 space-x-2 cursor-pointer dark:text-whitegray text-gray font-semibold xl:text-xl xl:pl-5 ${optionName == 'Groups' ? 'dark:bg-black bg-whitebg border-primary' : 'dark:hover:text-blackwhite dark:border-darkgray hover:text-darkgray border-white'}`}>

            <WysiwygRoundedIcon sx={{ fontSize: 32 }} />


            <div className=" xl:flex hidden">My Groups</div>
          </div>
          <div onClick={() => { setOptionName('Cards') }} className={`flex items-center xl:justify-start justify-center w-full border-l-2  h-16 space-x-2 cursor-pointer dark:text-whitegray text-gray font-semibold xl:text-xl xl:pl-5 ${optionName == 'Cards' ? 'dark:bg-black bg-whitebg border-primary' : 'dark:hover:text-blackwhite dark:border-darkgray hover:text-darkgray border-white '}`}>

            <CreditCardRoundedIcon sx={{ fontSize: 32 }} />


            <div className=" xl:flex hidden">My Cards</div>
          </div>
          <div onClick={() => { setOptionName('Generator') }} className={`flex items-center xl:justify-start justify-center w-full   border-l-2 h-16 space-x-2 cursor-pointer dark:text-whitegray text-gray  font-semibold xl:text-xl xl:pl-5 ${optionName == 'Generator' ? 'dark:bg-black bg-whitebg border-l-2 border-primary' : 'dark:hover:text-blackwhite dark:border-darkgray hover:text-darkgray border-white'}`}>

            <PasswordRoundedIcon sx={{ fontSize: 32 }} />


            <div className=" xl:flex hidden"> <span className="2xl:flex hidden">Pass&nbsp;</span>Generator</div>
          </div>
          <div onClick={() => { setShowSecureFiles(false) }} className={`flex items-center xl:justify-start justify-center w-full  border-l-2  h-16 space-x-2 cursor-pointer dark:text-whitegray text-gray font-semibold xl:text-xl xl:pl-5 ${showSecureFiles ? ' bg-black border-l-2 border-primary' : 'dark:hover:text-blackwhite dark:border-darkgray hover:text-darkgray border-white'}`}>
            <FolderRoundedIcon sx={{ fontSize: 32 }} />
            <div className=" xl:flex hidden">Secure Files</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between w-full      mt-[5.5rem]  ">
        <div onClick={() => { setShowProfile(true) }} className={`flex items-center xl:justify-start justify-center w-full  border-l-2  h-16 space-x-2 cursor-pointer dark:text-whitegray text-gray  font-semibold xl:text-xl xl:pl-5 ${showSecureFiles ? ' bg-black border-l-2 border-primary' : 'dark:hover:text-blackwhite dark:border-darkgray hover:text-darkgray border-white'}`}>
          <SettingsRoundedIcon sx={{ fontSize: 32 }} />
          <div className=" xl:flex hidden">Settings</div>
        </div>
        <div onClick={handleSubmit} className={`flex items-center xl:justify-start justify-center w-full  border-l-2  h-16 space-x-2 cursor-pointer dark:text-whitegray text-gray font-semibold xl:text-xl xl:pl-5 dark:hover:text-blackwhite dark:border-darkgray hover:text-darkgray border-white`}>
          <ExitToAppRoundedIcon sx={{ fontSize: 32 }} />
          <div className=" xl:flex hidden">Log Out</div>
        </div>
      </div>

    </div>

  )
}

export default OptionsOverlay;