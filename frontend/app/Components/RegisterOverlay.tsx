"use client"
import React, { useState } from "react";
import TitleRoundedIcon from '@mui/icons-material/TitleRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { request, response, models } from '@/wailsjs/wailsjs/go/models';
import { DoRegister } from '@/wailsjs/wailsjs/go/app/App';
import RegiResult from "./RegisResult"
import LoadingComp from "./Loading"


interface RegisterProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    setIsLoading: (show: boolean) => void;
    setSeedList:(seeds: Array<string>) => void;
    setShowSeed: (show: boolean) => void;
    setStartTemp: (show: boolean) => void;

}


const RegisterOverlay: React.FC<RegisterProps> = ({ isOpen, onClose, children, setIsLoading, setSeedList, setShowSeed, setStartTemp }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordIncorrect, setPasswordIncorrect] = useState(false);
    const [loadingIsOpen, setLoadingIsOpen] = useState(false);

    const registerData = new request.Register({
        account: name,
        email: email,
        password: password,
        configs: new models.Config({
            ui: '',
            groups: [],
            language: ''
        })
    });
    async function pullRegister(registerData: request.Register) {
        setLoadingIsOpen(true)

        if (name == '' || email == '' || password == '') {
            setLoadingIsOpen(false);
            setPasswordIncorrect(true)
        } else {

            try {

                const response = await DoRegister(registerData);
                console.log('respuesta pa: ' + JSON.stringify(response))
                const seeds = response.seeds; // Obtenemos el array de 'seeds' de la respuesta
                const formattedSeeds = seeds.map((seed, index) => `${index + 1}. ${seed}`).join(' '); // Formateamos
                setSeedList(response.seeds);
                setStartTemp(true)
                setShowSeed(true)
                setName('');
                setEmail('')
                setPassword('');
                onClose()
            } catch (error) {
                console.error('Error fetching version:', error);
            } finally {
                setLoadingIsOpen(false);

            }
        }

    }
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Previene la recarga de la página
        await pullRegister(registerData); // Llama a la función pullRegister

    };
    return (
        <>
            {
                isOpen ? (
                    <div className='absolute flex justify-center items-center right-0 top-0 h-screen w-screen '>
                        <div onClick={onClose} className='absolute bg-[#000000] opacity-80 h-screen w-screen '></div>
                        <div className='flex flex-col justify-center bg-darkgray w-[57rem]  h-[75%] rounded-lg z-10 text-whitebg  font-semibold'>
                            <div className="  text-whitebg w-full flex justify-end items-start  pr-5 pt-5">
                                <div onClick={onClose}>
                                    <CloseRoundedIcon className="cursor-pointer" />

                                </div>
                            </div>
                            <div className="w-full flex flex-col justify-center items-center space-y-4 px-56 h-full mt-[-2.84rem]">
                                <div className="text-4xl  mb-5">
                                    Lets Start!
                                </div>
                                <div className="w-full flex items-center">
                                    <PersonRoundedIcon className="absolute ml-4 text-primary" />
                                    <input type="text" className="bg-black rounded-full h-12 w-full pl-12 outline-none placeholder:text-gray " placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} />

                                </div>
                                <div className="w-full flex items-center">
                                    <EmailRoundedIcon className="absolute ml-4 text-primary" />
                                    <input type="email" className="bg-black rounded-full h-12 w-full pl-12 outline-none placeholder:text-gray " placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

                                </div>
                                <div className="w-full flex items-center">
                                    <KeyRoundedIcon className="absolute ml-4 text-primary" />
                                    <input type="password" className="bg-black rounded-full h-12 w-full pl-12 outline-none placeholder:text-gray " placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                                </div>
                                <div onClick={handleSubmit} className="w-full">
                                    <button className="bg-primary w-full h-12 rounded-full text-black ">
                                        Register
                                    </button>
                                </div>
                            </div>

                        </div>
                        {loadingIsOpen ?

                            (
                                <div className="absolute w-screen h-screen z-50">
                                    <LoadingComp />
                                </div>
                            ) :
                            <></>}
                    </div>

                )
                    : null
            }


        </>
    )
}

export default RegisterOverlay;