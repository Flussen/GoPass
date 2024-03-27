"use client"
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket, faCopy } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { DoSaveUserPassword } from "@/wailsjs/wailsjs/go/app/App";
import { faGoogle, faFacebookF, faInstagram, faDiscord, faYoutube, faPaypal, faFigma, faBehance, faTwitch, faXTwitter, faSteam, faTiktok, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import TitleRoundedIcon from '@mui/icons-material/TitleRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';

interface AddOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    userName: string;
    userKey: string;
    setArePasswords: (show: boolean) => void;
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




const AddOverlay: React.FC<AddOverlayProps> = ({ isOpen, onClose, children, userKey, userName, setArePasswords }) => {
    const [title, setTitle] = useState("");
    const [usermail, setUsermail] = useState("");
    const [pass, setPass] = useState("");
    const [svgItem, setSvgItem] = useState<any>();
    const [item, setItem] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const findIcon = () => {
            const search = title.toLowerCase();
            const matchingKey = Object.keys(SvgLogos).find(key => key.startsWith(search)) || 'default';
            setItem(matchingKey);
            setSvgItem(SvgLogos[matchingKey] ? SvgLogos[matchingKey] : 'default');
        };
        findIcon();
    }, [title]);

    useEffect(() => {
        if (pass.length > 25) {
            setStatus('Strong')
        } else if (pass.length > 10) {
            setStatus('Medium')
        } else {
            setStatus('Weak')
        }
    }, [pass])

    async function pullPasswords() {


        try {
            await DoSaveUserPassword(userName, usermail, title, pass, item, status, userKey);
            setTitle('');
            setUsermail('');
            setPass('');
            setItem('')
            setStatus('');
            setArePasswords(true)
        } catch (error) {
            console.error('Error saving password: ' + error);

            alert('Password not saved'); // Error handling
        }

    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Previene la recarga de la página
        onClose()
        await pullPasswords(); // Llama a la función pullRegister
    };
    return (
        <>
            {
                isOpen ? (
                    <div className='absolute flex justify-center items-center right-0 top-0 h-screen w-screen '>
                        <div onClick={onClose} className='absolute bg-black opacity-75 h-screen w-screen '></div>
                        <div className=' flex-col justify-center bg-darkgray p-5  rounded-lg space-y-4 z-10'>


                            <div className="flex justify-center items-center space-x-5">
                                <div className=" flex justify-center items-center rounded-lg h-28 w-28  bg-blaack">
                                    <FontAwesomeIcon icon={svgItem} className="text-white text-4xl" />
                                </div>
                                <div className="flex-col jusitfy-center items-center space-y-2">

                                    <div className=" flex items-center bg-primary  text-blaack px-7 h-12 rounded-lg">
                                        Custom
                                    </div>
                                </div>
                            </div>
                            <div className="text-white ">
                                <form onSubmit={handleSubmit} >
                                    <div className='pl-4 font-medium'>
                                        Title
                                    </div>
                                    <div className='flex justify-between items-center mb-2'>
                                        <TitleRoundedIcon sx={{ fontSize: 28 }} className="absolute ml-2 text-primary" />
                                        <input autoComplete="nope" type="text" className=' rounded-lg bg-blaack   pl-10 h-12 w-[30rem] outline-none placeholder:text-whitegray text-white' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
                                    </div>
                                    <div className='pl-4 font-medium'>
                                        Login
                                    </div>
                                    <div className='flex justify-between items-center mb-2 '>
                                        <EmailRoundedIcon sx={{ fontSize: 28 }} className="absolute ml-2 text-primary" />
                                        <input autoComplete="nope" type="text" className=' rounded-lg bg-blaack   pl-10 h-12 w-[30rem] outline-none placeholder:text-whitegray text-white' placeholder='Username or Email' value={usermail} onChange={(e) => setUsermail(e.target.value)} />
                                    </div>
                                    <div className='pl-4 font-medium'>
                                        Password
                                    </div>
                                    <div className='flex justify-between items-center mb-4 '>
                                        <KeyRoundedIcon sx={{ fontSize: 28 }} className="absolute ml-2 text-primary" />
                                        <input autoComplete="nope" type="password" className=' rounded-lg bg-blaack   pl-10 h-12 w-[30rem] outline-none placeholder:text-whitegray text-white ' placeholder='Password' value={pass} onChange={(e) => setPass(e.target.value)} />
                                    </div>

                                    <div className="flex justify-center ">
                                        <button type="submit" className="flex justify-center items-center w-40 h-12  rounded-lg text-blaack cursor-pointer bg-primary hover:bg-darkprimary font-semibold">
                                            Add Now
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
                    : null
            }


        </>
    )
}

export default AddOverlay;