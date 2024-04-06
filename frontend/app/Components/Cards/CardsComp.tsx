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


interface CardsProps {
    userName: string;
    search: string;
    isOpen: boolean;
    userKey: string;
}

const CardsComp: React.FC<CardsProps> = ({ userName, search, isOpen, userKey }) => {
    const [allCards, setAllCards] = useState<models.Card[]>([])
    const [openEditOverlayId, setOpenEditOverlayId] = useState<string | null>(null);
    const [id, setId] = useState('');

    async function GetCards() {
        try {
            const response = await GetAllCards(userName)
            setAllCards(response)


        } catch (e) {
            console.log('Erro geting cards: ' + e)
        }
    }

    useEffect(() => {
        GetCards();
    }, [isOpen, openEditOverlayId])


    const searchCards = allCards.filter((card) => card.holder.toLowerCase().includes(search.toLowerCase()))

    return (
        <>
            <div className="flex w-full text-base font-semibold  mb- text-gray">
                <div className="  w-24  pl-7 ">
                    Card
                </div >
                <div className="w-[20%] mr-6 pl-2 ">
                    Name
                </div>
                <div className="max-lg:basis-2/5 basis-1/3 ">
                    Number
                </div>
                <div className=" basis-1/6 flex justify-center">
                    Date
                </div>
                <div className="max-lg:hidden basis-1/12  flex justify-center mr-6">
                    CVV
                </div>

            </div>
            <div className="flex flex-col items-center w-full h-5/6 bg-darkgray rounded-lg overflow-y-auto">
                {searchCards.map((card, index) => (
                    <div onClick={() => { setOpenEditOverlayId(openEditOverlayId === card.id ? null : card.id), setId(card.id) }} key={index} className="w-full flex-col ">
                        <div className="w-full h-20 flex items-center py-6 text-whitebg cursor-pointer">
                            <div className="w-24 h-full ">
                                <div className={`${card.card == 'Visa' ? 'bg-visa p-1.5' : card.card == 'MasterCard' ? 'bg-black p-1.5' : ''} w-12 h-full rounded-md ml-6 flex justif-center items-center `}>
                                    <Image src={card.card == 'Visa' ? Visa : card.card == 'MasterCard' ? MasterCard : card.card == 'American' ? American : Visa} alt="card" className=" h-12" />
                                </div>
                            </div>

                            <div className="font-semibold w-[20%] mr-6 truncate ">
                                {card.settings.favorite == true ?
                                    card.holder : 'No Fav'
                                }
                            </div>
                            <div className="flex items-center space-x-4 max-xl:basis-2/5 basis-1/3  ">
                                <div className="flex space-x-1">
                                    <div className="bg-gray rounded-full h-[0.4rem] w-[0.4rem]" />
                                    <div className="bg-gray rounded-full h-[0.4rem] w-[0.4rem]" />

                                    <div className="bg-gray rounded-full  h-[0.4rem] w-[0.4rem]" />

                                    <div className="bg-gray rounded-full  h-[0.4rem] w-[0.4rem]" />

                                </div>
                                <div className="flex space-x-1">
                                    <div className="bg-gray rounded-full  h-[0.4rem] w-[0.4rem]" />
                                    <div className="bg-gray rounded-full  h-[0.4rem] w-[0.4rem]" />

                                    <div className="bg-gray rounded-full  h-[0.4rem] w-[0.4rem]" />

                                    <div className="bg-gray rounded-full  h-[0.4rem] w-[0.4rem]" />

                                </div>
                                <div className="flex space-x-1">
                                    <div className="bg-gray rounded-full  h-[0.4rem] w-[0.4rem]" />
                                    <div className="bg-gray rounded-full  h-[0.4rem] w-[0.4rem]" />

                                    <div className="bg-gray rounded-full  h-[0.4rem] w-[0.4rem]" />

                                    <div className="bg-gray rounded-full  h-[0.4rem] w-[0.4rem]" />

                                </div>
                                <div className=" font-semibold text-base ">
                                    {card.number.toString().slice(-4)}
                                </div>
                            </div>
                            <div className="text-base font-semibold basis-1/6  flex justify-center">
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
                            <div className="max-lg:hidden flex justify-center space-x-1 basis-1/12 mr-6">
                                <div className="bg-whitebg rounded-full  h-[0.4rem] w-[0.4rem]" />
                                <div className="bg-whitebg rounded-full  h-[0.4rem] w-[0.4rem]" />
                                <div className="bg-whitebg rounded-full  h-[0.4rem] w-[0.4rem]" />
                            </div>

                        </div>
                        <div className="w-full flex justify-center">
                            <div className="bg-gray h-0.5 rounded-full w-[85%] " />

                        </div>
                        <EditCard isOpen={openEditOverlayId === card.id} onClose={() => setOpenEditOverlayId(null)} userName={userName} userKey={userKey} originCardType={card.card} originHolder={card.holder} originCardNumber={card.number} originMonth={(new Date(card.expiry)
                            .getMonth() + 1)
                            .toString()
                            .padStart(2, '0')} originYear={(new Date(card.expiry)
                                .getFullYear())
                                .toString()
                            } originCvv={card.security_code} cardId={id} />

                    </div>
                ))}


            </div>
        </>
    )
}
export default CardsComp