"use client"

import React, { useState, useEffect } from "react";
import { request, response, models } from '@/wailsjs/wailsjs/go/models';
import TitleRoundedIcon from '@mui/icons-material/TitleRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import { DoNewCard } from "@/wailsjs/wailsjs/go/app/App";
import Image from "next/image";
import Visa from "../../../public/visa.svg"
import MasterCard from "../../../public/mastercard.svg"
import Defaulte from "../../../public/key.svg"
import American from "../../../public/American.svg"
import { UpdateCard } from "@/wailsjs/wailsjs/go/app/App";
import { DeleteCard } from "@/wailsjs/wailsjs/go/app/App";

interface EditCardProps {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
    userKey: string;
    originCardType: string;
    originHolder: string;
    originCardNumber: number;
    originMonth: string;
    originYear: string;
    originCvv: number;
    cardId: string;
}
const formatCardNumber = (number:number) => {
    return number.toString().replace(/\B(?=(\d{4})+(?!\d))/g, " ");
};
const EditCard: React.FC<EditCardProps> = ({ isOpen, onClose, userKey, userName, originCardNumber, originCardType, originCvv, originHolder, originMonth, originYear, cardId }) => {

    const [cardType, setCardType] = useState(originCardType)
    const [cvv, setCvv] = useState(originCvv)
    
    const [cardNumber, setCardNumber] = useState<string>(formatCardNumber(originCardNumber));

    const [holder, setHolder] = useState(originHolder)

    const [month, setMonth] = useState(originMonth)
 const[favorite, setFavorite]=useState(false)
    const [year, setYear] = useState(originYear)



    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 12 }, (v, i) => currentYear + i);

    const months = Array.from({ length: 12 }, (v, i) => {
        const month = (i + 1).toString().padStart(2, '0');
        return month;
    });

    const CardData = new request.Card({
        card: cardType,
        holder: holder,
        number: parseInt(cardNumber,10),
        security_code: cvv,
        month: parseInt(month, 10),
        year: parseInt(year, 10),
        settings: new models.Settings({
            favorite: true,
            group: '',
            icon: '',
            status: ''
        })

    })


    async function CardUpdate(CardData:request.Card) {
        try{
            const response=  await UpdateCard(userName, cardId, CardData)
            console.log(response)
        }catch(e){
            console.log('Error updating card: '+e)
        }
    }
    async function CardDelete(){
        try{
            const response = await DeleteCard(userName, cardId)
        }catch(e){
            console.log('error deleting; '+e)
        }
    }

    const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const cleanValue = value.replace(/\D+/g, '');

        const formattedValue = cleanValue.match(/.{1,4}/g)?.join(' ') || '';

        setCardNumber(formattedValue);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Previene la recarga de la página
        await CardUpdate(CardData); // Llama a la función pullLogin
        onClose();
    };
    
    const handleDelete = async (event: React.FormEvent)=>{
        event.preventDefault();
        await CardDelete();
        onClose()
    }


    return (
        <>
            {
                isOpen ? (
                    <div className="absolute flex justify-center items-center right-0 top-0 h-screen w-screen">
                        <div className='absolute bg-[#000000] opacity-80 h-screen w-screen '></div>
                        <div className='flex flex-col justify-center bg-darkgray p-5  rounded-lg  z-50' onClick={e => e.stopPropagation()}>

                           
                                <div className="flex justify-between ">
                                    <div className='flex justify-between items-center mb-4'>
                                        <TitleRoundedIcon sx={{ fontSize: 24 }} className="absolute ml-2 text-primary" />
                                        <input autoComplete="nope" type="text" className=' rounded-lg bg-black   pl-10 h-12 w-[22rem] outline-none placeholder:text-gray text-whitebg ' placeholder='Title' required value={holder} onChange={(e) => setHolder(e.target.value)} />
                                    </div>
                                    <div className="w-[6rem]  h-12 rounded-lg flex justify-center items-center">
                                        <Image src={cardType == 'Visa' ? Visa : cardType == 'MasterCard' ? MasterCard : cardType == 'American' ? American : Visa} alt="card" className=" h-12" />

                                    </div>
                                </div>


                                <div className='flex justify-between items-center mb-2 '>
                                    <CreditCardRoundedIcon sx={{ fontSize: 24 }} className="absolute ml-2 text-primary" />
                                    <input autoComplete="nope" type="text" className=' rounded-lg bg-black   pl-10 h-12 w-[30rem] outline-none placeholder:text-gray text-whitebg ' placeholder='1234 5678 9012 3456' maxLength={19} pattern="\d{4} \d{4} \d{4} \d{4}" required value={cardNumber} onChange={handleCardInput} />
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex space-x-2">
                                        <div className="relative inline-block group ">
                                            <select value={month} id="exp-month" name="exp_month " onChange={(e) => setMonth(e.target.value)} className="h-12 rounded-lg bg-black text-whitebg w-16 leading-tight  pl-4 block appearance-none  focus:outline-none  focus:border-gray-500 cursor-pointer">
                                                {months.map(month => (
                                                    <option key={month} value={month}>
                                                        {month}
                                                    </option>
                                                ))}
                                            </select>
                                            <div
                                                className="pointer-events-none absolute inset-y-0 right-0 flex items-center  text-gray h-12 group-hover:text-whitebg  mr-1"
                                            >
                                                <ExpandMoreRoundedIcon />
                                            </div>
                                        </div>
                                        <div className="relative inline-block group">
                                            <select value={year} id="exp-year" name="exp_year" onChange={(e) => setYear(e.target.value)} className="h-12 rounded-lg bg-black text-whitebg w-24 leading-tight  pl-4 block appearance-none  focus:outline-none  focus:border-gray-500 cursor-pointer">
                                                {years.map(year => (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                ))}
                                            </select>
                                            <div
                                                className="pointer-events-none absolute inset-y-0 right-0 flex items-center  text-gray h-12 group-hover:text-whitebg  mr-1 "
                                            >
                                                <ExpandMoreRoundedIcon />
                                            </div>
                                        </div>

                                    </div>

                                    <div className='flex justify-between items-center mb-4 '>
                                        <KeyRoundedIcon sx={{ fontSize: 24 }} className="absolute ml-2 text-primary" />

                                        <input
                                            autoComplete="nope"
                                            type="text"
                                            pattern="\d*"
                                            className="appearance-none rounded-lg bg-black pl-10 h-12 w-[5rem] outline-none placeholder:text-gray text-white"
                                            placeholder="123"
                                            maxLength={3}
                                            required
                                            value={cvv}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val.match(/^\d{0,3}$/)) {
                                                    setCvv(Number(val));
                                                }
                                            }}
                                        />
                                    </div>
                                </div>


                                <div className="flex justify-center space-x-4 items-center h-12 ">
                                    <button onClick={handleDelete} type="submit" className="flex justify-center items-center w-full h-full rounded-lg text-blaack cursor-pointer bg-red hover:bg-darkprimary font-semibold">
                                        Delete
                                    </button>
                                    <button onClick={handleSubmit} type="submit" className="flex justify-center items-center w-full h-full  rounded-lg text-blaack cursor-pointer bg-primary hover:bg-darkprimary font-semibold">
                                        Add Now
                                    </button>
                                </div>
                           

                        </div>
                    </div>
                ) : null
            }
        </>
    )
}


export default EditCard;