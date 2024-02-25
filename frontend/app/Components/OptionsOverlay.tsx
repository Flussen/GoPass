"use client"
import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket, faGear, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons/faLayerGroup";
import { faKey } from "@fortawesome/free-solid-svg-icons/faKey";

interface OptionsOverlayProps {
    setShowGenerator:(value:boolean)=>void;
}



export function OptionsOverlay({setShowGenerator, isOpen, onClose }: {setShowGenerator:boolean, isOpen: boolean, onClose: () => void, children: React.ReactNode }) {

    return (
        <>

            {
                isOpen ? (
                    <div className='absolute flex justify-start left-0 top-0  '>
                        <div onClick={onClose} className="w-screen h-screen bg-black opacity-50" />

                        <div className="absolute bg-white flex flex-col items-center justify-between h-screen p-10 pt-14 pr-28 space-y-5 ">
                            <div className="space-y-5">
                                {/* Primer div */}
                                <div className="flex items-center space-x-3 hover:text-blue font-medium">
                                    <FontAwesomeIcon icon={faLayerGroup} />
                                    <div>Credentials</div>
                                </div>
                                {/* Segundo div */}
                                <div onClick={() => setShowGenerator(true)} className="flex items-center space-x-3 hover:text-blue font-medium">
                                    <FontAwesomeIcon icon={faKey} />
                                    <div>Generator</div>
                                </div>
                            </div>

                            {/* Tercer div, que se posicionará en la parte inferior */}
                            <div className="flex items-center jusitfy-start w-full space-x-3 hover:text-blue font-medium ">
                                <FontAwesomeIcon icon={faRightFromBracket} />
                                <div>Exit</div>
                            </div>
                        </div>


                    </div>
                ) : null
            }
        </>
    )
}

export default OptionsOverlay;