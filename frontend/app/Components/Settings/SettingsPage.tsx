import React, { useEffect, useState } from "react"

import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

import Image from "next/image"
import { GetAccountInfo } from "@/wailsjs/wailsjs/go/app/App";
import { DoChangeAccountPassword } from "@/wailsjs/wailsjs/go/app/App";
import SettingOverlay from "./SettingOverlay"
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PersonIcon from '@mui/icons-material/PersonRounded';
import KeyIcon from '@mui/icons-material/KeyRounded';
import { request, response, models } from '@/wailsjs/wailsjs/go/models';
import ProfileSection from "./ProfileSection";
import ApparenceSection from "./ApparenceSection";

interface ProfileProps {
    userName: string;
    setIsLoading: (show: boolean) => void;
    setShowProfile: (show: boolean) => void;
    setTheme: (theme:string)=>void;
    theme:string

}
const OptionPage: React.FC<ProfileProps> = ({ setShowProfile, userName, setIsLoading , setTheme, theme}) => {
    const [email, setEmail] = useState('')
    const [newPasswordOpen, setNewPasswordOpen] = useState(false);
    const [actualPass, setActualPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [optionName, setOptionName] = useState('');
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
            alert('Passwords isnt the same')
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
        <div className="flex justify-between h-full">
            <SettingOverlay setShowProfile={setShowProfile} setOptionName={setOptionName} optionName={optionName} />
            {optionName == '' ?
                <ProfileSection userName={userName} setIsLoading={setIsLoading} />
                :optionName=='Apparence'?                 <ApparenceSection userName={userName} setIsLoading={setIsLoading}  setTheme={setTheme} theme={theme}/>
                :
                <></>}


        </div>
    )
}

export default OptionPage;