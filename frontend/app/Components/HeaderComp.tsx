"use client";
import React, { useState } from "react";
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

interface HeaderProps {
    optionName: string;
    userName:string;
}

const HeaderComp: React.FC<HeaderProps> = ({ optionName , userName}) => {

    const[profileOption, setProfileOptions] = useState(false);
    const [titlee, setTitlee] = useState('');

    const titlesearch = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setTitlee(event.target.value);
    };


    return (
        <div id="HEADER" className="flex justify-between items-center w-full rounded-lg text-base mb-16 ">
            {optionName == 'Generator' ?
                (<div className='text-4xl font-bold text-whitebg'>
                    Password <span className="bg-primary bg-clip-text text-transparent">Generator</span>
                </div>) :
                (<div className='flex items-center w-full   '>
                    <SearchRoundedIcon sx={{ fontSize: 24 }} className="absolute ml-5 text-primary" />
                    <input value={titlee} onChange={titlesearch} type="text" className='flex rounded-full text-whitebg  pl-14 min-w-[25rem] w-[65%] h-12 bg-darkgray font-medium focus:outline-none placeholder-gray' placeholder='Buscar' />
                </div>)}
            <div className="flex items-center space-x-6 h-12">
                <div className="flex items-center">
                    <div className="flex absolute justify-center items-center h-12 w-12 bg-primary rounded-full font-semibold space-x-2">

                        <DarkModeRoundedIcon sx={{ fontSize: 24 }} />
                    </div>
                    <div className="flex justify-end items-center pr-2 h-11 w-24 border-2 border-gray rounded-full text-whitebg ">
                        <WbSunnyRoundedIcon sx={{ fontSize: 24 }} />
                    </div>
                </div>
                <div onClick={()=>setProfileOptions(!profileOption)} className="flex items-center cursor-pointer group ">
                    <div className="flex absolute justify-center items-center h-12 w-12 bg-primary rounded-full font-semibold space-x-2">

                        <AccountCircleRoundedIcon sx={{ fontSize: 36 }} />
                    </div>
                    <div className="h-11 w-48 border-2 rounded-full border-gray text-gray group-hover:text-whitebg  flex justify-between items-center text-base pl-14 pr-3">
                        <div className="text-whitebg">
                            {userName}
                        </div>
                        <ExpandMoreRoundedIcon sx={{ fontSize: 24 }}  />

                    </div>

                    
                </div>

            </div>
        </div>
    )
}

export default HeaderComp;