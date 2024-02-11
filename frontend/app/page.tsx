"use client"
import React, { useState, useEffect } from 'react';
import { Greet } from '@/wailsjs/go/main/App';
import { Login } from '@/wailsjs/wailsjs/go/main/App';
import { GetVersion } from '@/wailsjs/wailsjs/go/main/App';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons/faEllipsis';
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy';



export default function Home() {
  const [showSignup, setShowSignup] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [version, setVersion] = useState('');

  async function fetchVersion() {
    try {
      const response = await GetVersion();
      setVersion(response);
    } catch (error) {
      console.error('Error fetching version:', error);
    }
  }

  fetchVersion();


  return (
    // <div>
    //   {
    //     showSignup ? (
    //       <>
    //         <div className='flex flex-col items-center justify-center h-screen space-y-2' id='login'>
    //           <h1 className='w-full flex justify-center text-3xl font-semibold mb-8'>SIGN UP</h1>
    //           <input className='rounded-xl h-10 pl-4 border-grey border-[1px] text-black w-96  bg-transparent' type="text" placeholder='Username' />
    //           <input className='rounded-xl h-10 pl-4 border-grey border-[1px] text-black w-96  bg-transparent' type="text" placeholder='Correo' />

    //           <input className='rounded-xl h-10 pl-4 border-grey border-[1px] text-black w-96 bg-transparent' type="password" placeholder='Password' />

    //           <button className='rounded-xl h-10 pl-4 text-white w-96 bg-black h' type="submit" >
    //             Sign Up
    //           </button>


    //           <div className='flex-col  items-center justify-center mt-[-310px]'>
    //             <div className='text-black flex justify-center items-center opacity-80 '>
    //               Have you an account?  <a className='hover:text-blue' href="#signup" onClick={() => setShowSignup(false)}> &nbsp;Login</a>
    //             </div>
    //             <h3 className='flex justify-center items-center opacity-50 text-xs select-none'>
    //             {version}
    //             </h3>
    //           </div>

    //         </div>


    //       </>
    //     ) : (
    //       <>
    //         <div className='flex flex-col items-center justify-center h-screen space-y-2' id='login'>
    //           <h1 className='w-full flex justify-center text-3xl font-semibold mb-8'>LOGIN</h1>

    //           <input className='rounded-xl h-10 pl-4 border-grey border-[1px] text-black w-96 bg-transparent' type="text" placeholder='Username' />

    //           <input className='rounded-xl h-10 pl-4 border-grey border-[1px] text-black w-96  bg-transparent' type="password" placeholder='Password' />

    //           <button className='rounded-xl h-10 pl-4 text-white w-96 bg-black' type="submit" >
    //             Login
    //           </button>


    //           <div className='flex-col  items-center justify-center mt-[-310px]'>
    //             <div className='text-black flex justify-center items-center opacity-80  '>
    //               Have you an account?  <a className='hover:text-blue' href="#signup" onClick={() => setShowSignup(true)}> &nbsp;Register</a>
    //             </div>
    //             <h3 className='flex justify-center items-center opacity-50 text-xs select-none'>
    //             {version}
    //             </h3>
    //           </div>

    //         </div>


    //       </>
    //     )
    //   }
    // </div>


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
                correoejemplo@gmail.com

              </div>
              <div className='text-grey text-sm'>
                www.google.com
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


                        <input type="text" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='Title' />

                        <div className='a flex items-center  pt-2.5 p-3'>
                          <FontAwesomeIcon icon={faCopy} className='text-xl text-grey cursor-pointer ' />
                        </div>

                      </div>
                      <div className='pl-4 font-medium'>
                        Login
                      </div>
                      <div className='flex justify-between '>


                        <input type="text" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='Username or Email' />

                        <div className='a flex items-center  pt-2.5 p-3'>
                          <FontAwesomeIcon icon={faCopy} className='text-xl text-grey cursor-pointer ' />
                        </div>

                      </div>
                      <div className='pl-4 font-medium'>
                        Password
                      </div>
                      <div className='flex justify-between '>


                        <input type="password" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='Password' />

                        <div className='a flex items-center  pt-2.5 p-3'>
                          <FontAwesomeIcon icon={faCopy} className='text-xl text-grey cursor-pointer ' />
                        </div>

                      </div>
                      <div>
                        <div className='flex justify-center'>
                          <div className='flex justify-start'>
                            <div className='absolute  rounded-full h-1 w-[25rem] bg-blue'></div>
                          </div>
                          <div className=' rounded-full h-1 w-[31rem] bg-grey'>
                          </div>
                        </div>
                        <div className='pl-3 text-sm'>
                          Strong
                        </div>
                      </div>
                      <div className='pl-4 font-medium'>
                        Password
                      </div>
                      <div className='flex justify-between '>


                        <input type="password" className=' rounded-xl  pl-4 py-2 w-[30rem] outline-none' placeholder='Password' />

                        <div className='a flex items-center  pt-2.5 p-3'>
                          <FontAwesomeIcon icon={faCopy} className='text-xl text-grey cursor-pointer ' />
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


  );

}