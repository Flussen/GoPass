"use client"
import React from "react";
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

    children: React.ReactNode;
}

const OptionsOverlay: React.FC<OptionsOverlayProps> = ({ setShowGenerator, children }) => {

    return (

      
        <div id="Options" className="flex flex-col justify-between basis-1/5 h-screen bg-box rounded-tr-2xl rounded-br-2xl shadow-shadow pt-20">
          <div className="flex-col justify-center w-full px-16 space-y-16">


            <div className='flex justify-center text-blue font-bold text-5xl'>
              Go<span className='text-bkblue'>Pass</span>
            </div>
            <div className="flex justify-center items-center text-xl space-x-2 ">
              <AccountCircleRoundedIcon sx={{ fontSize: 50 }} />
              <div className="text-grey">
                Alexander V.
              </div>
            </div>
            <div className="space-y-2">
              <div onClick={() => setShowGenerator(false)} className="flex items-center justify-start pl-7 h-14 rounded-2xl bg-bgblue text-blue space-x-2 cursor-pointer text-xl font-semibold">
                <GridViewRoundedIcon sx={{ fontSize: 28 }} />
                <div>
                  My Passwords
                </div>
              </div>
              <div onClick={() => setShowGenerator(true)} className="flex items-center justify-start  pl-7  h-14 rounded-2xl  hover:bg-bgblue hover:text-blue space-x-2 cursor-pointer text-xl font-semibold text-grey">
                <PasswordRoundedIcon sx={{ fontSize: 28 }} />
                <div>
                  Pass Generator
                </div>
              </div>
            </div>



          </div>
          <div className="flex flex-col justify-between w-full px-16 space-y-2 mb-10">
            <div className="flex items-center justify-start  pl-7  h-14 rounded-2xl hover:bg-bgblue hover:text-blue space-x-2 cursor-pointer text-xl font-semibold text-grey" >
              <SettingsRoundedIcon />
              <div>
                Setings
              </div>
            </div>
            <div className="flex items-center justify-start  pl-7 h-14 rounded-2xl hover:bg-bgblue hover:text-blue space-x-2 cursor-pointer text-xl font-semibold text-grey">
              <ExitToAppRoundedIcon />
              <div>
                Log Out
              </div>
            </div>
          </div>

        </div>

    )
}

export default OptionsOverlay;