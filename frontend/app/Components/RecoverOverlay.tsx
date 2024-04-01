
"use client"
import React, { useState } from "react";
import Celebration from "../../Public/undraw_celebrating_rtuv.svg"
import Image from "next/image";
import foursquare from "../../Public/foursquare.svg"
import { DoCheckSeeds } from "@/wailsjs/wailsjs/go/app/App";
import { request, response, models } from '@/wailsjs/wailsjs/go/models';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import { GetAccountInfo } from '@/wailsjs/wailsjs/go/app/App';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
interface RecoverProps {
    isOpen: boolean;
    onClose: () => void;
}





const RecoverOverlay: React.FC<RecoverProps> = ({ isOpen, onClose }) => {

    const [recoverList, setRecoverList] = useState(Array(15).fill(''));
    const [userCorrect, setUserCorrect] = useState(false);
    const [userName, setUserName] = useState('');
    const [userIncorrect, setUserIncorrect]= useState(false);
    const handleInputChange = (value: string, index: number) => {
        // Actualizar el estado con el nuevo valor en la posición correcta
        setRecoverList(currentList => {
            const newList = [...currentList]; // Copiar el array actual para no mutar el estado directamente
            newList[index] = value; // Actualizar el valor en la posición correspondiente
            return newList; // Devolver el nuevo array como el próximo estado
        });
    };


    async function userVerification() {
        try{
            const response = await GetAccountInfo(userName);
            const data = JSON.parse(response) as { id: string };
            if(data.id!==''){
                setUserCorrect(true)
            }else{
                setUserIncorrect(true);
                setTimeout(() => {
                    setUserIncorrect(false);
                  }, 2500);
            }
            console.log(response)
        }catch(error){
            setUserIncorrect(true);
            setTimeout(() => {
                setUserIncorrect(false);
              }, 4000);
        }
    }



    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Previene la recarga de la página
        await userVerification(); // Llama a la función pullLogin
        // Simula una carga o espera por una operación asíncrona
    
      };

    return (
        <>
            {
                isOpen ? (
                    <div className='absolute flex justify-center items-center right-0 top-0 h-screen w-screen  z-50 '>
                        <div className="bg-darkgray text-whitebg w-full h-full flex flex-col justify-center rounded-lg items-center p-10 space-y-5">
                            <div className="w-full flex justify-start">
                                <div onClick={()=>{
                                    setUserName('');
                                    if(userCorrect)
                                    {setUserCorrect(false)
                                        setRecoverList(Array(15).fill(''));
                                    }
                                    
                                    else{
                                        onClose()
                                    }}} className="h-12 w-12 rounded-lg border-2 border-gray text-gray hover:bg-gray hover:text-darkgray flex justify-center items-center cursor-pointer">
                                    < ArrowBackIosRoundedIcon/>
                                </div>
                            </div>

                            {userCorrect ? (
                                <div className="w-full h-full flex flex-col justify-center items-center space-y-5">
                                    <div className="font-bold text-2xl">
                                        Enter All Words!
                                    </div>
                                    

                                    <div className="grid grid-cols-5 gap-4 p-5 bg-whitegray rounded-lg">
                                        {Array.from({ length: 15 }).map((_, index) => (
                                            <div key={index} className="flex items-center text-center rounded-lg w-40 space-x-2 text-whitebg">
                                                <div className="text-black w-4">
                                                    {index + 1}
                                                </div>
                                                <input
                                                    type="text"
                                                    className="rounded-lg h-12 w-32 bg-darkgray outline-none pl-2"
                                                    value={recoverList[index]} // Asignar el valor correspondiente a cada input
                                                    onChange={(e) => handleInputChange(e.target.value, index)} // Manejar el cambio
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="w-[30rem] ">
                                        <button className="bg-primary text-black h-12 w-full rounded-full font-semibold">
                                            Recover
                                        </button>
                                    </div>
                                </div>
                            ) :
                                (
                                    <div className="w-full h-full flex flex-col justify-center items-center space-y-5">
                                        <div className="font-bold text-2xl">
                                            Enter your username
                                        </div>
                                        <div className="w-[30rem] flex items-center">
                                            <KeyRoundedIcon className="absolute ml-4 text-primary" />
                                            <input type="text" className="bg-black rounded-full h-12 w-full pl-12 outline-none placeholder:text-gray " placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />

                                        </div>
                                        <div onClick={handleSubmit} className="w-[30rem] ">
                                            <button className="bg-primary text-black h-12 w-full rounded-full font-semibold">
                                                Continue
                                            </button>
                                        </div>
                                        {userIncorrect?(
                                            <div className="absolute bottom-20 bg-primary p-2 rounded-lg text-darkgray font-medium">
                                                Sorry, we cant find your account.
                                            </div>
                                        ):
                                        <>
                                        </>}
                                    </div>
                                )
                            }

                        </div>
                    </div>
                )
                    : null
            }
        </>


    )
}

export default RecoverOverlay;