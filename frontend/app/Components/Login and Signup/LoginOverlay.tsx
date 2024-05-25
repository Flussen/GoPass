"use client"
import React, { useState } from "react";
import TitleRoundedIcon from '@mui/icons-material/TitleRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { request, response, models } from '@/wailsjs/wailsjs/go/models';
import { DoLogin, GetAccountInfo } from '@/wailsjs/wailsjs/go/app/App';
import LoadingComp from "../Loading";
import { DoChangeAccountConfigs} from "@/wailsjs/wailsjs/go/app/App";

interface RegisterProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    setShowRecover: (show: boolean) => void;
    setUserKey: (userKey: string) => void;
    setUserName: (userKey: string) => void;
    setShowDashboard: (show: boolean) => void;
    setTheme: (theme: string) => void;
    theme: string;
}


const LoginOverlay: React.FC<RegisterProps> = ({ isOpen, onClose, children, setShowRecover, setShowDashboard, setUserKey, setUserName, setTheme, theme }) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordIncorrect, setPasswordIncorrect] = useState(false);
    const [loadingIsOpen, setLoadingIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [group, setGroup] = useState<string[]>([])
    const AccountData = new  models.Config({
        ui: theme,
        groups:group,
        lenguage:''
    })
    const LoginData = new request.Login({
        account: name,
        password: password
    })

    async function pullLogin(LoginData: request.Login) {

        setLoadingIsOpen(true)
        try {
            const result = await DoLogin(LoginData);
            console.log(result)
            if (result.token !== null && result.token !== '' && result.userKey !== null && result.userKey !== '') {
                setUserKey(result.userKey);
                console.log(' Empieza el get info')

                const accountIngo = await GetAccountInfo(name)
                console.log(' Empieza el theme')
                const userTheme =  await DoChangeAccountConfigs(name,AccountData)
                setShowDashboard(true);
                console.log('Token Saved:' + result.token)
                setUserName(name)
            }
        } catch (error) {
            console.log(error)
            setPasswordIncorrect(true)
        } finally {
            setLoadingIsOpen(false)
        }
    }


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Previene la recarga de la página
        await pullLogin(LoginData); // Llama a la función pullLogin
        // Simula una carga o espera por una operación asíncrona

    };

    return (
        <>
            {
                isOpen ? (
                    <div className='absolute flex justify-center items-center right-0 top-0 h-screen w-screen '>
                        <div onClick={onClose} className='absolute bg-[#000000] opacity-80 h-screen w-screen '></div>
                        <div className='flex flex-col justify-center bg-darkgray  w-[57rem] h-[75%] rounded-lg z-10 text-whitebg  font-semibold'>
                            <div className="  text-whitebg w-full flex justify-end items-start  pr-5 pt-5">
                                <div onClick={onClose} className="cursor-pointer z-20">
                                    <CloseRoundedIcon className="cursor-pointer" />

                                </div>
                            </div>
                            <div className="w-full flex flex-col justify-center items-center space-y-4 px-56 h-full mt-[-2.84rem]">
                                <div className="text-4xl  mb-5">
                                    Welcome Back!
                                </div>
                                <div className="w-full flex items-center">
                                    <PersonRoundedIcon className="absolute ml-4 text-primary" />
                                    <input type="text" className="bg-black rounded-full h-12 w-full pl-12 outline-none placeholder:text-gray " placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} />

                                </div>

                                <div className="w-full flex items-center">
                                    <KeyRoundedIcon className="absolute ml-4 text-primary" />
                                    <input type="password" className="bg-black rounded-full h-12 w-full pl-12 outline-none placeholder:text-gray " placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                                </div>
                                <div onClick={handleSubmit} className="w-full">
                                    <button className="bg-primary w-full h-12 rounded-full text-black ">
                                        Login
                                    </button>
                                </div>
                                <div className="w-full flex justify-center text-gray font-medium">
                                    Forget the password?&nbsp; <span onClick={() => setShowRecover(true)} className="text-primary font-semibold cursor-pointer">Recover</span>
                                </div>
                            </div>

                        </div>
                        {loadingIsOpen ?
                            <LoadingComp /> :
                            <></>}
                    </div>
                )
                    : null
            }


        </>
    )
}

export default LoginOverlay;