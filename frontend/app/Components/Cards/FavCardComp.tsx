"use client"
import React, { useEffect, useState } from "react";
import { request, response, models } from '@/wailsjs/wailsjs/go/models';
import { GetAllCards } from "@/wailsjs/wailsjs/go/app/App";
import Visa from "../../../public/visa.svg"
import MasterCard from "../../../public/mastercard.svg"
import Defaulte from "../../../public/key.svg"
import American from "../../../public/American.svg"
import Image from "next/image";
import EditCard from "./EditCard";
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';

interface CardsProps {
    userName: string;
    search: string;
    isOpen: boolean;
    userKey: string;
    setAreFavCards:(fav:boolean)=>void;

}

const CardsComp: React.FC<CardsProps> = ({ userName, search, isOpen, userKey, setAreFavCards }) => {
    const [allCards, setAllCards] = useState<models.Card[]>([])
    const [openEditOverlayId, setOpenEditOverlayId] = useState<string | null>(null);
    const [id, setId] = useState('');
    const [showFullNumber, setShowFullNumber] = useState(false);
    const [showCvv, setShowCvv] = useState<Record<string, boolean>>({});
 
    const formatCardNumber = (number?: number) => {
        if (typeof number !== 'number') {
            return '';
        }

        let formattedNumber = number.toString().replace(/\B(?=(\d{4})+(?!\d))/g, " ");

        if (!showFullNumber) {
            formattedNumber = '•••• •••• •••• ' + formattedNumber.slice(-4);
        }

        return formattedNumber;
    };
    useEffect(() => {
        async function fetchCards() {
            try {
                const response = await GetAllCards(userName);
                setAllCards(response);
                // Update favorite cards state based on response
                const isFavPresent = response.some(card => card.settings.favorite);
                setAreFavCards(isFavPresent);
            } catch (e) {
                console.log('Error getting cards: ' + e);
            }
        }
    
        fetchCards();
        // Add necessary dependencies here
    }, [userName, isOpen, openEditOverlayId, setAreFavCards]); // Include all dependencies used within useEffect
    

    const favCards = allCards.filter((card) => card.settings.favorite);
    const copyToClipboard = async (pwd: number) => {
        if (!pwd) {
            console.error('No hay número válido para copiar');
            return;
        }
        try {
            await navigator.clipboard.writeText(pwd.toString());
        } catch (err) {
            console.error('Error al copiar el número: ', err);
        }
    };
    const toggleCvvVisibility = (cardId: string) => {
        setShowCvv(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };
    const totalCount = allCards.reduce((count, card) => card.settings.favorite ? count + 1 : count, 0);
    
    if(totalCount>=1){
        setAreFavCards(true)
        console.log('Se cambio a true en if totalcoun FavCardComp')
    }else{
        setAreFavCards(false)
        console.log('Se cambio a False en if totalcoun FavCardComp')

    }
    return (
        <>
            {
                true ? (
                    <div className={`h-full w-full ${totalCount<3?'space-y-2 ':'grid grid-flow-row gap-2'}   overflow-y-auto`}>
                        {favCards.map((card, index) => (
                            <div key={card.id} className={` flex flex-col justify-center w-full ${totalCount<3?'h-1/3':'h-full'}  dark:bg-darkgray bg-white rounded-lg font-semibold  dark:text-whitebg text-darkgray px-2 py-3 space-y-3 `}>
                                <div className="flex justify-between w-full items-center h-4">
                                    <div className="w-full max-w-40 truncate">
                                        {card.holder}
                                    </div>
                                    <div className="w-12 h-full rounded-md  flex justif-center items-center p-2" >
                                        <Image src={card.card == 'Visa' ? Visa : card.card == 'MasterCard' ? MasterCard : card.card == 'American' ? American : Visa} alt="card" className=" h-12" />
                                    </div>
                                </div>
                                <div className='flex justify-between items-center  dark:bg-black bg-whitebg w-full py-1.5 px-2 rounded-lg'>
                                    <div className="flex space-x-1">
                                        <div className="dark:bg-gray bg-blackwhite  rounded-full h-[0.4rem] w-[0.4rem]" />
                                        <div className="dark:bg-gray bg-blackwhite  rounded-full h-[0.4rem] w-[0.4rem]" />

                                        <div className="dark:bg-gray bg-blackwhite  rounded-full  h-[0.4rem] w-[0.4rem]" />

                                        <div className="dark:bg-gray bg-blackwhite  rounded-full  h-[0.4rem] w-[0.4rem]" />

                                    </div>
                                    <div className="flex space-x-1">
                                        <div className="dark:bg-gray bg-blackwhite  rounded-full h-[0.4rem] w-[0.4rem]" />
                                        <div className="dark:bg-gray bg-blackwhite  rounded-full h-[0.4rem] w-[0.4rem]" />

                                        <div className="dark:bg-gray bg-blackwhite  rounded-full  h-[0.4rem] w-[0.4rem]" />

                                        <div className="dark:bg-gray bg-blackwhite  rounded-full  h-[0.4rem] w-[0.4rem]" />

                                    </div>
                                    <div className="flex space-x-1">
                                        <div className="dark:bg-gray bg-blackwhite  rounded-full h-[0.4rem] w-[0.4rem]" />
                                        <div className="dark:bg-gray bg-blackwhite  rounded-full h-[0.4rem] w-[0.4rem]" />

                                        <div className="dark:bg-gray bg-blackwhite  rounded-full  h-[0.4rem] w-[0.4rem]" />

                                        <div className="dark:bg-gray bg-blackwhite  rounded-full  h-[0.4rem] w-[0.4rem]" />

                                    </div>
                                    <div>
                                        {card.number.toString().slice(-4)}
                                    </div>
                                    <div onClick={() => copyToClipboard(card.number)} className="dark:text-gray dark:hover:text-whitebg text-blackwhite hover:text-gray cursor-pointer">
                                        <ContentCopyRoundedIcon />
                                    </div>

                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        {
                                            (new Date(card.expiry)
                                                .getMonth() + 1)
                                                .toString()
                                                .padStart(2, '0')
                                        }/{
                                            (new Date(card.expiry)
                                                .getFullYear())
                                                .toString()
                                                .slice(-2)
                                        }
                                    </div>
                                    <div className=" flex justify-between dark:bg-black bg-whitebg  items-center py-1.5 px-2  w-20 rounded-lg ">
                                        {!showCvv[card.id] ? (<div className="flex space-x-1">
                                            <div className="dark:bg-gray bg-blackwhite  rounded-full  h-[0.4rem] w-[0.4rem]" />
                                            <div className="dark:bg-gray bg-blackwhite rounded-full  h-[0.4rem] w-[0.4rem]" />
                                            <div className="dark:bg-gray bg-blackwhite  rounded-full  h-[0.4rem] w-[0.4rem]" />
                                        </div>) :
                                            <div>
                                                {card.security_code}
                                            </div>
                                        }
                                        <div onClick={() => toggleCvvVisibility(card.id)} className="dark:text-gray dark:hover:text-whitebg text-blackwhite hover:text-gray  cursor-pointer">
                                            {showCvv[card.id] ? <VisibilityOffRoundedIcon /> : <RemoveRedEyeRoundedIcon />}
                                        </div>
                                    </div>

                                </div>



                            </div>

                        ))

                        }


                    </div>

                ) : null
            }
        </>
    )
}

export default CardsComp