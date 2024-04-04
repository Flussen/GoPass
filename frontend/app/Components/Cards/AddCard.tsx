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


interface AddCardProps {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
}

const AddCards: React.FC<AddCardProps> = ({ isOpen, onClose, userName }) => {
    const [card, setCard] = useState('')
    const [title, setTitle] = useState("");
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState("");
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 12 }, (v, i) => currentYear + i);

    const months = Array.from({ length: 12 }, (v, i) => {
        const month = (i + 1).toString().padStart(2, '0');
        return month;
    });
    useEffect(() => {
        getCardType(cardNumber);
    }, [cardNumber]);
    const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const cleanValue = value.replace(/\D+/g, '');

        const formattedValue = cleanValue.match(/.{1,4}/g)?.join(' ') || '';

        setCardNumber(formattedValue);
    };

    const CardData = new request.Card({
        card: card,
        holder: title,
        number: parseInt(cardNumber.replace(/\s+/g, '')),
        security_Code: parseInt(cvv, 10),
        month: parseInt(month, 10),
        yeah: parseInt(year, 10),
        settings: new models.Settings({
            favorite: false,
            group: '',
            icon: '',
            status: ''
        })

    })

    async function pullCards(CardData: request.Card) {
        try {
            const response = await DoNewCard(userName, CardData)
            console.log('Responde Cards: ' + response)
        } catch (e) {
            console.log('error sending cards: ' + e)
        }
    }
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        onClose();
        await pullCards(CardData);
    }

    const getCardType = (cardNumber: string): void => {
        const cleanCardNumber = cardNumber.replace(/\s+/g, ''); // Remover espacios

        if (/^4/.test(cleanCardNumber)) {
            setCard('Visa');
        }

        else if (/^5[1-5]/.test(cleanCardNumber)) {
            setCard('MasterCard');
        }

        else if (/^3[47]/.test(cleanCardNumber)) {
            setCard('American');
        }
        else {
            setCard('Unknown');
        }
    };


    return (
        <>
            {
                isOpen ? (
                    <div className="absolute flex justify-center items-center right-0 top-0 h-screen w-screen">
                        <div onClick={onClose} className='absolute bg-[#000000] opacity-80 h-screen w-screen '></div>
                        <div className='flex flex-col justify-center bg-darkgray p-5  rounded-lg  z-10'>

                            <form onSubmit={handleSubmit} >
                                <div className="flex justify-between ">
                                    <div className='flex justify-between items-center mb-4'>
                                        <TitleRoundedIcon sx={{ fontSize: 24 }} className="absolute ml-2 text-primary" />
                                        <input autoComplete="nope" type="text" className=' rounded-lg bg-black   pl-10 h-12 w-[22rem] outline-none placeholder:text-gray text-whitebg ' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    </div>
                                    <div className="w-[6rem]  h-12 rounded-lg flex justify-center items-center">
                                        <Image src={card == 'Visa' ? Visa : card == 'MasterCard' ? MasterCard : card == 'American' ? American : Visa} alt="card" className=" h-12"/>
                                    </div>
                                </div>


                                <div className='flex justify-between items-center mb-2 '>
                                    <CreditCardRoundedIcon sx={{ fontSize: 24 }} className="absolute ml-2 text-primary" />
                                    <input autoComplete="nope" type="text" className=' rounded-lg bg-black   pl-10 h-12 w-[30rem] outline-none placeholder:text-gray text-whitebg ' placeholder='1234 5678 9012 3456' value={cardNumber} maxLength={19} pattern="\d{4} \d{4} \d{4} \d{4}" onChange={handleCardInput} required />
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex space-x-2">
                                        <div className="relative inline-block group ">
                                            <select id="exp-month" name="exp_month " onChange={(e) => setMonth(e.target.value)} value={month} className="h-12 rounded-lg bg-black text-whitebg w-16 leading-tight  pl-4 block appearance-none  focus:outline-none  focus:border-gray-500 cursor-pointer">
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
                                            <select id="exp-year" name="exp_year" value={year} onChange={(e) => setYear(e.target.value)} className="h-12 rounded-lg bg-black text-whitebg w-24 leading-tight  pl-4 block appearance-none  focus:outline-none  focus:border-gray-500 cursor-pointer">
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

                                        <input autoComplete="nope" type="text" className=' rounded-lg bg-black   pl-10 h-12 w-[5rem] outline-none placeholder:text-gray text-whitebg ' placeholder='123' value={cvv} maxLength={3} onChange={(e) => setCvv(e.target.value)} required />
                                    </div>
                                </div>


                                <div className="flex justify-center ">
                                    <button type="submit" className="flex justify-center items-center w-full h-12  rounded-lg text-blaack cursor-pointer bg-primary hover:bg-darkprimary font-semibold">
                                        Add Now
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                )
                    : null
            }

        </>
    )
}

export default AddCards