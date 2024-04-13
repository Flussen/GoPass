"use client";
import React, { useEffect, useState } from "react";
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

interface HeaderProps {
    optionName: string;
    userName: string;
    setTheme:(theme:string)=>void;
    theme:string;
}

const HeaderComp: React.FC<HeaderProps> = ({ optionName, userName, setTheme, theme }) => {

    const [profileOption, setProfileOptions] = useState(false);
    const [titlee, setTitlee] = useState('');

    useEffect(() => {
        if (theme == "dark") {
            document.querySelector('html')?.classList.add('dark')
        } else {
            document.querySelector('html')?.classList.remove('dark')

        }
    }, [theme])

    const handleChangeTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
      };
    

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
                    <input value={titlee} onChange={titlesearch} type="text" className='flex rounded-full dark:text-whitebg text-darkgray  pl-14 min-w-[25rem] w-[65%] h-12 dark:bg-darkgray bg-white font-medium focus:outline-none placeholder:text-blackwhite dark:placeholder-gray' placeholder='Buscar' />
                </div>)}
            <div className="flex items-center space-x-6 h-12">
                <div onClick={handleChangeTheme} className="flex items-center cursor-pointer">
                    <div className={`flex absolute justify-center items-center h-12 w-12 bg-primary rounded-full font-semibold space-x-2 transition-transform ${theme !== 'dark' ? 'translate-x-12 text-whitebg' : ''} `}>
                        {
                            theme == 'dark' ? <DarkModeRoundedIcon sx={{ fontSize: 24 }} /> : <WbSunnyRoundedIcon sx={{ fontSize: 24 }} />
                        }

                    </div>
                    <div className={`flex dark:justify-end justify-start items-center dark:pr-2.5 pl-2.5 h-11 w-24 border-2 dark:border-gray border-blackwhite  rounded-full dark:text-whitebg text-darkgray  `}>
                        {
                            theme !== 'dark' ? <DarkModeRoundedIcon sx={{ fontSize: 24 }}  /> : <WbSunnyRoundedIcon sx={{ fontSize: 24 }} />
                        }
                    </div>
                </div>
                <div onClick={() => setProfileOptions(!profileOption)} className="flex items-center cursor-pointer group ">
                    <div className="flex absolute justify-center items-center h-12 w-12 bg-primary rounded-full font-semibold space-x-2 dark:text-black text-whitebg">

                        <AccountCircleRoundedIcon sx={{ fontSize: 36 }} />
                    </div>
                    <div className="h-11 w-48 border-2 rounded-full dark:border-gray border-blackwhite text-gray group-hover:text-whitebg  flex justify-between items-center text-base pl-14 pr-3">
                        <div className="dark:text-whitebg text-darkgray">
                            {userName}
                        </div>
                        <ExpandMoreRoundedIcon sx={{ fontSize: 24 }} />

                    </div>


                </div>

            </div>
        </div>
    )
}

export default HeaderComp;