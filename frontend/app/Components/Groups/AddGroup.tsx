"use client"
import React, { useState, useEffect } from "react";

import { request, response, models } from '@/wailsjs/wailsjs/go/models';
import TitleRoundedIcon from '@mui/icons-material/TitleRounded';
import { DoNewGroup } from "@/wailsjs/wailsjs/go/app/App";

interface AddGroupProps {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
}

const AddGroup: React.FC<AddGroupProps> = ({ isOpen, onClose, userName }) => {
    const [title, setTitle] = useState('');


    // const [group, setGroup] = useState(['']);
    var group:string[] = [title]

    async function PullGroup() {
        try {
            const response = await DoNewGroup(userName, group)
            console.log('Los grupos: ' + response)
        } catch (e) {
            console.log('error pulling group: ' + e)
        }
    }


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Title: ' + title)

        // setGroup([title]);
        console.log('Group: ' + group)
        onClose()
        await PullGroup()
    }
    return (
        <>
            {
                isOpen ? (
                    <div className='absolute flex justify-center items-center right-0 top-0 h-screen w-screen'>
                        <div onClick={onClose} className='absolute bg-[#000000] opacity-80 h-screen w-screen' />
                        <div className='flex flex-col justify-center items-center bg-darkgray  w-[57rem] h-[75%]  p-5 rounded-lg z-10 text-whitebg space-y-4'  >
                            <div className="font-bold text-2xl">
                                Enter Group Name
                            </div>
                            <form onSubmit={handleSubmit} >
                                <div className='flex justify-between items-center mb-4'>
                                    <TitleRoundedIcon sx={{ fontSize: 24 }} className="absolute ml-4 text-primary" />
                                    <input autoComplete="nope" type="text" className=' rounded-full bg-black   pl-12 h-12 w-[30rem] outline-none placeholder:text-gray text-whitebg ' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>
                                <button className="h-12 rounded-full bg-primary w-[30rem] text-darkgray">
                                    Create
                                </button>

                            </form>
                        </div>

                    </div>
                ) : null
            }
        </>
    )
}

export default AddGroup;