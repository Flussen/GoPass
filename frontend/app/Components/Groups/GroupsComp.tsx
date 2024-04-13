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
interface GroupProps {
    userName: string;
    search: string;
}

const GroupComp: React.FC<GroupProps> = ({ userName, search }) => {
    const [showPass, setShowPass] = useState<Record<string, boolean>>({});
    const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

    const [grupos, setGrupos] = useState<string[]>([])
    const [allGroupsNames, setAllGroupsNames] = useState([''])
    const [allGroups, setAllGroups] = useState<{ [key: string]: models.Password[] }>({});
   
    async function GetAllGroups() {
        try {

            console.log('empieza')
            const response = await GetAllCredentialsByGroup(userName);
            setAllGroups(response)
        } catch (e) {
            console.log('Error in GetAllGroups: ', e);
        }
    }
    useEffect(() => {
        GetAllGroups();

    }, [])


    

    const toggleCvvVisibility = (groupId: string) => {
        setActiveGroupId(prevGroupId => prevGroupId === groupId ? null : groupId);
    };
    
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        GetAllGroups();
    }

    // const searchGroups = allGroups.filter((group) => group.toLowerCase().includes(search.toLowerCase()))

    return (
    <>
        <div className="grid grid-cols-2 gap-6 w-full">
            {Object.entries(allGroups).map(([groupKey, passwords]) => (
                <div key={groupKey} onClick={() => toggleCvvVisibility(groupKey)} className={`bg-white rounded-lg text-black dark:text-white p-6 flex-col cursor-pointer group dark:bg-darkgray ${activeGroupId !== groupKey ? 'max-h-[4.5rem]':''}`}>
                    <div className="flex justify-between">
                        <div>{groupKey}</div>
                        <div className="flex items-center space-x-1 dark:text-gray text-whitegray dark:group-hover:text-white group-hover:text-gray ">
                            <div> {activeGroupId === groupKey ? 'Close' : 'Show'}</div>
                            {activeGroupId === groupKey  ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
                        </div>
                    </div>
                    {activeGroupId === groupKey && (
                        <div className="mt-6">
                            {passwords.map((password, index) => (
                                <div key={index} className="flex justify-between ">
                                    <p>{password.title}</p>
                                    <p>{password.username}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    </>
);

}

export default GroupComp;
