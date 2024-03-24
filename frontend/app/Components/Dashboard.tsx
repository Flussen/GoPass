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

interface DashboardProps {
  setShowGenerator: (show: boolean) => void;
  showGenerator: boolean;
  userKey: string;
  userName: string;
  setShowDashboard: (show: boolean) => void;
  setShowProfile: (show: boolean) => void;
showDashboard: boolean;
}



const Dashboard: React.FC<DashboardProps> = ({ showDashboard,setShowProfile, setShowDashboard, setShowGenerator, showGenerator, userKey, userName }) => {
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
  const [arePasswords, setArePasswords] = useState(true)




  return (
    <div id="Dashboard" className='flex justify-between h-full '>

      <OptionsOverlay
        setShowGenerator={setShowGenerator}
        showGenerator={showGenerator}
        userName={userName}
        setShowDashboard={setShowDashboard}
        setShowProfile={setShowProfile}      >
        <></>
      </OptionsOverlay>
      <div className="flex flex-col justify-start items-center  w-[100%] px-16 pt-20  2xl:ml-[19%] ml-[8.5%]">
        <div id="HEADER" className="flex justify-between w-full rounded-lg text-xl 
        py-3 mb-24">
          <div className='flex items-center   '>
            <SearchRoundedIcon sx={{ fontSize: 28 }} className="absolute ml-4 text-green" />
            <input value={titlee} onChange={titlesearch} type="text" className='flex rounded-lg text-white  pl-14 lg:w-[40rem] w-[31.3rem] h-12 bg-darkgray font-medium focus:outline-none placeholder-gray' placeholder='Buscar' />
          </div>
          <div className="flex items-center space-x-5">
            
            <div className="flex justify-center items-center h-12 px-3 bg-darkgray rounded-lg text-green font-semibold space-x-2">
              
              <MenuRoundedIcon sx={{ fontSize: 28 }} />
            </div>
          </div>
        </div>
        <div id="MyPasswords" className="flex flex-col justify-center w-full px-3 font-semibold space-y-5 text mb-5">
          <div className="flex justify-between  items-center">
            <div className="text-5xl text-green font-bold">
              My <span className="  text-white">Password</span>
            </div>
            <div onClick={() => setIsAddOverlayOpen(!isAddOverlayOpen)} className="flex justify-center items-center h-12 bg-green hover:bg-darkgreen rounded-lg cursor-pointer  text-xl ">
              <div className={`flex justify-center items-center   w-full  px-5 rounded-md space-x-1 text-darkgray `}>
                <AddRoundedIcon sx={{ fontSize: 28 }} />
                <div >
                  New
                </div>
              </div>
            </div>

            <AddOverlay isOpen={isAddOverlayOpen} onClose={() => setIsAddOverlayOpen(!isAddOverlayOpen)} userKey={userKey} userName={userName} setArePasswords={setArePasswords} >
              <>
              </>
            </AddOverlay>
          </div>

          {
            arePasswords ?
              <div className="flex w-full pl-5 text-whitegray">

                <div className="basis-3/6">
                  Name
                </div>
                <div className="basis-2/6">
                  Password
                </div>
                <div className="basis-1/6">
                  Status
                </div>
              </div> :
              <div className="mb-20">
              </div>
          }



          
        </div>
        {
          arePasswords?
          <PasswordComp 
          isAddOverlayOpen={isAddOverlayOpen} showDashboard={showDashboard} userName={userName} userKey={userKey} search={titlee} arePasswords={arePasswords} setArePasswords={setArePasswords} setIsAddOverlayOpen={setIsAddOverlayOpen} />

          :
          <div className="text-white w-full flex-col flex justify-center items-center space-y-7 ">
          <div className="text-2xl">
              Add your first password!
          </div>
          <div onClick={() => setIsAddOverlayOpen(!isAddOverlayOpen)} className="flex items-center  bg-green rounded-lg h-12 group hover:bg-darkgreen">
              <button className=" px-7 text-black rounded-md font-medium ">
                  Add Password
              </button>
          </div>

      </div>
        }
       
      </div>



    </div>





  )
}

export default Dashboard