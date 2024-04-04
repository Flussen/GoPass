"use client"
import React, { useState, useEffect } from "react";

import { request, response, models } from '@/wailsjs/wailsjs/go/models';
import TitleRoundedIcon from '@mui/icons-material/TitleRounded';


interface AddGroupProps {

}

const AddGroup: React.FC <AddGroupProps> = ({})=>{
const [title, setTitle] = useState('');

    return(
        <>
        {
            true?(
                <div className='absolute flex justify-center items-center right-0 top-0 h-screen w-screen'>
                    <div className='absolute bg-[#000000] opacity-80 h-screen w-screen'/>
                    <div  className='flex flex-col justify-center bg-darkgray p-5 rounded-lg z-10'  >
                        <form >
                        <div className='flex justify-between items-center mb-4'>
                                        <TitleRoundedIcon sx={{ fontSize: 24 }} className="absolute ml-2 text-primary" />
                                        <input autoComplete="nope" type="text" className=' rounded-lg bg-black   pl-10 h-12 w-[22rem] outline-none placeholder:text-gray text-whitebg ' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    </div>

                        </form>
                    </div>

                </div>
            ):null
        }
        </>
    )
}

export default AddGroup;