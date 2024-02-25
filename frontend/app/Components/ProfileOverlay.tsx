import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons/faRightFromBracket";


export function OverlayProfile({ isOpen, onClose }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) {

    return (
        <>

            {
                isOpen ? (
                    <div className='absolute flex justify-end  right-0 top-0  '>
                        <div onClick={onClose} className="w-screen h-screen bg-transparent opacity-50" />

                        <div className="absolute bg-white flex-col items-center justify-center border-2 border-grey rounded-xl m-5 p-5 space-y-5 ">
                            <div className="flex items-center space-x-3 hover:text-blue font-medium">
                                <FontAwesomeIcon icon={faUser} />
                                <div>Profile</div>
                            </div>
                            <div className="flex items-center space-x-3 hover:text-blue font-medium">
                                <FontAwesomeIcon icon={faGear} />
                                <div>Settings</div>
                            </div>
                            <div className="flex items-center space-x-3 hover:text-blue font-medium">
                                <FontAwesomeIcon icon={faRightFromBracket} />
                                <div>Log Out</div>
                            </div>
                        </div>


                    </div>
                ) : null
            }
        </>

    )
}

export default OverlayProfile;