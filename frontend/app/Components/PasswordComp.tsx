import React, { useEffect, useState } from "react";
import GppGoodRoundedIcon from '@mui/icons-material/GppGoodRounded';
import { GetUserPasswords } from "@/wailsjs/wailsjs/go/app/App";
import { ShowPassword } from "@/wailsjs/wailsjs/go/app/App";
import GppMaybeRoundedIcon from '@mui/icons-material/GppMaybeRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import EditOverlay from './EditOverlay';
import Tooltip from '@mui/material/Tooltip';
import { Instance } from '@popperjs/core';
import Box from '@mui/material/Box';


interface PassProps {
    userName: string;
    userKey: string;
    isAddOverlayOpen: boolean;
    search: string;
    setArePasswords:(pass:boolean) => void;
    arePasswords:boolean;
    setIsAddOverlayOpen: (show: boolean) =>void;
}

interface PasswordsProps {
    title: string;
    id: string;
    pwd: string;
    username: string;
    created_date: string;
}


const PasswordComp: React.FC<PassProps> = ({ userName, userKey, isAddOverlayOpen, search, setArePasswords, arePasswords, setIsAddOverlayOpen }) => {
    const [passwords, setPasswords] = useState<PasswordsProps[]>([]);
    const [decrypted, setDecrypted] = useState('');
    const [isEditOverlayOpen, setIsEditOverlayOpen] = useState(false);
    const [openEditOverlayId, setOpenEditOverlayId] = useState<string | null>(null);
    const [iconSelection, setIconSeleciotn] = useState('');
    useEffect(() => {
        getPasswords();
    }, [openEditOverlayId, isAddOverlayOpen]);

    useEffect(() => {
        console.log('OpenEdit: ' + openEditOverlayId);
    }, []);


    const positionRef = React.useRef<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    const popperRef = React.useRef<Instance>(null);
    const areaRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (event: React.MouseEvent) => {
        positionRef.current = { x: event.clientX, y: event.clientY };

        if (popperRef.current != null) {
            popperRef.current.update();
        }
    };



    async function getPasswords() {
        try {
            const response = await GetUserPasswords(userName);
            const data = JSON.parse(response);
            if (data && data.passwords) {
                const decryptedPasswords = await Promise.all(data.passwords.map(async (password: PasswordsProps) => {
                    const decryptedPwd = await ShowPassword(userName, password.id, userKey);
                    return { ...password, pwd: decryptedPwd };
                   
                }));
                setArePasswords(true)
                setPasswords(decryptedPasswords);
            } else {
                console.error("Passwords not found in response:", data);
                setArePasswords(false)
            }
        } catch (error) {
            console.error("Error fetching passwords:", error, userName);
        }
    }
    const copyToClipboard = async (pwd: string) => {
        if (pwd === '') {
            return;
        }
        try {
            await navigator.clipboard.writeText(pwd);
        } catch (err) {
            console.error('Error al copiar la contraseña: ', err);
        }
    };

    const searchPasswords = passwords.filter((password) => password.title.toLowerCase().includes(search.toLowerCase()));
   

    return (
        <>
        {
            arePasswords?
            <div className="flex-col w-full space-y-5">
            {searchPasswords.map((password, index) => (

                <div key={index} className="w-full ">
                    <div onClick={() => setOpenEditOverlayId(openEditOverlayId === password.id ? null : password.id)} className="flex w-full h-24 bg-blackbox border-2 border-border p-3 rounded-lg text-xl cursor-pointer">
                        <div className="flex items-center basis-3/6 space-x-5">
                            <div className="rounded-lg bg-black border-2 border-border text-white w-[4.5rem] h-full flex items-center justify-center">
                                G
                            </div>
                            <div className="flex-col text-md">
                                <div className="font-bold bg-gradient bg-clip-text text-transparent inline-block">
                                    {password.title}
                                </div>
                                <div className="text-darkgrey text-lg">
                                    {password.username}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center basis-2/6">
                            <Tooltip

                                title="Click to copy"
                                placement="top"
                                arrow
                                PopperProps={{
                                    popperRef,
                                    anchorEl: {
                                        getBoundingClientRect: () => {
                                            return new DOMRect(
                                                positionRef.current.x,
                                                areaRef.current!.getBoundingClientRect().y,
                                                0,
                                                0,
                                            );
                                        },
                                    },
                                }}
                            >
                                <div ref={areaRef}
                                    onMouseMove={handleMouseMove}>
                                    <input onClick={() => copyToClipboard(password.pwd)} readOnly type="password" value={password.pwd.length > 15 ? `${password.pwd.substring(0, 15)}` : password.pwd} maxLength={20} className=" text-back bg-transparent focus:outline-none cursor-pointer" />
                                </div>

                            </Tooltip>

                        </div>


                        <div className="flex items-center  xl:basis-1/6">
                            <Tooltip

                                title={`Password level of security is ${password.pwd.length > 25 ? 'Strong' : password.pwd.length > 10 ? 'Medium' : 'Weak'}`}
                                placement="top"
                                arrow
                                PopperProps={{
                                    popperRef,
                                    anchorEl: {
                                        getBoundingClientRect: () => {
                                            return new DOMRect(
                                                positionRef.current.x,
                                                areaRef.current!.getBoundingClientRect().y,
                                                0,
                                                0,
                                            );
                                        },
                                    },
                                }}
                            >





                                <div ref={areaRef}
                                    onMouseMove={handleMouseMove} className={`flex items-center justify-center h-10  max-xl:px-2 ${password.pwd.length > 25 ? '  text-purple' : password.pwd.length > 10 ? ' text-orange' : 'text-red '} `}>
                                    {password.pwd.length > 25 ? <GppGoodRoundedIcon /> : password.pwd.length > 10 ? <ShieldRoundedIcon /> : <GppMaybeRoundedIcon />


                                    }

                                    <div className="hidden xl:flex">
                                        {password.pwd.length > 25 ? 'Strong' : password.pwd.length > 10 ? 'Medium' : 'Weak'}
                                    </div>
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                    <EditOverlay isOpen={openEditOverlayId === password.id} onClose={() => setOpenEditOverlayId(null)} userNames={userName} userKey={userKey} password={password.pwd} title={password.title} username={password.username} id={password.id}>
                        <></>
                    </EditOverlay>

                </div>

            ))
            }

        </div >
        :

        <div className="text-back w-full flex-col flex justify-center items-center space-y-7 ">
            <div className="text-2xl">
            Add your first password!
            </div> 
            <div onClick={() => setIsAddOverlayOpen(!isAddOverlayOpen)} className="bg-gradient p-0.5 rounded-lg bn5 group">
            <button className="bg-black py-2 px-7 rounded-md group-hover:bg-transparent group-hover:text-black">
                Add Password
            </button>
            </div>
            
        </div>
        }
        
        </>
        
        
    );
}

export default PasswordComp;
