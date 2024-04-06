import React from "react"
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import MonitorRoundedIcon from '@mui/icons-material/MonitorRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';

interface SettingsProps {
    setShowProfile: (show: boolean) => void;
    setOptionName: (show: string) => void;
    optionName:string;
}

const SettingsComp: React.FC<SettingsProps> = ({ setShowProfile, setOptionName, optionName }) => {

    return (
        <div id="Options" className="fixed flex flex-col justify-between xl:w-[16%] w-[75px]  bg-darkgray  pb-12   h-full ">
        <div className="flex-col  w-full  ">
  
  
          <div onClick={()=>setShowProfile(false)} className='flex justify-center items-center bg-gray text-whitegray hover:text-whitebg cursor-pointer h-12 w-12 m-3 pr-1 rounded-lg  '>
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 24 }} />

          </div>
  
          <div className="">
           
            <div onClick={() => { setOptionName('') }} className={`flex items-center xl:justify-start justify-center w-full  border-l-2 h-16 space-x-2 cursor-pointer text-whitegray  font-semibold xl:text-xl xl:pl-5 ${optionName == '' ? 'bg-black border-primary' : 'hover:text-blackwhite border-darkgray'}`}>
  
              <ManageAccountsRoundedIcon sx={{ fontSize: 32 }} />
  
  
              <div className=" xl:flex hidden">My Profile</div>
            </div>
            <div onClick={() => { setOptionName('Apparence') }} className={`flex items-center xl:justify-start justify-center w-full border-l-2  h-16 space-x-2 cursor-pointer text-whitegray  font-semibold xl:text-xl xl:pl-5 ${optionName == 'Apparence' ? 'bg-black  border-primary' : 'hover:text-blackwhite border-darkgray '}`}>
  
              <MonitorRoundedIcon sx={{ fontSize: 32 }} />
  
  
              <div className=" xl:flex hidden">Apparence</div>
            </div>
            <div onClick={() => { setOptionName('Help') }} className={`flex items-center xl:justify-start justify-center w-full   border-l-2 h-16 space-x-2 cursor-pointer text-whitegray  font-semibold xl:text-xl xl:pl-5 ${optionName == 'Help' ? 'bg-black border-l-2 border-primary' : 'hover:text-blackwhite border-darkgray'}`}>
  
              <HelpRoundedIcon sx={{ fontSize: 32 }} />
  
  
              <div className=" xl:flex hidden"> Help</div>
            </div>
            
          </div>
        </div>
        <div className="flex flex-col justify-between w-full      mt-[5.5rem]  ">
          
          <div className={`flex items-center xl:justify-start justify-center w-full  border-l-2  h-16 space-x-2 cursor-pointer text-whitegray  font-semibold xl:text-xl xl:pl-5 hover:text-whitebg  border-darkgray`}>
            <AccountCircleRoundedIcon sx={{ fontSize: 32 }} />
            <div className=" xl:flex hidden">Log Out</div>
          </div>
        </div>
  
      </div>
    )
}

export default SettingsComp;