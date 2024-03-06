"use client"
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket, faCopy } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { DoSaveUserPassword } from "@/wailsjs/wailsjs/go/app/App";


interface AddOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const AddOverlay: React.FC<AddOverlayProps> = ({ isOpen,onClose, children }) => {

    const [title, setTitle] = useState("");
    const [usermail, setUsermail] = useState("");
    const [pass, setPass] = useState("");
    const [service, setService] = useState("");

    async function pullPasswords() {
        try {
            await DoSaveUserPassword(title, usermail, pass, service); // Assuming it throws an error on failure
            alert('Password Saved'); // If no error is thrown, operation is successful
        } catch (error) {
            console.error('Error saving password: ' + error);
            alert('Password not saved'); // Error handling
        }
    }
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Previene la recarga de la página
        
        await pullPasswords(); // Llama a la función pullRegister
    };
    return (
        <>
            {
                isOpen ? (
                    <div className='absolute flex justify-center items-center right-0 top-0 h-screen w-screen '>
                        <div onClick={onClose} className='absolute bg-black opacity-50 h-screen w-screen '></div>
                        <div className=' flex-col justify-center bg-white p-5 border-grey border-[2px] rounded-xl space-y-4 z-10'>
                            <div className='flex justify-between items-center'>
                                <div className='text-2xl font-semibold'>
                                    Credentials
                                </div>
                                <div onClick={onClose} className='relative flex text-xl justify-end cursor-pointer '>
                                    <FontAwesomeIcon icon={faXmark} />
                                </div>
                            </div>
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <div className='pl-4 font-medium'>
                                        Title
                                    </div>
                                    <div className='flex justify-between '>
                                        <input type="text" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
                                    </div>
                                    <div className='pl-4 font-medium'>
                                        Login
                                    </div>
                                    <div className='flex justify-between '>
                                        <input type="text" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='Username or Email' value={usermail} onChange={(e) => setUsermail(e.target.value)} />
                                    </div>
                                    <div className='pl-4 font-medium'>
                                        Password
                                    </div>
                                    <div className='flex justify-between '>
                                        <input type="password" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='Password' value={pass} onChange={(e) => setPass(e.target.value)} />
                                    </div>
                                    <div className='pl-4 font-medium'>
                                        Site
                                    </div>
                                    <div className='flex justify-between pb-7'>
                                        <input type="texto" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='www.example.com' value={service} onChange={(e) => setService(e.target.value)} />
                                    </div>
                                    <div className="flex justify-center ">
                                        <button type="submit" className="flex justify-center items-center w-40 h-10 border-blue border-[2px] rounded-full cursor-pointer hover:bg-blue hover:text-white font-semibold">
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