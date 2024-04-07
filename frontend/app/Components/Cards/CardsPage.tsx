"use client"

import React, { useState, useEffect } from "react";


import OptionsOverlay from "../OptionsOverlay";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import FavCardComp from "./FavCardComp"
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import AddCardRoundedIcon from '@mui/icons-material/AddCardRounded';
import CardsComp from "./CardsComp";
import AddCards from "./AddCard";
import HeaderComp from "../HeaderComp";


interface CardsProps {
  setOptionName: (show: string) => void;
  optionName: string;
  userKey: string;
  userName: string;
  setShowDashboard: (show: boolean) => void;
  setShowProfile: (show: boolean) => void;
  showDashboard: boolean;
}

const Cards: React.FC<CardsProps> = ({ showDashboard, setShowProfile, setShowDashboard, setOptionName, optionName, userKey, userName }) => {
  const [titlee, setTitlee] = useState('')

  const [areFavCards, setAreFavCards] = useState(true)
  const titlesearch = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setTitlee(event.target.value);
  };
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [areCards, setAreCards] = useState(false)
  useEffect(() => {
    console.log('Se cambio el AreFav')
  }, [areFavCards])
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
      <div className="flex flex-col justify-start items-start  xl:w-[84%] w-full xl:ml-[16%] ml-[75px] p-12 h-full ">
        <HeaderComp optionName={optionName} userName={userName} />

        <div className=" flex w-full space-x-6 h-5/6 ">
          <div className={`${areFavCards ? '2xl:w-[65%] w-[70%]' : ' w-full'}  `}>
            <div id="MyPasswords" className="flex flex-col justify-start  w-full font-semibold space-y-5 text mb-5">
              <div className="flex justify-between  items-center">
                <div className="text-responsivo text-whitebg font-bold">
                  My <span className="  text-primary">Cards</span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex justify-center items-center text-base space-x-2 text-gray hover:text-whitebg h-12 bg-darkgray rounded-full w-24 cursor-pointer">

                    <div>
                      Sort
                    </div>
                    <SortRoundedIcon sx={{ fontSize: 24 }} />

                  </div>

                  <div onClick={() => setIsAddCardOpen(!isAddCardOpen)} className="flex justify-center items-center h-12 bg-primary rounded-full cursor-pointer w-44 text-xl space-x-2 ">

                    <AddCardRoundedIcon sx={{ fontSize: 24 }} />
                    <div >
                      New Pass
                    </div>
                  </div>
                </div>
                <AddCards userName={userName} isOpen={isAddCardOpen} onClose={() => setIsAddCardOpen(!isAddCardOpen)} setAreFavCards={setAreFavCards} />
              </div>
            </div>
            {
              true ?
                <CardsComp search={titlee} userName={userName} isOpen={isAddCardOpen} userKey={userKey} />
                :
                <div className="text-white w-full flex-col flex justify-center items-center space-y-7 ">
                  <div className="text-2xl">
                    Add your first password!
                  </div>
                  <div onClick={() => setIsAddCardOpen(!isAddCardOpen)} className="flex items-center  bg-primary rounded-lg h-12 group hover:bg-darkprimary">
                    <button className=" px-7 text-black rounded-md font-medium ">
                      Add Password
                    </button>
                  </div>
                </div>
            }
          </div>
          <div className={`${areFavCards ? 'flex flex-col justify-start items-center   2xl:w-[35%] w-[30%]' : 'hidden'}  `}>
            <div className="flex justify-between items-end w-full mb-12">
              <div className="text-responsivo text-whitebg  font-bold">
                Fav <span className="  text-primary">Cards</span>
              </div>
            </div>
            <FavCardComp search={titlee} userName={userName} isOpen={isAddCardOpen} userKey={userKey} setAreFavCards={setAreFavCards} />

          </div>

        </div>


      </div>



    </div>
  )
}

export default Cards;