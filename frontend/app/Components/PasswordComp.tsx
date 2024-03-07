import React, { useEffect, useState } from "react";
import GppGoodRoundedIcon from '@mui/icons-material/GppGoodRounded';
import { GetUserPasswords } from "@/wailsjs/wailsjs/go/app/App";
import { ShowPassword } from "@/wailsjs/wailsjs/go/app/App";
import GppMaybeRoundedIcon from '@mui/icons-material/GppMaybeRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import EditOverlay from './EditOverlay';


interface PassProps {
    userName: string;
    userKey: string;

}

interface PasswordsProps {
    title: string;
    id: string;
    pwd: string;
    username: string;
    created_date: string;
}


const PasswordComp: React.FC<PassProps> = ({ userName, userKey }) => {
    const [passwords, setPasswords] = useState<PasswordsProps[]>([]);
    const [decrypted, setDecrypted] = useState('');
    const [isEditOverlayOpen, setIsEditOverlayOpen] = useState(false);
    const [openEditOverlayId, setOpenEditOverlayId] = useState<string | null>(null);


    const [id, setId] = useState('');
    useEffect(() => {
        getPasswords();
    }, []);

    


    async function getPasswords() {
        try {
            const response = await GetUserPasswords(userName);
            const data = JSON.parse(response);
            if (data && data.passwords) {
                const decryptedPasswords = await Promise.all(data.passwords.map(async (password: PasswordsProps) => {
                    const decryptedPwd = await ShowPassword(userName, password.id, userKey);
                    return { ...password, pwd: decryptedPwd };

                }));
                setPasswords(decryptedPasswords);
                setId(data.passwords.id)
                console.log(data.passwords)
            } else {
                console.error("Passwords not found in response:", data);
            }
        } catch (error) {
            console.error("Error fetching passwords:", error);
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

    return (
        <div className="flex-col w-full space-y-5">
            {passwords.map((password, index) => (
                <div key={index} className="w-full ">
                    <div onClick={() => setOpenEditOverlayId(openEditOverlayId === password.id ? null : password.id)} className="flex w-full h-24 bg-box p-3 rounded-2xl text-xl">
                        <div className="flex items-center basis-3/6 space-x-5">
                            <div className="rounded-xl bg-white w-[4.5rem] h-full flex items-center justify-center">
                                G
                            </div>
                            <div className="flex-col text-md">
                                <div className="font-bold">
                                    {password.title}
                                </div>
                                <div className="text-grey text-lg">
                                    {password.username}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center basis-2/6">
                            <input onClick={() => copyToClipboard(password.pwd)} readOnly type="password" value={password.pwd.length > 15 ? `${password.pwd.substring(0, 15)}` : password.pwd} maxLength={20} className="bg-transparent focus:outline-none cursor-pointer" />

                        </div>
                        <div className="flex items-center  xl:basis-1/6">

                            <div className={`flex items-center justify-center rounded-full h-10 xl:w-40 max-xl:px-2 ${password.pwd.length > 25 ? 'bg-lightgreen  text-green' : password.pwd.length > 10 ? 'bg-red-300  text-orange-500 bg-orange-100' : 'text-red bg-rose-100'} `}>
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

            ))}

        </div>
    );
}

export default PasswordComp;
