import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { useState } from "react";
import { DoUpdateUserPassword } from "@/wailsjs/wailsjs/go/app/App";



interface OverlayProfileProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    password: string;
    title: string;
    username:string;
    userNames: string;
    userKey:string;
    id: string;
  }
  
  export function OverlayProfile({ isOpen, onClose, children, password, title, username, userNames, userKey, id }: OverlayProfileProps) {
     const [email, setEmail] = useState("example@gmail.com");
    const emailchange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setEmail(event.target.value);
    };


    async function UpdatePasswords(){
        try{
            const response = await DoUpdateUserPassword(userNames,userKey, id, title, username, password)
                

        }catch{

        }
    }
    return (
        <>

            {
                isOpen ? (
                    <div className='absolute flex justify-center items-center right-0 top-0 h-screen w-screen '>
                        <div onClick={onClose} className='absolute bg-black opacity-50 h-screen w-screen '></div>
                        <div className=' flex-col justify-center bg-white p-5 border-grey border-[2px] rounded-xl space-y-4 z-10'>
                            <div className='flex justify-between items-center'>

                                <div className='text-2xl font-semibold'>
                                    Cons
                                </div>
                                <div onClick={onClose} className='relative flex text-xl justify-end cursor-pointer '>
                                    <FontAwesomeIcon icon={faXmark} />
                                </div>
                            </div>
                            <div>
                                <div className='pl-4 font-medium'>
                                    Title
                                </div>
                                <div className='flex justify-between '>


                                    <input type="text" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='Title' value={title} />

                                    <div className='a flex items-center  pt-2.5 p-3'>
                                        <FontAwesomeIcon icon={faCopy} className='text-xl text-grey cursor-pointer ' />
                                    </div>

                                </div>
                                <div className='pl-4 font-medium'>
                                    Login
                                </div>
                                <div className='flex justify-between '>


                                    <input type="text" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='Username or Email' value={username}  />

                                    <div className='a flex items-center  pt-2.5 p-3'>
                                        <FontAwesomeIcon icon={faCopy} className='text-xl text-grey cursor-pointer ' />
                                    </div>

                                </div>
                                <div className='pl-4 font-medium'>
                                    Password
                                </div>
                                <div className='flex justify-between '>


                                    <input type="password" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='Passwordw' value={password} />

                                    <div className='a flex items-center  pt-2.5 p-3'>
                                        <FontAwesomeIcon icon={faCopy} className='text-xl text-grey cursor-pointer ' />
                                    </div>

                                </div>

                                <div className='pl-4 font-medium'>
                                    Site
                                </div>
                                <div className='flex justify-between pb-7'>


                                    <input type="URL" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='URL' value="www.google.com" />

                                    <div className='a flex items-center  pt-2.5 p-3'>
                                        <FontAwesomeIcon icon={faArrowRightToBracket} className='text-xl text-grey cursor-pointer ' />
                                    </div>

                                </div>
                                <div className="flex justify-center space-x-10">
                                    <div className="flex justify-center items-center w-40 h-10 border-red border-[2px] rounded-full cursor-pointer hover:bg-red hover:text-white font-semibold">
                                        Delete
                                    </div>
                                    <div className="flex justify-center items-center w-40 h-10 border-blue border-[2px] rounded-full cursor-pointer hover:bg-blue hover:text-white font-semibold">
                                        Update
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null
            }
        </>

    )
}

export default OverlayProfile;