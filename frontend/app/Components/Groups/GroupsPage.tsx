"use client"

import React, { useState } from "react";


import OptionsOverlay from "../OptionsOverlay";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import ViewAgendaRoundedIcon from '@mui/icons-material/ViewAgendaRounded';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import AddGroup from "./AddGroup";
import EditGroup from "./EditGroup";
import HeaderComp from "../HeaderComp";


interface GroupProps {
  setOptionName: (show: string) => void;
  optionName: string;
  userKey: string;
  userName: string;
  setShowDashboard: (show: boolean) => void;
  setShowProfile: (show: boolean) => void;
  showDashboard: boolean;
}

const Groups: React.FC<GroupProps> = ({ showDashboard, setShowProfile, setShowDashboard, setOptionName, optionName, userKey, userName }) => {
  const [titlee, setTitlee] = useState('')
  const titlesearch = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setTitlee(event.target.value);
  };
  const [isAddOverlayOpen, setIsAddOverlayOpen] = useState(false);
  const [arePasswords, setArePasswords] = useState(true)
  const [twoColum, setTwoColum] = useState(true)

  return (
    <div id="Dashboard" className='flex justify-between h-full '>

      <OptionsOverlay
        setOptionName={setOptionName}
        optionName={optionName}
        userName={userName}
        setShowDashboard={setShowDashboard}
        setShowProfile={setShowProfile}      >
        <></>
      </OptionsOverlay>
      <div className="flex flex-col  items-start  xl:w-[84%] w-full xl:ml-[16%] ml-[75px] p-12 h-full ">
      <HeaderComp optionName={optionName} userName={userName}/>



        <div className=" flex w-full space-x-12 h-full ">
          <div id="MyGroups" className="flex flex-col justify-start  w-full font-semibold space-y-5 text mb-5">
            <div className="flex justify-between  items-center">
              <div className="text-responsivo text-whitebg font-bold">
                My <span className="  text-primary">Groups</span>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex justify-center items-center text-base space-x-2 text-gray hover:text-whitebg h-12 bg-darkgray rounded-full w-24 cursor-pointer">
                  <div>
                    Sort
                  </div>
                  <SortRoundedIcon sx={{ fontSize: 24 }} />
                </div>
                <div onClick={()=>setTwoColum(false)}  className={`flex justify-center items-center text-base space-x-2 ${!twoColum? 'text-black  bg-primary':'text-gray hover:text-whitebg bg-darkgray'}  h-12  rounded-full w-12 cursor-pointer`}>
                  <ViewAgendaRoundedIcon sx={{ fontSize: 24 }} />
                </div>
                <div onClick={()=>setTwoColum(true)} className={`flex justify-center items-center text-base space-x-2 ${twoColum? 'text-black  bg-primary':'text-gray hover:text-whitebg bg-darkgray'}  h-12  rounded-full w-12 cursor-pointer`}>
                  <GridViewRoundedIcon sx={{ fontSize: 24 }} />
                </div>
                <div onClick={() => setIsAddOverlayOpen(!isAddOverlayOpen)} className="flex justify-center items-center h-12 bg-primary rounded-full cursor-pointer w-48 text-xl space-x-2.5 ">

                  <DashboardCustomizeRoundedIcon sx={{ fontSize: 24 }} />
                  <div >
                    New Group
                  </div>
                </div>
              </div>
              <AddGroup/>

            </div>
          </div>

        </div>


      </div>



    </div>
  )
}

export default Groups;