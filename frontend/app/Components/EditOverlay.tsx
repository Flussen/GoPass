import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { useState } from "react";
import { DoUpdateUserPassword } from "@/wailsjs/wailsjs/go/app/App";
import { DoDeleteUserPassword } from "@/wailsjs/wailsjs/go/app/App";
import { ShowPassword } from "@/wailsjs/wailsjs/go/app/App";
import TitleRoundedIcon from '@mui/icons-material/TitleRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';

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
    const [decrypted, setDecrypted] = useState('');


    const emailchange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setEmail(event.target.value);
    };
    const passchange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPass(event.target.value);
    };
    const titlechange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setTitlee(event.target.value);
    };
    async function DeletePassword() {
        try {
            const response = await DoDeleteUserPassword(userNames, id)
        } catch {

        }
    }
    async function getDecryptedPass() {
        try {
            const decrypted = await ShowPassword(userNames, id, userKey)
            setDecrypted(decrypted)
        } catch {

        }
    }



    async function UpdatePasswords() {
        try {
            const response = await DoUpdateUserPassword(userNames, userKey, id, titlee, email, pass)
            console.log('mark' + response)
        } catch {

        }
    }

    const hanldeDelete = async (event: React.FormEvent) => {
        event.preventDefault(); // Previene la recarga de la página 
        await DeletePassword();
        onClose();
    }
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Previene la recarga de la página
        await UpdatePasswords(); // Llama a la función pullLogin
        onClose();
    };
    const handlePasword = async (event: React.FormEvent) => {
        event.preventDefault(); // Previene la recarga de la página
        await getDecryptedPass(); // Llama a la función pullLogin

    };
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
    return (
        <>

            {
                isOpen ? (
                    <div className='absolute flex justify-center items-center right-0 top-0 h-screen w-screen '>
                        <div onClick={onClose} className='absolute bg-black opacity-75 h-screen w-screen '></div>
                        <div className=' flex-col justify-center bg-darkgray  p-5  rounded-lg space-y-4 z-10'>

                            <form >
                                <div className="text-white">

                                    <div className='pl-4 font-medium'>
                                        Title
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <TitleRoundedIcon sx={{ fontSize: 28 }} className="absolute ml-2 text-darkgray" />
                                        <input type="text" className='rounded-lg bg-black   pl-10 h-12 w-[30rem] outline-none placeholder:text-darkgray text-white' value={titlee} onChange={titlechange} />
                                    </div>
                                    <div className='pl-4 font-medium'>
                                        Login
                                    </div>

                                    <div className='flex justify-between items-center mb-2  '>
                                        <EmailRoundedIcon sx={{ fontSize: 28 }} className="absolute ml-2 text-darkgray" />
                                        <input type="text" className='rounded-lg bg-black   pl-10 h-12 w-[30rem] outline-none placeholder:text-darkgray text-white' value={email} onChange={emailchange} />
                                    </div>
                                    <div className='pl-4 font-medium'>
                                        Password
                                    </div>
                                    <div className='flex justify-between items-center mb-5'>
                                        <KeyRoundedIcon sx={{ fontSize: 28 }} className="absolute ml-2 text-darkgray" />
                                        <input type="password" className='rounded-lg bg-black   pl-10 h-12 w-[25rem] outline-none placeholder:text-darkgray text-white ' value={pass} onChange={passchange} />
                                        <button onClick={() => copyToClipboard(pass)} className="bg-green text-black w-[4rem] py-2 rounded-lg hover:bg-darkgreen font-semibold"> Copy</button>
                                    </div>
                                    <div className="flex justify-center space-x-10">
                                        <button onClick={hanldeDelete} className="flex justify-center text-back items-center w-40 h-12 bg-gray rounded-lg cursor-pointer hover:bg-whitegray hover:text-black  font-semibold">
                                            Delete
                                        </button>
                                        <button onClick={handleSubmit} className="flex justify-center text-back items-center w-40 h-12  rounded-lg cursor-pointer bg-green hover:bg-darkgreen hover:text-blackbox font-semibold">
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