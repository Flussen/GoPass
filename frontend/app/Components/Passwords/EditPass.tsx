import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { useState } from "react";
import { DoUpdatePassword } from "@/wailsjs/wailsjs/go/app/App";
import { DoDeletePassword } from "@/wailsjs/wailsjs/go/app/App";
import { PasswordDecrypt } from "@/wailsjs/wailsjs/go/app/App";
import TitleRoundedIcon from '@mui/icons-material/TitleRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import { request, response, models } from '@/wailsjs/wailsjs/go/models';



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
    const [favorite, setFavorite] = useState(false)
 const[group, setGroup] = useState('');
 const[item, setItem]= useState('');

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
            const response = await DoDeletePassword(userNames, id)
        } catch {

        }
    }
    async function getDecryptedPass() {
        try {
            const decrypted = await PasswordDecrypt(userNames, id, userKey)
            setDecrypted(decrypted)
        } catch {

        }
    }

    const passwordData = new request.Password({
        id: id,
        title: titlee,
        username: email,
        pwd: pass,
        configs: new models.Settings({
            favorite: favorite,
            groups: group,
            icon: item,
            status: ''
        }),
        created_at:''
    });

    async function UpdatePasswords(passwordData: request.Password) {
        try {
            const response = await DoUpdatePassword(userNames, id, userKey, passwordData )
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
        await UpdatePasswords(passwordData); // Llama a la función pullLogin
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
                        <div onClick={onClose} className='absolute bg-[#000000]  opacity-75 h-screen w-screen '></div>
                        <div className=' flex-col justify-center bg-darkgray  p-5  rounded-lg space-y-4 z-10'>

                            <form >
                                <div className="text-white">

                                    <div className='pl-4 font-medium'>
                                        Title
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <TitleRoundedIcon sx={{ fontSize: 28 }} className="absolute ml-2 text-primary" />
                                        <input type="text" className='rounded-lg bg-blaack   pl-10 h-12 w-[30rem] outline-none placeholder:text-whitegray text-white' value={titlee} onChange={titlechange} />
                                    </div>
                                    <div className='pl-4 font-medium'>
                                        Login
                                    </div>

                                    <div className='flex justify-between items-center mb-2  '>
                                        <EmailRoundedIcon sx={{ fontSize: 28 }} className="absolute ml-2 text-primary" />
                                        <input type="text" className='rounded-lg bg-blaack   pl-10 h-12 w-[30rem] outline-none placeholder:text-whitegray text-white' value={email} onChange={emailchange} />
                                    </div>
                                    <div className='pl-4 font-medium'>
                                        Password
                                    </div>
                                    <div className='flex justify-between items-center mb-5'>
                                        <KeyRoundedIcon sx={{ fontSize: 28 }} className="absolute ml-2 text-primary" />
                                        <input type="password" className='rounded-lg bg-blaack   pl-10 h-12 w-[25rem] outline-none placeholder:text-whitegray text-white ' value={pass} onChange={passchange} />
                                        <button onClick={() => copyToClipboard(pass)} className="bg-primary text-blaack w-[4rem] py-2 rounded-lg hover:bg-darkprimary font-semibold"> Copy</button>
                                    </div>
                                    <div className="flex justify-center space-x-10">
                                        <button onClick={hanldeDelete} className="flex justify-center text-back items-center w-40 h-12 bg-gray rounded-lg cursor-pointer hover:bg-whitegray hover:text-black  font-semibold">
                                            Delete
                                        </button>
                                        <button onClick={handleSubmit} className="flex justify-center text-blaack items-center w-40 h-12  rounded-lg cursor-pointer bg-primary hover:bg-darkprimary hover:text-blackbox font-semibold">
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