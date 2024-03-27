import React from "react";
import Celebration from "../../Public/undraw_celebrating_rtuv.svg"
import Image from "next/image";
import foursquare from  "../../Public/foursquare.svg"
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
                        
                    </div>
                )
                :null
        }
        </>


    )
}

export default SignupResult;