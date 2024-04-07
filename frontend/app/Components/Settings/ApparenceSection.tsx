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
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
interface ProfileProps {
    userName: string;
    setIsLoading: (show: boolean) => void;

}

const ApparenceSection: React.FC<ProfileProps> = ({ userName, setIsLoading }) => {
    const [email, setEmail] = useState('')
    const [actualPass, setActualPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [optionName, setOptionName] = useState('');
    const [showThemes, setShowThemes] = useState(false);
    async function GetInfo() {
        try {
            const result = await GetAccountInfo(userName);
            //agregar el setEmail
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
        <div className="flex-col  items-start  w-[100%]  2xl:ml-[19%] ml-[75px]  h-screen p-12 space-y-6">

            <div onClick={() => setShowThemes(!showThemes)} className='bg-darkgray w-full  rounded-lg text-whitebg group cursor-pointer p-6'>
                <div className='flex justify-between w-full font-semibold'>
                    <div>
                        App Theme
                    </div>
                    <div className='flex items-center text-whitegray group-hover:text-whitebg '>
                        {!showThemes ?
                            (
                                <>
                                    Show
                                    <KeyboardArrowDownRoundedIcon />
                                </>
                            ) :
                            (
                                <>
                                    Close
                                    <KeyboardArrowUpRoundedIcon />
                                </>
                            )}
                    </div>
                </div>
                {
                    showThemes ? (
                        <div className='flex-col flex justify-between items-center mt-6'>
                            <div className='flex justify-center w-full mb-6'>
                                <div className='h-0.5 w-11/12 bg-gray rounded-full' />

                            </div>
                            <div className='flex w-full justify-between'>
                                <div className=' border-2 w-64 border-gray rounded-lg flex items-center justify-start font-semibold '>

                                    <div className='flex items-center rounded-l-lg bg-black w-1/2 h-full' >
                                        <div className='rounded-full h-6 w-6 border-2 border-gray bg-darkgray m-3'>

                                        </div>
                                        <div>
                                            System
                                        </div> </div>

                                    <div className=' bg-whitebg w-1/2 h-full rounded-r-lg' />


                                </div>
                                <div className='p-3 border-2 w-64 border-gray rounded-lg flex items-center justify-start space-x-2 bg-whitebg text-black font-semibold'>
                                    <div className='rounded-full h-6 w-6 border-2 border-gray bg-darkgray'>

                                    </div>
                                    <div>
                                        Light Mode
                                    </div>
                                </div>
                                <div className='p-3 border-2 w-64 border-gray rounded-lg flex items-center justify-start space-x-2 bg-black font-semibold '>
                                    <div className='rounded-full h-6 w-6 border-2 border-gray bg-darkgray'>

                                    </div>
                                    <div>
                                        Dark Mode
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null
                }
            </div>
            <div className='bg-darkgray w-full  rounded-lg text-whitebg  p-6 font-semibold flex justify-between items-center'>

                <div>
                    Principal Color
                </div>
                <div className='flex space-x-6'>
                    <div className='h-10 w-10 bg-primary rounded-full cursor-pointer'>

                    </div>
                    <div className='h-10 w-10 bg-primary rounded-full cursor-pointer'>

                    </div>
                    <div className='h-10 w-10 bg-primary rounded-full cursor-pointer'>

                    </div>
                    <div className='h-10 w-10 bg-primary rounded-full cursor-pointer'>

                    </div>
                </div>

            </div>

        </div>
    )
}

export default ApparenceSection;