"use client"

import React, { useEffect, useState } from "react";
import { request, response, models } from '@/wailsjs/wailsjs/go/models';


interface CardsProps {

}

const CardsComp: React.FC<CardsProps> = ({ }) => {



    return (
        <>
            <div className="flex w-full text-base font-semibold  mb- text-gray">
                <div className="basis-1/6  pl-7 ">
                    Card
                </div >
                <div className="basis-1/4 pl-2 ">
                    Name
                </div>
                <div className="basis-1/3 ">
                    Number
                </div>
                <div className="basis-1/6 flex justify-center">
                    Date
                </div>
                <div className="basis-1/12  flex justify-center pr-6">
                    CVV
                </div>

            </div>
            <div className="flex flex-col items-center w-full max-2xl:max-h-[80%]  h-[25.7rem]  max-h-[25.7rem] bg-darkgray rounded-lg">
                <div className="w-full h-20 flex items-center py-6 text-whitebg space-x-2">
                    <div className="basis-1/6 h-full ">
                        <div className="bg-visa w-12 h-full rounded-md ml-6">

                        </div>
                    </div>

                    <div className="font-semibold basis-1/4 truncate">
                        Josue Bustamante
                    </div>
                    <div className="flex items-center space-x-3 basis-1/3  ">
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
                            0384
                        </div>
                    </div>
                    <div className="text-base font-semibold basis-1/6  flex justify-center">
                        08/48
                    </div>
                    <div className="flex space-x-1 basis-1/12 pr-6">
                        <div className="bg-whitebg rounded-full  h-[0.4rem] w-[0.4rem]" />
                        <div className="bg-whitebg rounded-full  h-[0.4rem] w-[0.4rem]" />

                        <div className="bg-whitebg rounded-full  h-[0.4rem] w-[0.4rem]" />


                    </div>
                </div>
                <div className="bg-gray h-0.5 rounded-full w-[85%] " />



            </div>
        </>
    )
}
export default CardsComp
