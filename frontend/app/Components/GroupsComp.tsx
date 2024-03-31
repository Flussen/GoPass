"use client"

import React, { useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faBars, faEllipsis, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import ProfileOverlay from './ProfileOverlay';
import AddOverlay from './AddOverlay';
import OptionsOverlay from "./OptionsOverlay";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import FormatLineSpacingRoundedIcon from '@mui/icons-material/FormatLineSpacingRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import GppGoodRoundedIcon from '@mui/icons-material/GppGoodRounded';
import { DoSaveUserPassword } from "@/wailsjs/wailsjs/go/app/App";
import PasswordComp from "./PasswordComp"
import { GetUserPasswords } from "@/wailsjs/wailsjs/go/app/App";
import SearchIcon from "../../Public/search.svg"
import Image from "next/image"
import AddIcon from "../../Public/add.svg"
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import useTranslation from 'next-translate/useTranslation';


interface GroupProps{
    setOptionName: (show: string) => void;
    optionName: string;
    userKey: string;
    userName: string;
    setShowDashboard: (show: boolean) => void;
    setShowProfile: (show: boolean) => void;
    showDashboard: boolean;
}

const Groups: React.FC<GroupProps> = ({showDashboard, setShowProfile, setShowDashboard, setOptionName, optionName, userKey, userName}) =>{
    const [titlee, setTitlee] = useState('')
  const titlesearch = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setTitlee(event.target.value);
  };
  const [isAddOverlayOpen, setIsAddOverlayOpen] = useState(false);
  const [arePasswords, setArePasswords] = useState(true)

    return(
        <div id="Dashboard" className='flex justify-between h-full '>

<OptionsOverlay
        setOptionName={setOptionName}
        optionName={optionName}
        userName={userName}
        setShowDashboard={setShowDashboard}
        setShowProfile={setShowProfile}      >
        <></>
      </OptionsOverlay>
      <div className="flex flex-col justify-start items-start  w-[84%] ml-[16%] p-12 h-full ">
        <div id="HEADER" className="flex justify-between w-full rounded-lg text-base mb-16 ">
          <div className='flex items-center   '>
            <SearchRoundedIcon sx={{ fontSize: 24 }} className="absolute ml-5 text-primary" />
            <input value={titlee} onChange={titlesearch} type="text" className='flex rounded-full text-whitebg  pl-14 w-[34rem] h-12 bg-darkgray font-medium focus:outline-none placeholder-gray' placeholder='Buscar' />
          </div>
          <div className="flex items-center space-x-6 ">
            <div className="flex items-center">
              <div className="flex absolute justify-center items-center h-12 w-12 bg-primary rounded-full font-semibold space-x-2">

                <DarkModeRoundedIcon sx={{ fontSize: 24 }} />
              </div>
              <div className="flex justify-end items-center pr-2 h-11 w-24 border-2 border-gray rounded-full text-whitebg ">
                <WbSunnyRoundedIcon sx={{ fontSize: 24 }} />
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex absolute justify-center items-center h-12 w-12 bg-primary rounded-full font-semibold space-x-2">

                <AccountCircleRoundedIcon sx={{ fontSize: 36 }} />
              </div>
              <div className="h-11 w-48 border-2 rounded-full border-gray text-white flex justify-between items-center text-base pl-14 pr-3">
                <div>
                BustaLover 
                           </div>
                <ExpandMoreRoundedIcon sx={{ fontSize: 24 }} />

              </div>
            </div>

          </div>
        </div>
       


      </div>



    </div>
    )
}

export default Groups;