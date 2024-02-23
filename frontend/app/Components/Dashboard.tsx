"use client"

import React, { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons/faEllipsis';
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons/faArrowRightToBracket';



const Dashboard = () => {
    const [showPass, setShowPass] = useState(false);
    const [email, setEmail] = useState("example@gmail.com");
    const emailchange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setEmail(event.target.value);
      };
    return (
        <div>
        <div className='flex  justify-between mb-20'>
          <div className='flex justify-center items-center h-14 w-14 m-5 cursor-pointer '>
            <FontAwesomeIcon icon={faBars} className='text-xl' />
          </div>
          <div className='flex items-center'>
            <FontAwesomeIcon icon={faMagnifyingGlass} className='absolute ml-4 ' />
            <input type="text" className='flex rounded-full border-grey border-[2px] pl-10 w-[34rem] py-2' placeholder='Buscar' />
          </div>
          <div className='flex justify-center items-center rounded-full border-grey border-[2px]  py-2 w-14 m-5 cursor-pointer '>
            <FontAwesomeIcon icon={faUser} className='text-xl' />
          </div>
  
  
        </div>
  
        <div className='flex justify-center space-x-72 mb-10'>
          <div className='font-bold text-2xl'>
            My Passwords
          </div>
          <div className='border-blue border-[2px] rounded-full w-fit px-5 py-2 font-semibold hover:bg-blue hover:text-white cursor-pointer'>
            Add new
          </div>
        </div>
        <div className='flex justify-center'>
  
  
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
              <div className='flex justify-end w-full'>
                <FontAwesomeIcon icon={faEllipsis} className='mr-4 text-blue text-xl cursor-pointer' />
              </div>
            </div>
            {
              showPass ? (
                <>
                  <div className='absolute flex justify-center items-center right-0 top-0 h-screen w-screen bg-[rgba(3,3,3,0.8)]'>
                    <div className=' flex-col justify-center bg-white p-5 border-grey border-[2px] rounded-xl space-y-4 '>
                      <div className='flex justify-between items-center'>
  
                        <div className='text-2xl font-semibold'>
                          Credentials
                        </div>
                        <div onClick={() => setShowPass(false)} className='relative flex text-xl justify-end cursor-pointer '>
                          <FontAwesomeIcon icon={faXmark} />
                        </div>
                      </div>
                      <div>
                        <div className='pl-4 font-medium'>
                          Title
                        </div>
                        <div className='flex justify-between '>
  
  
                          <input type="text" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='Title' value="Google" />
  
                          <div className='a flex items-center  pt-2.5 p-3'>
                            <FontAwesomeIcon icon={faCopy} className='text-xl text-grey cursor-pointer ' />
                          </div>
  
                        </div>
                        <div className='pl-4 font-medium'>
                          Login
                        </div>
                        <div className='flex justify-between '>
  
  
                          <input type="text" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='Username or Email' value={email} onChange={emailchange} />
  
                          <div className='a flex items-center  pt-2.5 p-3'>
                            <FontAwesomeIcon icon={faCopy} className='text-xl text-grey cursor-pointer ' />
                          </div>
  
                        </div>
                        <div className='pl-4 font-medium'>
                          Password
                        </div>
                        <div className='flex justify-between '>
  
  
                          <input type="password" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='Password' value="elcarrodemessi"  />
  
                          <div className='a flex items-center  pt-2.5 p-3'>
                            <FontAwesomeIcon icon={faCopy} className='text-xl text-grey cursor-pointer ' />
                          </div>
  
                        </div>
                      
                        <div className='pl-4 font-medium'>
                          Site
                        </div>
                        <div className='flex justify-between pb-7'>
  
  
                          <input type="URL" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='URL' value="www.google.com"  />
  
                          <div className='a flex items-center  pt-2.5 p-3'>
                            <FontAwesomeIcon icon={faArrowRightToBracket} className='text-xl text-grey cursor-pointer ' />
                          </div>
  
                        </div>
                        <div className="flex justify-center space-x-10">
                            <div className="flex justify-center items-center w-40 h-10 border-red border-[2px] rounded-full cursor-pointer hover:bg-red hover:text-white font-semibold">
                                Delete
                            </div>
                            <div className="flex justify-center items-center w-40 h-10 border-blue border-[2px] rounded-full cursor-pointer hover:bg-blue hover:text-white font-semibold">
                                Update
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
  
                </>
              ) : (
                <>
  
                  <div onClick={() => setShowPass(true)} className='flex justify-center items-center border-grey border-[2px] rounded-xl h-14 w-14 text-blue text-xl hover:bg-blue hover:text-white hover:border-blue cursor-pointer'>
                    <FontAwesomeIcon icon={faKey} className='' />
                  </div>
                </>
              )
  
            }
  
          </div>
        </div>
      </div>
  
    )
}

export default Dashboard