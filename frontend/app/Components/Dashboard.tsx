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


interface DashboardProps {
  setShowGenerator: (show: boolean) => void;
  showGenerator: boolean;
  userKey: string;
  userName: string;
}


const Dashboard: React.FC<DashboardProps> = ({ setShowGenerator, showGenerator, userKey, userName }) => {
  const [email, setEmail] = useState("example@gmail.com");
  const emailchange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setEmail(event.target.value);
  };
  const [titlee, setTitlee] = useState('')
  const titlesearch = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setTitlee(event.target.value);
  };
  const [isProfileOverlayOpen, setIsProfileOverlayOpen] = useState(false);
  const [isAddOverlayOpen, setIsAddOverlayOpen] = useState(false);
  



  return (
    <div id="Dashboard" className='flex justify-between bg-back h-screen '>

      <OptionsOverlay
        setShowGenerator={setShowGenerator}
        showGenerator={showGenerator}
        userName={userName}
      >
        <></>
      </OptionsOverlay>
      <div className="flex flex-col justify-start items-center  w-[100%] px-16 pt-16 space-y-24 2xl:ml-[20%] ml-[8.5%]">
        <div id="HEADER" className="flex justify-between w-full rounded-2xl bg-box h-20 px-3 shadow-shadow text-xl">
          <div className='flex items-center  '>
            <SearchRoundedIcon sx={{ fontSize: 28 }} className='absolute ml-4 text-grey ' />
            <input value={titlee} onChange={titlesearch} type="text" className='flex rounded-xl border-grey border-[2px] pl-12 lg:w-[34rem] w-[31.3rem] h-14 py-2 bg-transparent font-semibold focus:outline-none placeholder-lightgrey' placeholder='Buscar' />
          </div>
          <div className="flex items-center space-x-5">
            <div className="flex justify-center items-center h-14 px-3 border-2 border-lightgrey rounded-xl text-grey font-semibold space-x-2">
              <div>
                Filter
              </div>
              <FilterAltRoundedIcon />

            </div>
            <div className="flex justify-center items-center h-14 px-3 border-2 border-lightgrey rounded-xl text-grey font-semibold space-x-2">
              <div>
                Sort
              </div>
              <FormatLineSpacingRoundedIcon sx={{ fontSize: 28 }} />
            </div>
          </div>
        </div>
        <div id="MyPasswords" className="flex flex-col justify-center w-full px-3 font-semibold space-y-5 text">
          <div className="flex justify-between  items-center">
            <div className="text-5xl font-bold">
              My Password
            </div>
            <div onClick={() => setIsAddOverlayOpen(!isAddOverlayOpen)} className="flex justify-center items-center bg-blue h-14 px-7 rounded-2xl text-back cursor-pointer  text-xl">
              <AddRoundedIcon sx={{ fontSize: 28 }} />
              <div>
                New
              </div>
            </div>
            <AddOverlay isOpen={isAddOverlayOpen} onClose={() => setIsAddOverlayOpen(!isAddOverlayOpen)} userKey={userKey} userName={userName} >
              <>
              </>
            </AddOverlay>
          </div>
          <div className="flex w-full pl-5 text-grey">
            <div className="basis-3/6">
              Name
            </div>
            <div className="basis-2/6">
              Password
            </div>
            <div className="basis-1/6">
              Status
            </div>
          </div>


          <PasswordComp isAddOverlayOpen={isAddOverlayOpen} userName={userName} userKey={userKey} search={titlee} />

        </div>
      </div>



    </div>





  )
}

export default Dashboard