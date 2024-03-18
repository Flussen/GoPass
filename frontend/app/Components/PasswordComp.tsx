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
import { faGoogle, faFacebookF, faInstagram, faDiscord, faYoutube, faPaypal, faFigma, faBehance, faTwitch, faXTwitter, faSteam, faTiktok, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";



//Click to copy se buguea cuando se mantiene y a la vez hago scroll.

interface PassProps {
    userName: string;
    userKey: string;
    isAddOverlayOpen: boolean;
    search: string;
    setArePasswords: (pass: boolean) => void;
    arePasswords: boolean;
    setIsAddOverlayOpen: (show: boolean) => void;
    showDashboard: boolean;
}

interface PasswordsProps {
    title: string;
    id: string;
    pwd: string;
    username: string;
    icon: string;
    created_date: string;
}

const SvgLogos: { [key: string]: any } = {

    "google": faGoogle,
    "facebook": faFacebookF,
    "instagram": faInstagram,
    "youtube": faYoutube,
    "paypal": faPaypal,
    "figma": faFigma,
    "behance": faBehance,
    "twitter": faXTwitter,
    "x": faXTwitter,
    "steam": faSteam,
    "tiktok": faTiktok,
    "github": faGithub,
    "discord": faDiscord,
    "default": faLock
}


const PasswordComp: React.FC<PassProps> = ({ showDashboard, userName, userKey, isAddOverlayOpen, search, setArePasswords, arePasswords, setIsAddOverlayOpen }) => {
    const [passwords, setPasswords] = useState<PasswordsProps[]>([]);
    const [decrypted, setDecrypted] = useState('');
    const [isEditOverlayOpen, setIsEditOverlayOpen] = useState(false);
    const [openEditOverlayId, setOpenEditOverlayId] = useState<string | null>(null);
    const [icon, setIcon] = useState('');
    const [svgItem, setSvgItem] = useState<any>();
    const [item, setItem] = useState('');
    const getFontAwesomeIcon = (iconName: string) => {
        const search = iconName.toLowerCase();
        const matchingKey: any = Object.keys(SvgLogos).find(key => key.startsWith(search));
        return SvgLogos[matchingKey] || null; // Devuelve null o el ícono correspondiente
    };

    useEffect(() => {
        getPasswords();
    }, [openEditOverlayId, isAddOverlayOpen, showDashboard]);




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
            console.log('Get passwords'+response)
            const data = JSON.parse(response);
            if (data && data.passwords) {
                const decryptedPasswords = await Promise.all(data.passwords.map(async (password: PasswordsProps) => {
                    const decryptedPwd = await ShowPassword(userName, password.id, userKey);
                    return { ...password, pwd: decryptedPwd };
                }));
                setArePasswords(true)
                console.log('Cargado dentro del if')
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
            
                    <div className=" flex-col w-full space-y-5 overflow-y-auto max-2xl:max-h-[80%] max-h-[40rem] px-2 mb-10">
                        {searchPasswords.map((password, index) => (

                            <div key={index} className="w-full ">
                                <div onChange={() => { setIcon(password.icon) }} onClick={() => setOpenEditOverlayId(openEditOverlayId === password.id ? null : password.id)} className="flex w-full h-24 bg-blackbox border-2 border-border p-3 rounded-lg text-xl cursor-pointer">
                                    <div className="flex items-center basis-3/6 space-x-5">
                                        <div className="rounded-lg bg-black border-2 border-border text-white w-[4.5rem] h-full flex items-center justify-center">
                                            <FontAwesomeIcon icon={getFontAwesomeIcon(password.icon)} className="text-back text-2xl" />
                                        </div>
                                        <div className="flex-col text-md">
                                            <div className="font-bold bg-gradient bg-clip-text text-transparent inline-block">
                                                {password.title}
                                            </div>
                                            <div className="text-darkgrey text-lg hover:text-grey">
                                                {password.username}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center basis-2/6 ">

                                        <div ref={areaRef}
                                            onMouseMove={handleMouseMove} className="group " >
                                            <input onClick={() => copyToClipboard(password.pwd)} readOnly type="password" value={password.pwd.length > 15 ? `${password.pwd.substring(0, 15)}` : password.pwd} maxLength={20} className=" text-back bg-transparent focus:outline-none cursor-pointer   " />

                                            
                                            {/* <div className="hidden absolute group-hover:flex justify-center items-end mt-[-4rem]">

                                                <div className=" bg-grey px-2 py-2 rounded-lg text-sm z-30">
                                                    Click to Copy
                                                </div>
                                                <div className="absolute bg-grey h-7 w-7 rotate-45 " />

                                            </div> */}

                                        </div>



                                    </div>


                                    <div className="flex items-center  xl:basis-1/6">



                                        <div ref={areaRef}
                                            onMouseMove={handleMouseMove} className={`flex items-center justify-center h-10  max-xl:px-2 font-semibold ${password.pwd.length > 25 ? '  text-purple' : password.pwd.length > 10 ? ' text-orange' : 'text-red '} `}>
                                            {password.pwd.length > 25 ? <GppGoodRoundedIcon /> : password.pwd.length > 10 ? <ShieldRoundedIcon /> : <GppMaybeRoundedIcon />


                                            }

                                            <div className="hidden xl:flex">
                                                {password.pwd.length > 25 ? 'Strong' : password.pwd.length > 10 ? 'Medium' : 'Weak'}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <EditOverlay isOpen={openEditOverlayId === password.id} onClose={() => setOpenEditOverlayId(null)} userNames={userName} userKey={userKey} password={password.pwd} title={password.title} username={password.username} id={password.id}>
                                    <></>
                                </EditOverlay>

                            </div>

                        ))
                        }

                    </div >
                    

                  
            

        </>


    );
}

export default PasswordComp;
