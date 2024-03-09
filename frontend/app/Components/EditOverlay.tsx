import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { useState } from "react";
import { DoUpdateUserPassword } from "@/wailsjs/wailsjs/go/app/App";
import { DoDeleteUserPassword } from "@/wailsjs/wailsjs/go/app/App";


interface OverlayProfileProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    password: string;
    title: string;
    username: string;
    userNames: string;
    userKey: string;
    id: string;
}

export function OverlayProfile({ isOpen, onClose, children, password, title, username, userNames, userKey, id }: OverlayProfileProps) {
    const [email, setEmail] = useState(username);
    const [pass, setPass] = useState(password);
    const [titlee, setTitlee] = useState(title);
   

    const emailchange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setEmail(event.target.value);
    };
    const passchange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPass(event.target.value);
    };
    const titlechange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setTitlee(event.target.value);
    };
    async function DeletePassword(){
        try{
            const response = await DoDeleteUserPassword(userNames, id)
            alert('Se ha eliminado correctamente')
        }catch{

        }
    }
   

    async function UpdatePasswords() {
        try {
            const response = await DoUpdateUserPassword(userNames,userKey, id, titlee, email, pass)
            console.log('mark'+response)
        } catch {

        }
    }

    const hanldeDelete = async (event: React.FormEvent) =>{
        event.preventDefault(); // Previene la recarga de la página 
        await DeletePassword();
        onClose();
    }
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Previene la recarga de la página
        await UpdatePasswords(); // Llama a la función pullLogin
        onClose();
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
                                    Cons
                                </div>
                                <div onClick={onClose} className='relative flex text-xl justify-end cursor-pointer '>
                                    <FontAwesomeIcon icon={faXmark} />
                                </div>
                            </div>
                            <form >
                                <div>
                                    <div className='pl-4 font-medium'>
                                        Title
                                    </div>
                                    <div className='flex justify-between '>


                                        <input type="text" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='Title' value={titlee} onChange={titlechange} />

                                        <div className='a flex items-center  pt-2.5 p-3'>
                                            <FontAwesomeIcon icon={faCopy} className='text-xl text-grey cursor-pointer ' />
                                        </div>

                                    </div>
                                    <div className='pl-4 font-medium'>
                                        Login
                                    </div>
                                    <div className='flex justify-between '>


                                        <input type="text" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='Username or Email' value={email} onChange={emailchange} />

                                        <div className='a flex items-center  pt-2.5 p-3'>
                                            <FontAwesomeIcon icon={faCopy} className='text-xl text-grey cursor-pointer ' />
                                        </div>

                                    </div>
                                    <div className='pl-4 font-medium'>
                                        Password
                                    </div>
                                    <div className='flex justify-between '>


                                        <input type="password" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='Passwordw' value={pass} onChange={passchange} />

                                        <div className='a flex items-center  pt-2.5 p-3'>
                                            <FontAwesomeIcon icon={faCopy} className='text-xl text-grey cursor-pointer ' />
                                        </div>

                                    </div>

                                    
                                    <div className="flex justify-center space-x-10">
                                        <button onClick={hanldeDelete} className="flex justify-center items-center w-40 h-10 border-red border-[2px] rounded-full cursor-pointer hover:bg-red hover:text-white font-semibold">
                                            Delete
                                        </button>
                                        <button onClick={handleSubmit} className="flex justify-center items-center w-40 h-10 border-blue border-[2px] rounded-full cursor-pointer hover:bg-blue hover:text-white font-semibold">
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : null
            }
        </>

    )
}

export default OverlayProfile;