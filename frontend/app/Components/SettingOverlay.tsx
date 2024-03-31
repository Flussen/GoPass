import React from "react"
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import MonitorRoundedIcon from '@mui/icons-material/MonitorRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
interface SettingsProps {
    setShowProfile: (show: boolean) => void;
}

const SettingsComp: React.FC<SettingsProps> = ({ setShowProfile }) => {

    return (
        <div id="Options" className="fixed flex flex-col justify-between 2xl:w-[20%] w-[100px]  bg-darkgray  rounded-lg   ml-8 mt-8 mb-8 pt-[0.5rem] h-[92%] ">
            <div className="flex-col justify-center w-full   px-[20px]  space-y-[3rem]">
                <div onClick={() => { setShowProfile(false) }} className="flex items-center justify-center h-14 w-14 mt-5 2xl:ml-2  rounded-lg bg-gray cursor-pointer text-primary hover:bg-whitegray">
                    <ArrowBackIosNewRoundedIcon sx={{ fontSize: 28 }}/>
                </div>

                
                <div className="space-y-2">
                    <div className={`flex items-center 2xl:justify-start justify-center 2xl:pl-[10%] h-14 rounded-2xl  space-x-2 cursor-pointer  font-semibold 2xl:text-xl  ${true ? ' text-primary max-2xl:bg-gray' : 'text-gray  hover:text-whitegray'}`}>

                    <ManageAccountsRoundedIcon sx={{ fontSize: 28 }} className="" />

                        <div className={`2xl:flex hidden `}>Your Account</div>
                    </div>
                    <div className={`flex items-center 2xl:justify-start justify-center 2xl:pl-[10%] h-14 rounded-2xl space-x-2 cursor-pointer 2xl:text-xl xl:text-base  font-semibold ${false ? 'text-primary max-2xl:bg-gray' : 'text-whitegray  hover:text-primary'}`}>

                    <MonitorRoundedIcon sx={{ fontSize: 28 }} className="" />

                        <div className=" 2xl:flex hidden">Apparence</div>
                    </div>
                    <div className={`flex items-center 2xl:justify-start justify-center 2xl:pl-[10%] h-14 rounded-2xl space-x-2 cursor-pointer 2xl:text-xl xl:text-base  font-semibold ${false ? ' text-primary max-2xl:bg-border' : 'text-whitegray  hover:text-primary'}`}>
                    <HelpRoundedIcon sx={{ fontSize: 28 }} className="" />
                        <div className=" 2xl:flex hidden">Help</div>
                    </div>
                </div>
            </div>
          

        </div>
    )
}

export default SettingsComp;