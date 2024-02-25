"use client"
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket, faCopy } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";

export function AddOverlay ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) {
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
                                <div className='pl-4 font-medium'>
                                    Title
                                </div>
                                <div className='flex justify-between '>


                                    <input type="text" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='Title'  />

                                    

                                </div>
                                <div className='pl-4 font-medium'>
                                    Login
                                </div>
                                <div className='flex justify-between '>


                                    <input type="text" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='Username or Email'  />


                                </div>
                                <div className='pl-4 font-medium'>
                                    Password
                                </div>
                                <div className='flex justify-between '>


                                    <input type="password" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='Password'  />

                                    

                                </div>

                                <div className='pl-4 font-medium'>
                                    Site
                                </div>
                                <div className='flex justify-between pb-7'>


                                    <input type="URL" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='www.example.com'  />

                                    

                                </div>
                                <div className="flex justify-center ">
                                    
                                    <div className="flex justify-center items-center w-40 h-10 border-blue border-[2px] rounded-full cursor-pointer hover:bg-blue hover:text-white font-semibold">
                                        Add Now
                                    </div>
                                </div>
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