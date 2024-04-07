"use client"
import React, { useEffect, useState } from "react";
import { request, response, models } from '@/wailsjs/wailsjs/go/models';
import { GetGroups } from "@/wailsjs/wailsjs/go/app/App";
import Visa from "../../../public/visa.svg"
import MasterCard from "../../../public/mastercard.svg"
import Defaulte from "../../../public/key.svg"
import American from "../../../public/American.svg"
import Image from "next/image";
import zIndex from "@mui/material/styles/zIndex";
import { GetAllCredentialsByGroup } from "@/wailsjs/wailsjs/go/app/App";

interface GroupProps {
    userName: string;
    search: string;
}

const GroupComp: React.FC<GroupProps> = ({ userName, search }) => {

    const [allGroups, setAllGroups] = useState([''])

    async function GetNameGroups() {
        try {
            const response = await GetGroups(userName)
            setAllGroups(response)
            console.log('Los grupos: '+response)

        } catch (e) {
            console.log('error getting groups: ' + e)
        }
    }

    useEffect(() => {
        GetNameGroups();
    }, [])

    
    async function GetAllGroups() {
        try {
            const response = await GetAllCredentialsByGroup()

            console.log('Response: ' + response)

            for (let id in response){
                console.log(id)
                response[id].forEach(element => {
                    console.log(element)
                });
            }
        } catch (e) {
            console.log(e)
        }
    }

    const handleSubmit = async (event:React.FormEvent)=>{
        event.preventDefault();
        await GetAllGroups()
    }

    const searchGroups = allGroups.filter((group) => group.toLowerCase().includes(search.toLowerCase()))

    return (
        <>
            {
                true ? (
                    <>
                        <div className="grid grid-cols-2 w-full  ">
                           <button onClick={handleSubmit} className="h-12 w-12 bg-primary">

                            Prueba
                           </button>

                        </div>

                    </>

                ) : null
            }

        </>
    )
}

export default GroupComp;
