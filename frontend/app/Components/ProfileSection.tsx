import React, { useEffect, useState } from "react"

import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import PersonIcon from '../../Public/person.svg';
import KeyIcon from '../../Public/key.svg';
import Image from "next/image"
import { GetUserInfo } from "@/wailsjs/wailsjs/go/app/App";
import { DoChangeAccountPassword } from "@/wailsjs/wailsjs/go/app/App";


interface ProfileProps {
    userName: string;
    setIsLoading: (show: boolean) => void;
    setShowProfile: (show: boolean) => void;


}
const ProfileSection: React.FC<ProfileProps> = ({ setShowProfile, userName, setIsLoading }) => {
    const [email, setEmail] = useState('')
    const [newPasswordOpen, setNewPasswordOpen] = useState(false);
    const [actualPass, setActualPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    async function GetInfo() {
        try {
            const result = await GetUserInfo(userName);
            const data = JSON.parse(result);
            setEmail(data.email);
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
            alert('Passwords isnt the same')
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
        <div className="h-screen w-screen flex  flex-col justify-start items-center bg-blackbox text-back font-semibold">
            <div className="w-screen flex justify-start">
                <div onClick={() => { setShowProfile(false) }} className="flex items-center justify-center h-14 w-14 mt-5 ml-5 rounded-lg border-2 border-border ">
                    v
                </div>
            </div>
            <AccountCircleRoundedIcon sx={{ fontSize: 124 }} className="mb-5 mt-20" />
            <div className="flex flex-col items-center justify-center space-y-5">

                <div className='flex items-center w-[30rem]   '>
                    <Image src={PersonIcon} alt='key' className='absolute ml-4' />
                    <input type="text" className='flex rounded-lg border-border text-back border-[2px] pl-12 w-full h-14 py-2 focus:outline-none bg-black placeholder:text-darkgrey cursor-default' placeholder='Username' value={userName} readOnly />

                </div>
                <div className='flex items-center w-[30rem]    '>
                    <Image src={PersonIcon} alt='key' className='absolute ml-4' />
                    <input type="text" className='flex rounded-lg border-border text-back border-[2px] pl-12 w-full h-14 py-2 focus:outline-none bg-black placeholder:text-darkgrey cursor-default' placeholder='Email' value={email} readOnly />

                </div>

                <div onClick={() => setNewPasswordOpen(!newPasswordOpen)} className='flex bg-gradient justify-center items-center w-[30rem]  p-0.5 rounded-lg bn5 '>
                    <button className="bg-black w-full h-12 rounded-lg">
                        Change Password
                    </button>

                </div>
                {
                    newPasswordOpen ?
                        <div className="absolute flex justify-center items-center h-screen w-screen">
                            <div onClick={() => setNewPasswordOpen(!newPasswordOpen)} className="absolute bg-black opacity-50 h-screen w-screen z-[0]" />
                            <form onSubmit={handleSubmit} className="z-30">
                                <div className="flex-col justify-center bg-blackbox p-5 rounded-lg border-2 border-border space-y-5 z-30">
                                    <div className='flex items-center w-[30rem]    '>
                                        <Image src={KeyIcon} alt='key' className='absolute ml-4' />
                                        <input type="password" className='flex rounded-lg border-border text-back border-[2px] pl-12 w-full h-14 py-2 focus:outline-none bg-black placeholder:text-darkgrey cursor-default' placeholder='Actual Password' onChange={(e) => setActualPass(e.target.value)} />

                                    </div>
                                    <div className='flex items-center w-[30rem]    '>
                                        <Image src={KeyIcon} alt='key' className='absolute ml-4' />
                                        <input type="password" className='flex rounded-lg border-border text-back border-[2px] pl-12 w-full h-14 py-2 focus:outline-none bg-black placeholder:text-darkgrey cursor-default' placeholder='New Password' onChange={(e) => setNewPass(e.target.value)} />

                                    </div>
                                    <div className='flex items-center w-[30rem]    '>
                                        <Image src={KeyIcon} alt='key' className='absolute ml-4' />
                                        <input type="password" className='flex rounded-lg border-border text-back border-[2px] pl-12 w-full h-14 py-2 focus:outline-none bg-black placeholder:text-darkgrey cursor-default' placeholder='Confirm Password' onChange={(e) => setConfirmPass(e.target.value)} />

                                    </div>
                                    <div className='flex bg-gradient justify-center items-center w-[30rem]  p-0.5 rounded-lg bn5 '>
                                        <button className="bg-black w-full h-12 rounded-lg">
                                            Update Password
                                        </button>

                                    </div>
                                </div>
                            </form>

                        </div>
                        :
                        <></>
                }

            </div>

        </div>
    )
}

export default ProfileSection;