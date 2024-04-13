"use client"

import React, { useState } from "react";
import AddOverlay from './AddPass';
import OptionsOverlay from "../OptionsOverlay";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PasswordComp from "./PasswordComp"
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import HeaderComp from "../HeaderComp";

interface DashboardProps {
  setOptionName: (show: string) => void;
  optionName: string;
  userKey: string;
  userName: string;
  setShowDashboard: (show: boolean) => void;
  setShowProfile: (show: boolean) => void;
  showDashboard: boolean;
  setTheme:(theme:string)=>void;
    theme:string;
}



const Dashboard: React.FC<DashboardProps> = ({ showDashboard, setShowProfile, setShowDashboard, setOptionName, optionName, userKey, userName, setTheme, theme }) => {
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
    <div id="Dashboard" className='flex justify-between h-full  '>

      <OptionsOverlay
        setOptionName={setOptionName}
        optionName={optionName}
        userName={userName}
        setShowDashboard={setShowDashboard}
        setShowProfile={setShowProfile}      >
        <></>
      </OptionsOverlay>
      <div className="flex flex-col justify-start items-start  xl:w-[84%] w-full xl:ml-[16%] ml-[75px] p-12 h-full ">
      <HeaderComp optionName={optionName} userName={userName} setTheme={setTheme} theme={theme} />
        
        <div className=" flex w-full space-x-6 h-5/6 ">
          <div className="xl:w-[65%] w-[70%]   ">
            <div id="MyPasswords" className="flex flex-col justify-start  w-full font-semibold space-y-5 text mb-5">
              <div className="flex justify-between  items-center">
                <div className=" text-responsivo  text-darkgray font-bold dark:text-whitebg">
                  My <span className="  text-primary">Password</span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex justify-center items-center text-base space-x-2 text-blackwhite hover:text-gray dark:text-gray dark:hover:text-whitebg h-12 dark:bg-darkgray bg-white rounded-full w-24 cursor-pointer ">

                    <div>
                      Sort
                    </div>
                    <SortRoundedIcon sx={{ fontSize: 24 }} />

                  </div>
                  
                  <div onClick={() => setIsAddOverlayOpen(!isAddOverlayOpen)} className="flex justify-center items-center h-12 bg-primary rounded-full cursor-pointer w-44 text-xl space-x-2 text-whitebg dark:text-black ">

                    <AddRoundedIcon sx={{ fontSize: 24 }} />
                    <div >
                      New Pass
                    </div>
                  </div>
                </div>
                <AddOverlay isOpen={isAddOverlayOpen} onClose={() => setIsAddOverlayOpen(!isAddOverlayOpen)} userKey={userKey} userName={userName} setArePasswords={setArePasswords} >
                  <>
                  </>
                </AddOverlay>
              </div>
            </div>
            {
              arePasswords ?
                <PasswordComp
                  isAddOverlayOpen={isAddOverlayOpen} showDashboard={showDashboard} userName={userName} userKey={userKey} search={titlee} arePasswords={arePasswords} setArePasswords={setArePasswords} setIsAddOverlayOpen={setIsAddOverlayOpen} />
                :
                <div className="text-whitebg font-semibold w-full flex-col flex justify-center items-center space-y-7 ">
                  <div className="text-2xl">
                    Add your first password!
                  </div>
                  <div onClick={() => setIsAddOverlayOpen(!isAddOverlayOpen)} className="flex items-center  bg-primary rounded-lg h-12 group hover:bg-darkprimary">
                    <button className=" px-7 text-black rounded-md font-medium ">
                      Add Password
                    </button>
                  </div>
                </div>
            }
          </div>
          <div className=" flex flex-col justify-start items-center  h-full xl:w-[35%] w-[30%]">
            <div className="flex justify-between items-end w-full ">
              <div className="text-responsivo text-whitebg  font-bold">
                My <span className="  text-primary">Groups</span>
              </div>
              <div onClick={() => setOptionName('Groups')} className="flex dark:text-gray text-whitegray hover:text-gray items-center dark:hover:text-whitegray cursor-pointer mb-2">
                <div>
                   <span className="hidden">See&nbsp;</span>More
                </div>
                <KeyboardArrowRightRoundedIcon sx={{ fontSize: 24 }} />

              </div>
            </div>
          </div>

        </div>


      </div>



    </div>





  )
}

export default Dashboard