
"use client"
import React, { useEffect, useState } from "react";
import Celebration from "../../Public/undraw_celebrating_rtuv.svg"
import Image from "next/image";
import foursquare from "../../Public/foursquare.svg"
interface ResultProps {
    isOpen: boolean;
    onClose: () => void;
    seedList: Array<string>;
    startTemp: boolean;
    setStartTemp: (start: boolean) => void;

}



const SignupResult: React.FC<ResultProps> = ({ isOpen, onClose, seedList, startTemp, setStartTemp }) => {

    const [allowClick, setAllowClick] = useState(5);


    useEffect(() => {
        if (startTemp) {
            setAllowClick(5)

            const temp = setInterval(() => {

                setAllowClick(prevAllowClick => {
                    console.log('allowe: ' + prevAllowClick + ' ' + allowClick)

                    if (prevAllowClick > 0) {
                        return prevAllowClick - 1;

                    }else{
                        clearInterval(temp);
                        return 0;
                    }
                    
                })
            }, 1000);
            return () => clearInterval(temp);
        }


    }, [startTemp]);
    const handleRestart =() =>{
        setStartTemp(false)
        setTimeout(() => {
            setStartTemp(true);
        }, 10);    };
    const handleClick = () => {
        // Si han pasado 5 segundos, ejecuta onClose
        if (allowClick === 0) {
            onClose()
            setStartTemp(false)
            
        }
    };

  
    seedList.map((seed, index) => `${index + 1}. ${seed}`).join(' ')

    return (
        <>
            {
                isOpen ? (
                    <div className='absolute flex justify-center items-center right-0 top-0 h-screen w-screen  z-50 '>
                        <div className="absolute h-full w-full bg-[#000000] opacity-80 -z-10" />
                        <div className="bg-darkgray text-whitebg w-[60rem] h-[32rem] flex flex-col justify-between rounded-lg items-center p-10 space-y-5">
                            <div className="font-bold text-2xl">
                                Congratulations!
                            </div>
                            <div className="flex space-x-2 ">
                                <div className="font-semibold text-red">IMPORTANT:
                                </div>
                                <div className="text-whitegray">
                                    These are the recovery words in case you forget your password, it is important that you keep it in a safe place and do not lose it.
                                </div>
                            </div>
                            <div className="grid grid-cols-5 gap-4 p-5 bg-whitegray rounded-lg">
                                {seedList.map((seed, index) => (
                                    <div className=" flex items-center wtext-center rounded-lg w-40 space-x-2 text-whitebg" key={index}>
                                        <div className="text-black w-4">
                                            {`${index + 1}`}
                                        </div>
                                        <div className="h-12 w-32 flex items-center justify-center bg-darkgray rounded-lg">
                                            {` ${seed}`}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="w-full px-24">
                                <button onClick={handleClick} className={`${allowClick === 0 ? 'bg-primary' : 'bg-whitegray'}  text-black h-12 w-full rounded-full font-semibold`}>
                                    {allowClick === 0 ? 'Continue' : allowClick}

                                </button>
                                
                            </div>
                        </div>
                    </div>
                )
                    : null
            }
        </>


    )
}

export default SignupResult;