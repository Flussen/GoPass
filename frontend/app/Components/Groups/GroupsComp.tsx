"use client"
import React, { useEffect, useState } from "react";
import { request, response, models } from '@/wailsjs/wailsjs/go/models';
import { GetAllPasswords, GetGroups } from "@/wailsjs/wailsjs/go/app/App";
import Visa from "../../../public/visa.svg"
import MasterCard from "../../../public/mastercard.svg"
import Defaulte from "../../../public/key.svg"
import American from "../../../public/American.svg"
import Image from "next/image";
import zIndex from "@mui/material/styles/zIndex";
import { GetAllCredentialsByGroup } from "@/wailsjs/wailsjs/go/app/App";
import { eventNames } from "process";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { GetAccountInfo } from "@/wailsjs/wailsjs/go/app/App";
import EditGroup from "./EditGroup";
import { faGoogle, faFacebookF, faInstagram, faDiscord, faYoutube, faPaypal, faFigma, faBehance, faTwitch, faXTwitter, faSteam, faTiktok, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
interface GroupProps {
    userName: string;
    search: string;
    twoColum: boolean;
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


const GroupComp: React.FC<GroupProps> = ({ userName, search, twoColum }) => {
    const [showPass, setShowPass] = useState<Record<string, boolean>>({});
    const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
    const [isEditOverlayOpen, setIsEditOverlayOpen] = useState(false);

    const [grupos, setGrupos] = useState<string[]>([])
    const [allGroupsNames, setAllGroupsNames] = useState([''])
    const [allGroups, setAllGroups] = useState<{ [key: string]: models.Password[] }>({});
    const [groupName, setGroupName] = useState('')



    async function GetAllGroups() {
        try {

            const response = await GetAllCredentialsByGroup(userName);
            setAllGroups(response)
        } catch (e) {
            console.log('Error in GetAllGroups: ', e);
        }
    }

    async function GetInfo() {
        const response = await GetAccountInfo(userName)
        console.log(response)
    }
    useEffect(() => {
        GetAllGroups();

    }, [])




    const toggleCvvVisibility = (groupId: string) => {
        setActiveGroupId(prevGroupId => prevGroupId === groupId ? null : groupId);
    };

    // const handleSubmit = (event: React.FormEvent) => {
    //     event.preventDefault();
    //     GetAllGroups();
    // }
    const getFontAwesomeIcon = (iconName: string) => {
        const search = iconName.toLowerCase();
        const matchingKey: any = Object.keys(SvgLogos).find(key => key.startsWith(search));
        return SvgLogos[matchingKey] || null; // Devuelve null o el ícono correspondiente
    };
    // const searchGroups = allGroups.filter((group) => group.toLowerCase().includes(search.toLowerCase()))

    return (
        <>
            <div className={`grid ${twoColum ? 'grid-cols-2' : 'grid-cols-1'}  gap-6 w-full`}>
                {Object.entries(allGroups).filter(([groupKey]) => groupKey !== 'default').map(([groupKey, passwords]) => (
                    <div key={groupKey} onClick={() => { toggleCvvVisibility(groupKey), setGroupName(groupKey) }} className={`bg-white rounded-lg text-black dark:text-white p-6 flex-col cursor-pointer group dark:bg-darkgray ${activeGroupId !== groupKey ? 'max-h-[4.5rem]' : ''}`}>
                        <div className="flex justify-between">
                            <div>{groupKey}</div>
                            <div className="flex items-center space-x-1 dark:text-gray text-whitegray dark:group-hover:text-white group-hover:text-gray ">
                                <div> {activeGroupId === groupKey ? 'Close' : 'Show'}</div>
                                {activeGroupId === groupKey ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
                            </div>
                        </div>
                        {activeGroupId === groupKey && (
                            <>
                                <div className="mt-6">
                                    {passwords.map((password, index) => (password.username !== '' ? (
                                        <div key={index} className="flex justify-between items-center h-12 mb-6">
                                            <div className="flex space-x-3 items-center">
                                                <div className="flex justify-center items-center bg-whitebg w-12 h-12 rounded-full text-2xl">
                                                    <FontAwesomeIcon icon={getFontAwesomeIcon(password.settings.icon)} />

                                                </div>
                                                <div>
                                                    {password.username}
                                                </div>
                                            </div>

                                            
                                            <div className="text-whitegray hover:text-gray">
                                                <ContentCopyRoundedIcon />
                                            </div>
                                        </div>) : null
                                    ))}
                                    <div className="  w-full ">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsEditOverlayOpen(true);
                                            }}
                                            className="bg-primary w-full h-12 text-white rounded-full">
                                            Edit Group
                                        </button>
                                    </div>
                                </div>
                                <EditGroup activeGroupId={activeGroupId} groupKey={groupName} onClose={() => setIsEditOverlayOpen(!isEditOverlayOpen)} isOpen={isEditOverlayOpen} userName={userName} />
                            </>
                        )}
                    </div>
                ))}
            </div>
        </>
    );

}

export default GroupComp;
