"use client"
import React, { useState } from "react";
import TitleRoundedIcon from '@mui/icons-material/TitleRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

interface RegisterProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    setShowRecover: (show:boolean) => void;
}


const LoginOverlay: React.FC<RegisterProps> = ({ isOpen, onClose, children, setShowRecover }) => {
    const [title, setTitle] = useState("");
    const [usermail, setUsermail] = useState("");
    const [pass, setPass] = useState("");


    return (
        <>
            {
                isOpen ? (
                    <div className='absolute flex justify-center items-center right-0 top-0 h-screen w-screen '>
                        <div onClick={onClose} className='absolute bg-[#000000] opacity-80 h-screen w-screen '></div>
                        <div className='flex flex-col justify-center bg-darkgray  w-full m-80 h-[75%] rounded-lg z-10 text-whitebg  font-semibold'>
                            <div className="  text-whitebg w-full flex justify-end items-start  pr-5 pt-5">
                                <div onClick={onClose}>
                                <CloseRoundedIcon className="cursor-pointer" />

                                </div>
                            </div>
                            <div className="w-full flex flex-col justify-center items-center space-y-4 px-56 h-full mt-[-2.84rem]">
                                <div className="text-4xl  mb-5">
                                    Welcome Back!
                                </div>
                                <div className="w-full flex items-center">
                                    <PersonRoundedIcon className="absolute ml-4 text-primary" />
                                    <input type="text" className="bg-black rounded-full h-12 w-full pl-12 outline-none placeholder:text-gray " placeholder="Username" />

                                </div>
                                
                                <div className="w-full flex items-center">
                                    <KeyRoundedIcon className="absolute ml-4 text-primary" />
                                    <input type="password" className="bg-black rounded-full h-12 w-full pl-12 outline-none placeholder:text-gray " placeholder="Password" />

                                </div>
                                <div className="w-full">
                                    <button className="bg-primary w-full h-12 rounded-full text-black ">
                                        Register
                                    </button>
                                </div>
                                <div className="w-full flex justify-center text-gray font-medium">
                                    Forget the password?&nbsp; <span onClick={()=>setShowRecover(true)} className="text-primary font-semibold cursor-pointer">Recover</span>
                                </div>
                            </div>
 
                        </div>
                    </div>
                )
                    : null
            }


        </>
    )
}

export default LoginOverlay;