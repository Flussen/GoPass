"use client"
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket, faCopy } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { DoSaveUserPassword } from "@/wailsjs/wailsjs/go/app/App";
import { faGoogle, faFacebookF, faInstagram, faDiscord, faYoutube, faPaypal, faFigma, faBehance, faTwitch, faXTwitter, faSteam, faTiktok, faGithub  } from "@fortawesome/free-brands-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";



interface AddOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    userName: string;
    userKey: string;
    setArePasswords: (show:boolean) => void;
}

const SvgLogos : { [key: string]: any } = {

    "google" : faGoogle,
    "facebook" : faFacebookF,
    "instagram" : faInstagram,
    "youtube" : faYoutube,
    "paypal" : faPaypal,
    "figma" : faFigma,
    "behance" : faBehance,
    "twitter" : faXTwitter,
    "x" : faXTwitter,
    "steam" : faSteam,
    "tiktok" : faTiktok,
    "github" : faGithub,
    "discord" : faDiscord,
    "default": faLock
}




const AddOverlay: React.FC<AddOverlayProps> = ({ isOpen,onClose, children, userKey, userName, setArePasswords }) => {
    const [title, setTitle] = useState("");
    const [usermail, setUsermail] = useState("");
    const [pass, setPass] = useState("");
    const [svgItem, setSvgItem] = useState<any>();
    const [item, setItem] = useState('');

    useEffect(() => {
        const findIcon = () => {
            const search = title.toLowerCase();
            const matchingKey = Object.keys(SvgLogos).find(key => key.startsWith(search)) || 'default';
            setItem(matchingKey);
            setSvgItem(SvgLogos[matchingKey] ? SvgLogos[matchingKey] : 'default');
        };
        findIcon();
    }, [title]);

    async function pullPasswords() {
        try {

            await DoSaveUserPassword(userName, usermail, title, pass, item, userKey); 
            setTitle('');
            setUsermail('');
            setPass('');
            setItem('')
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
                        <div onClick={onClose} className='absolute bg-black opacity-50 h-screen w-screen '></div>
                        <div className=' flex-col justify-center bg-blackbox p-5  rounded-lg border-2 border-border space-y-4 z-10'>
                            

                            <div className="flex justify-center items-center space-x-5">
                                <div className=" flex justify-center items-center rounded lg- h-28 w-28 border-2 border-border bg-black">
                                <FontAwesomeIcon icon={svgItem} className="text-back text-4xl" />
                                </div>
                                <div className="flex-col jusitfy-center items-center space-y-2">
                                    
                                    <div className="border-2 border-border  text-back px-7 py-2 rounded-lg">
                                        Custom
                                    </div>
                                </div>
                            </div>
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <div className='pl-4 font-medium'>
                                        Title
                                    </div>
                                    <div className='flex justify-between '>
                                        <input type="text" className=' rounded-lg bg-black border-2 border-border  pl-4 py-2 w-[30rem] outline-none placeholder:text-darkgrey text-back' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
                                    </div>
                                    <div className='pl-4 font-medium'>
                                        Login
                                    </div>
                                    <div className='flex justify-between '>
                                        <input type="text" className=' rounded-lg bg-black border-2 border-border  pl-4 py-2 w-[30rem] outline-none placeholder:text-darkgrey text-back' placeholder='Username or Email' value={usermail} onChange={(e) => setUsermail(e.target.value)} />
                                    </div>
                                    <div className='pl-4 font-medium'>
                                        Password
                                    </div>
                                    <div className='flex justify-between '>
                                        <input type="password" className=' rounded-lg bg-black border-2 border-border  pl-4 py-2 w-[30rem] outline-none placeholder:text-darkgrey text-back mb-5' placeholder='Password' value={pass} onChange={(e) => setPass(e.target.value)} />
                                    </div>
                                    
                                    <div className="flex justify-center ">
                                        <button type="submit" className="flex justify-center items-center w-40 h-10 border-blue border-[2px] rounded-lg text-back cursor-pointer hover:bg-blue hover:text-black font-semibold">
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