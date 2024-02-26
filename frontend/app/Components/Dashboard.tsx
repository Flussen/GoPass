"use client"

import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faBars, faEllipsis, faMagnifyingGlass, faXmark, faArrowRightToBracket, } from '@fortawesome/free-solid-svg-icons';
import { faUser, faCopy, } from '@fortawesome/free-regular-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import EditOverlay from './EditOverlay';
import ProfileOverlay from './ProfileOverlay';
import AddOverlay from './AddOverlay';
import OptionsOverlay from "./OptionsOverlay";

interface DashboardProps {
  setShowGenerator: (show: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({setShowGenerator}) => {
  const [showPass, setShowPass] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [email, setEmail] = useState("example@gmail.com");
  const emailchange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setEmail(event.target.value);
  };

  const [isEditOverlayOpen, setIsEditOverlayOpen] = useState(false);
  const [isOptionsOverlayOpen, setIsOptionsOverlayOpen] = useState(false);
  const [isProfileOverlayOpen, setIsProfileOverlayOpen] = useState(false);
  const [isAddOverlayOpen, setIsAddOverlayOpen] = useState(false);

  return (
    <div>
      <div className='flex items-start justify-between mb-20'>
        <div onClick={() => setIsOptionsOverlayOpen(!isOptionsOverlayOpen)} className='flex justify-center items-center h-14 w-14 m-5 cursor-pointer '>
          <FontAwesomeIcon icon={faBars} className='text-xl ' />
        </div>
        <OptionsOverlay setShowGenerator={setShowGenerator}  isOpen={isOptionsOverlayOpen} onClose={() => setIsOptionsOverlayOpen(!isOptionsOverlayOpen)}>
          <>
          </>
        </OptionsOverlay>

        <div className='flex items-center mt-5 ml-5'>
          <FontAwesomeIcon icon={faMagnifyingGlass} className='absolute ml-4 ' />
          <input type="text" className='flex rounded-full border-grey border-[2px] pl-10 w-[34rem] h-14 py-2' placeholder='Buscar' />
        </div>


        <div onClick={() => setIsProfileOverlayOpen(!isProfileOverlayOpen)} className='flex justify-center items-center rounded-full border-grey border-[2px]  py-2 w-14 h-14 m-5 cursor-pointer '>
          <FontAwesomeIcon icon={faUser} className='text-xl ' />
        </div>
        <ProfileOverlay isOpen={isProfileOverlayOpen} onClose={() => setIsProfileOverlayOpen(!isProfileOverlayOpen)}>
          <>
          </>
        </ProfileOverlay>

      </div>

      <div className='flex justify-center space-x-72 mb-10'>
        <div className='font-bold text-2xl'>
          My Passwords
        </div>
        <div onClick={() => setIsAddOverlayOpen(!isAddOverlayOpen)} className='border-blue border-[2px] rounded-full w-fit px-5 py-2 font-semibold hover:bg-blue hover:text-white cursor-pointer'>
          Add new
        </div>
        <AddOverlay isOpen={isAddOverlayOpen} onClose={() => setIsAddOverlayOpen(!isAddOverlayOpen)}>
          <>
          </>
        </AddOverlay>
      </div>
      <div className='flex justify-center '>


        <div className='flex  space-x-5  '>

          <div className='flex justify-start items-center border-grey border-[2px]  rounded-xl h-14 w-[30rem]'>
            <div className='mx-4'>
              <FontAwesomeIcon icon={faGoogle} className='text-2xl pt-1' />
            </div>
            <div className='flex-col  items-center   '>
              <div className='text-lg  font-medium'>
                Google

              </div>
              <div className='text-grey text-sm'>
                example@gmail.com
              </div>
            </div>
            <div  className='flex justify-end w-full'>
              <FontAwesomeIcon icon={faEllipsis} className='mr-4 text-blue text-xl cursor-pointer' />
            </div>
          </div>

          <div onClick={() => setIsEditOverlayOpen(!isEditOverlayOpen)} className='flex justify-center items-center border-grey border-[2px] rounded-xl h-14 w-14 text-blue text-xl hover:bg-blue hover:text-white hover:border-blue cursor-pointer'>
            <FontAwesomeIcon icon={faKey} className='' />
          </div>
          <EditOverlay isOpen={isEditOverlayOpen} onClose={() => setIsEditOverlayOpen(!isEditOverlayOpen)}>
            <>
            </>
          </EditOverlay>

        </div>
      </div>
    </div>

  )
}

export default Dashboard