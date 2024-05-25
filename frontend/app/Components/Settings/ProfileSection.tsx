"use client"

import { request, response, models } from '@/wailsjs/wailsjs/go/models';
import React, { useEffect, useState } from "react"

import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import Image from "next/image"
import { GetAccountInfo } from "@/wailsjs/wailsjs/go/app/App";
import { DoChangeAccountPassword } from "@/wailsjs/wailsjs/go/app/App";
import SettingOverlay from "./SettingOverlay"
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PersonIcon from '@mui/icons-material/PersonRounded';
import KeyIcon from '@mui/icons-material/KeyRounded';

interface ProfileProps {
    userName: string;
    setIsLoading: (show: boolean) => void;

}

const ProfileSection: React.FC<ProfileProps> = ({ userName, setIsLoading }) => {
    const [email, setEmail] = useState('')
    const [newPasswordOpen, setNewPasswordOpen] = useState(false);
    const [actualPass, setActualPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [optionName, setOptionName] = useState('');
    async function GetInfo() {
        try {
            const result = await GetAccountInfo(userName);
            setEmail(result.email)
            console.log(result)
        } catch {

        }
    }

    async function UpdatePassword() {
        setIsLoading(true)
        if (newPass == confirmPass && newPass !== '') {
            try {
                const result = await DoChangeAccountPassword(userName, actualPass, newPass)
                console.log(result)
            } catch {
                alert('The actual pass isnt correct')

            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        GetInfo();
    }, []);
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await UpdatePassword();
    }
    return (
        <div className="flex  items-start  w-[100%]  2xl:ml-[19%] ml-[75px]  h-screen">

            <div className="w-full  rounded-lg dark:bg-black bg-whitebg flex flex-col justify-start items-center h-full ">

                <AccountCircleRoundedIcon sx={{ fontSize: 124 }} className="mb-5 mt-20 text-primary" />


                <div className=" space-y-5">

                    <div className='flex items-center w-[30rem]   '>
                        <PersonIcon className='absolute ml-4 text-primary' />
                        <input type="text" className='flex rounded-lg   pl-12 w-full h-12 py-2 focus:outline-none dark:text-whitebg  dark:bg-darkgray dark:placeholder:text-gray text-darkgray bg-white placeholder:text-blackwhite cursor-default' placeholder='Username' value={userName} readOnly />

                    </div>
                    <div className='flex items-center w-[30rem]    '>
                        <EmailRoundedIcon className='absolute ml-4 text-primary' />
                        <input type="text" className='flex rounded-lg   pl-12 w-full h-12 py-2 focus:outline-none dark:text-whitebg  dark:bg-darkgray dark:placeholder:text-gray text-darkgray bg-white placeholder:text-blackwhite cursor-default' placeholder='Email' value={email} readOnly />

                    </div>
                    
                       
                            <form onSubmit={handleSubmit} className='space-y-5'>
                                {newPasswordOpen ? (<><div className='flex items-center w-[30rem]    '>
                                    <KeyIcon className='absolute ml-4 text-primary' />
                                    <input type="password" className='flex rounded-lg  pl-12 w-full h-12 py-2 focus:outline-none dark:text-whitebg  dark:bg-darkgray dark:placeholder:text-gray text-darkgray bg-white placeholder:text-blackwhite cursor-default' placeholder='Actual Password' onChange={(e) => setActualPass(e.target.value)} />

                                </div>
                                <div className='flex items-center w-[30rem]    '>
                                    <KeyIcon className='absolute ml-4 text-primary' />
                                    <input type="password" className='flex rounded-lg   pl-12 w-full h-12 py-2 focus:outline-none dark:text-whitebg  dark:bg-darkgray dark:placeholder:text-gray text-darkgray bg-white placeholder:text-blackwhite cursor-default' placeholder='New Password' onChange={(e) => setNewPass(e.target.value)} />

                                </div>
                                <div className='flex items-center w-[30rem]    '>
                                    <KeyIcon className='absolute ml-4 text-primary' />
                                    <input type="password" className='flex rounded-lg  pl-12 w-full h-12 py-2 focus:outline-none dark:text-whitebg  dark:bg-darkgray dark:placeholder:text-gray text-darkgray bg-white placeholder:text-blackwhite cursor-default' placeholder='Confirm Password' onChange={(e) => setConfirmPass(e.target.value)} />

                                </div>
                                </>):null}
                                <div onClick={() => setNewPasswordOpen(!newPasswordOpen)} className='flex bg-primary justify-center items-center w-[30rem] text-blaack  rounded-lg   '>
                                    <button className=" w-full h-12 rounded-lg font-semibold text-whitebg dark:text-black">
                                       {newPasswordOpen? 'Update Password':'Change Password'}
                                    </button>

                                </div>
                                

                            </form>

                            {newPasswordOpen?( <div className='w-full flex justify-center ' >
                                <div onClick={() => setNewPasswordOpen(!newPasswordOpen)} className='dark:text-whitegray dark:hover:text-red text-gray hover:text-red cursor-pointer'>
                                Cancel

                                </div>
                            </div>):null}
                       
                   

                    
                    {/* {
                        newPasswordOpen ?
                            <div className="absolute flex justify-center items-center top-0 right-0 h-screen w-screen">
                                <div onClick={() => setNewPasswordOpen(!newPasswordOpen)} className="absolute bg-black opacity-80 h-screen w-screen z-[0]" />
                                <form onSubmit={handleSubmit} className="z-30">
                                    <div className="flex-col justify-center bg-darkgray p-5 rounded-lg  space-y-5 z-30">
                                        <div className='flex items-center w-[30rem]    '>
                                            <KeyIcon className='absolute ml-4 text-primary' />
                                            <input type="password" className='flex rounded-lg  text-white pl-12 w-full h-12 py-2 focus:outline-none bg-blaack placeholder:text-darkgrey cursor-default' placeholder='Actual Password' onChange={(e) => setActualPass(e.target.value)} />

                                        </div>
                                        <div className='flex items-center w-[30rem]    '>
                                            <KeyIcon className='absolute ml-4 text-primary' />
                                            <input type="password" className='flex rounded-lg  text-white pl-12 w-full h-12 py-2 focus:outline-none bg-blaack placeholder:text-darkgrey cursor-default' placeholder='New Password' onChange={(e) => setNewPass(e.target.value)} />

                                        </div>
                                        <div className='flex items-center w-[30rem]    '>
                                            <KeyIcon className='absolute ml-4 text-primary' />
                                            <input type="password" className='flex rounded-lg  text-white  pl-12 w-full h-12 py-2 focus:outline-none bg-blaack placeholder:text-darkgrey cursor-default' placeholder='Confirm Password' onChange={(e) => setConfirmPass(e.target.value)} />

                                        </div>
                                        <div className='flex bg-primary justify-center items-center w-[30rem] text-blaack  rounded-lg hover:bg-darkprimary  '>
                                            <button className=" w-full h-12 rounded-lg font-semibold">
                                                Update Password
                                            </button>

                                        </div>
                                    </div>
                                </form>

                            </div>
                            :
                            <></>
                    } */}

                </div>
            </div>

        </div>
    )
}

export default ProfileSection;