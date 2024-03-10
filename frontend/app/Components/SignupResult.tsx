import React from "react";
import Celebration from "../../Public/undraw_celebrating_rtuv.svg"
import Image from "next/image";
interface SuResultProps {
    isOpen: boolean;
    onClose: () => void;
}



const SignupResult: React.FC<SuResultProps> = ({ isOpen, onClose }) => {
    

    return (
        <>
            {
                isOpen ? (
                    <div className='absolute flex justify-center items-center right-0 top-0 h-screen w-screen '>
                        <div  className='absolute bg-black opacity-50 h-screen w-screen '>

                        </div>
                        <div className=' flex-col justify-center bg-white p-5 border-grey border-[2px] rounded-xl space-y-4 z-10'>
                            <Image src={Celebration} alt="Celebration" className="scale-80" />
                            <div className="flex flex-col justify-center items-center text-xl font-semibold ">
                                <div className="text-blue">Your Account</div>
                                <div className=" ">has been registered! </div>
                            </div>
                        </div>
                    </div>
                )
                :null
        }
        </>


    )
}

export default SignupResult;