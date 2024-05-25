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
import { DoChangeAccountConfigs } from '@/wailsjs/wailsjs/go/app/App';
interface ProfileProps {
    userName: string;
    setIsLoading: (show: boolean) => void;
    setTheme: (theme:string)=>void;
    theme:string
}

const ApparenceSection: React.FC<ProfileProps> = ({ userName, setIsLoading , setTheme, theme}) => {
    const [email, setEmail] = useState('')
    const [actualPass, setActualPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [optionName, setOptionName] = useState('');
    const [showThemes, setShowThemes] = useState(false);
    async function GetInfo() {
        try {
            const result = await GetAccountInfo(userName);
            
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


    const AccountData = new models.Config({
        ui: theme,
        group: '',
        lenguage: ''
    })

    async function ChangeTheme() {
        try {

            
            const response = await DoChangeAccountConfigs(userName, AccountData)
            console.log('COnsole despues de cambiar el tema')
        } catch (e) {
            console.log(e)
        }finally{
            setShowThemes(true)
        }
    }
    useEffect(() => {
        ChangeTheme()
    }, [theme])
    useEffect(() => {
        if (theme == "dark") {
            document.querySelector('html')?.classList.add('dark')
        } else {
            document.querySelector('html')?.classList.remove('dark')

        }
    }, [theme])


   

    useEffect(() => {
        GetInfo();
    }, []);
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await UpdatePassword();
    }
    return (
        <div className="flex-col  items-start  w-[100%]  2xl:ml-[19%] ml-[75px] bg-whitebg dark:bg-black  h-screen p-12 space-y-6">

            <div onClick={() => setShowThemes(!showThemes)} className='dark:bg-darkgray bg-white w-full  rounded-lg dark:text-whitebg group text-darkgray cursor-pointer p-6'>
                <div className='flex justify-between w-full font-semibold'>
                    <div>
                        App Theme
                    </div>
                    <div className='flex items-center dark:text-whitegray text-blackwhite dark:group-hover:text-whitebg group-hover:text-darkgray'>
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
                                <div className='h-0.5 w-11/12 dark:bg-gray bg-blackwhite rounded-full' />

                            </div>
                            <div className='flex w-full justify-between'>
                                <div className=' border-2 w-64 dark:border-gray border-blackwhite rounded-lg flex items-center justify-start font-semibold '>

                                    <div className='flex items-center rounded-l-lg bg-black w-1/2 h-full text-whitebg' >
                                        <div className='rounded-full h-6 w-6 border-2 dark:border-gray border-blackwhite dark:bg-darkgray bg-white m-3'>

                                        </div>
                                        <div>
                                            System
                                        </div> </div>

                                    <div className=' bg-whitebg w-1/2 h-full rounded-r-lg' />


                                </div>
                                <div onClick={()=>setTheme('light')} className='p-3 border-2 w-64 dark:border-gray border-blackwhite rounded-lg flex items-center justify-start space-x-2 bg-whitebg text-black font-semibold'>
                                    <div className={`rounded-full h-6 w-6 border-2  ${theme=='light'? 'bg-primary border-blue-400 ':'dark:bg-darkgray bg-white dark:border-gray border-blackwhite'}  `}>

                                    </div>
                                    <div>
                                        Light Mode
                                    </div>
                                </div>
                                <div onClick={()=>setTheme('dark')} className='p-3 border-2 w-64 dark:border-gray border-blackwhite rounded-lg flex items-center justify-start space-x-2 bg-black font-semibold text-whitebg'>
                                    <div className={`rounded-full h-6 w-6 border-2  ${theme=='dark'? 'bg-primary border-blue-400':'dark:bg-darkgray bg-white dark:border-gray border-blackwhite'}  `}>

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
            <div className='dark:bg-darkgray w-full bg-white rounded-lg dark:text-whitebg text-darkgray  p-6 font-semibold flex justify-between items-center'>

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