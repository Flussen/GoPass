import React, { useEffect, useState } from "react";
import GppGoodRoundedIcon from '@mui/icons-material/GppGoodRounded';
import { GetAllPasswords } from "@/wailsjs/wailsjs/go/app/App";
import GppMaybeRoundedIcon from '@mui/icons-material/GppMaybeRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import EditOverlay from './EditPass';
import Tooltip from '@mui/material/Tooltip';
import { Instance } from '@popperjs/core';
import Box from '@mui/material/Box';
import { faGoogle, faFacebookF, faInstagram, faDiscord, faYoutube, faPaypal, faFigma, faBehance, faTwitch, faXTwitter, faSteam, faTiktok, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { PasswordDecrypt } from "@/wailsjs/wailsjs/go/app/App";
import { request, response, models } from '@/wailsjs/wailsjs/go/models';


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
    status: string;
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
    const [container, setContainer] = useState(['']);
    const [passwords, setPasswords] = useState<models.Password[]>([]);
    const [isEditOverlayOpen, setIsEditOverlayOpen] = useState(false);
    const [openEditOverlayId, setOpenEditOverlayId] = useState<string | null>(null);
    const [icon, setIcon] = useState('');
    const [svgItem, setSvgItem] = useState<any>();
    const [item, setItem] = useState('');
    const [id, setId] = useState('');
    
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

    // const handleMouseMove = (event: React.MouseEvent) => {
    //     positionRef.current = { x: event.clientX, y: event.clientY };

    //     if (popperRef.current != null) {
    //         popperRef.current.update();
    //     }
    // };


  

   
    async function showPassword(){
        try{
           const response= await PasswordDecrypt(userName, id, userKey)
            console.log('pass: '+response)
        }catch(e){
            console.log('error al pillar pass: '+e)
        }
    }

    async function getPasswords() {
        try {
            const response = await GetAllPasswords(userName) ;
            setArePasswords(true)
            setPasswords(response)
            console.log('ladata: ' + response);

         

            // if (arePasswords) {

            //     const decryptedPasswords = await Promise.all(passwords.map(async (password: request.Password) => {

            //         const decryptedPwd = await PasswordDecrypt (userName, passwords.id, userKey);
            //         return { ...password, pwd: decryptedPwd };

            //     }));
            //     setPasswords(decryptedPasswords);

            //     setArePasswords(true)





            // } else {
            //     console.error("Passwords not found in response:", data);
            //     setArePasswords(false)
            // }

        } catch (error) {
            console.error("Error fetching passwords:", error, userName);
            setArePasswords(false)
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


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Previene la recarga de la página
        await showPassword(); // Llama a la función pullLogin

    };

    const searchPasswords = passwords.filter((password) => password.title.toLowerCase().includes(search.toLowerCase()));


    return (
        <>
            <div className="flex w-full text-BASE font-semibold pl-5 mb-5 text-gray">

                <div className="basis-3/6">
                    Name
                </div>
                <div className="basis-2/6">
                    Password
                </div>
                <div className="basis-1/6">
                    Status
                </div>
            </div>
            <div className="  flex-col w-full overflow-y-auto  max-2xl:max-h-[80%]  h-[29.35rem]  max-h-[29.35rem] bg-darkgray rounded-lg ">

                {searchPasswords.map((password, index) => (

                    <div key={index} className="w-full ">
                        <div onChange={() => { setIcon(password.settings.icon) }} onClick={() => { setOpenEditOverlayId(openEditOverlayId === password.id ? null : password.id), setId(password.id) }} className="flex w-full h-[5.74rem]  p-5 rounded-lg  cursor-pointer">
                            <div className="flex items-center basis-3/6 space-x-5">
                                <div onClick ={handleSubmit} className="rounded-lg bg-black shadow-shadow text-whitebg w-20 h-full flex items-center justify-center text-2xl">
                                    <FontAwesomeIcon icon={getFontAwesomeIcon(password.settings.icon)}  />
                                </div>
                                <div className="flex-col text-lg">
                                    <div className="font-bold text-primary">
                                        {password.title}
                                    </div>
                                    <div className="text-gray text-base font-medium hover:text-whitegray">
                                        {password.username}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center  basis-2/6 ">

                                <div ref={areaRef}
                                     className="group " >
                                    <input onClick={() => copyToClipboard(password.pwd)} readOnly type="password" value={59238798432} maxLength={20} className=" text-whitebg bg-transparent focus:outline-none cursor-pointer  inline-block  " />
                                   
                                </div>
                            </div>
                            <div className="flex items-center  xl:basis-1/6">
                                <div ref={areaRef}
                                   className={`flex items-center justify-center h-10  max-xl:px-2 font-semibold ${password.settings.status == 'Strong' ? '  text-primary' : password.settings.status == 'Medium' ? ' text-primary' : 'text-red '} `}>
                                    {password.settings.status == 'Strong' ? <GppGoodRoundedIcon /> : password.settings.status == 'Medium' ? <ShieldRoundedIcon /> : <GppMaybeRoundedIcon />}
                                    <div className="hidden xl:flex">
                                        {password.settings.status == 'Strong' ? 'Strong' : password.settings.status == 'Strong' ? 'Medium' : 'Weak'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="h-0.5 w-[90%] bg-gray rounded-full" />

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
