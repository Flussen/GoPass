"use client"
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faBars, faEllipsis, faMagnifyingGlass, faXmark, faArrowRightToBracket, } from '@fortawesome/free-solid-svg-icons';
import { faUser, faCopy, } from '@fortawesome/free-regular-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import EditOverlay from './EditOverlay';
import ProfileOverlay from './ProfileOverlay';
import AddOverlay from './AddOverlay';
import OptionsOverlay from "./OptionsOverlay";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons/faRotateRight";
import { PasswordGenerator } from "@/wailsjs/wailsjs/go/app/App";
import Slider, {
    SliderThumb,
    SliderValueLabelProps,
} from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";


interface GeneratorProps {
    setShowGenerator: (show: boolean) => void;


}
const PrettoSlider = styled(Slider)({
    color: "#15a7f9",
    height: 8,
    "& .MuiSlider-track": {
        border: "none",
    },
    "& .MuiSlider-thumb": {
        height: 24,
        width: 24,
        backgroundColor: "#15a7f9",
        border: "2px solid currentColor",
        "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
            boxShadow: "inherit",
        },
        "&::before": {
            display: "none",
        },
    },
    "& .MuiSlider-valueLabel": {
        lineHeight: 0,
        fontSize: 12,
        background: "unset",
        padding: 0,
        margin: 5,
        width: 28,
        height: 28,
        borderRadius: "50% 50% 50% 0",
        backgroundColor: "#15a7f9",
        transformOrigin: "bottom left",
        transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
        "&::before": { display: "none" },
        "&.MuiSlider-valueLabelOpen": {
            transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
        },
        "& > *": {
            transform: "rotate(45deg)",
        },
    },
});
const Generator: React.FC<GeneratorProps> = ({ setShowGenerator }) => {
    const [sliderValue, setSliderValue] = useState<number>(25);
    const [password, setPassword] = useState<string>("");

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setSliderValue(newValue as number);
    };
    const calculateBarWidth = (value: number) => {
        if (value < 10) {
            return '10%';
        } else if (value < 25) {
            return '50%';
        } else {
            return '100%';
        }
    };

    const [email, setEmail] = useState("example@gmail.com");
    const emailchange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setEmail(event.target.value);
    };


    const [isOptionsOverlayOpen, setIsOptionsOverlayOpen] = useState(false);
    const [isProfileOverlayOpen, setIsProfileOverlayOpen] = useState(false);

    const generatePassword = async (length: number) => {
        try {
            const response: string = await PasswordGenerator(length);
            const responseObject = JSON.parse(response);
            let password: string = responseObject.password;
           

            setPassword(String.raw`${password}`);
        } catch (error) {
            console.error("Error generating password: ", error);
        }
    };
    useEffect(() => {
        generatePassword(sliderValue);
    }, [sliderValue]);

    return (
        <div>
            <div className='flex items-start justify-between mb-20'>
                <div onClick={() => setIsOptionsOverlayOpen(!isOptionsOverlayOpen)} className='flex justify-center items-center h-14 w-14 m-5 cursor-pointer '>
                    <FontAwesomeIcon icon={faBars} className='text-xl ' />
                </div>
                <OptionsOverlay setShowGenerator={setShowGenerator} isOpen={isOptionsOverlayOpen} onClose={() => setIsOptionsOverlayOpen(!isOptionsOverlayOpen)}>
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
                    Password Generator
                </div>

            </div>
            <div className='flex justify-center '>
                <div className='flex-col    '>

                    <div className='flex justify-center items-center border-grey border-[2px]  rounded-xl h-14 w-[40rem]'>

                        <div className='flex-col ml-4  items-center   '>
                            <code>{password}</code>
                            
                        </div>
                        <div className='flex justify-end w-full'>
                            <FontAwesomeIcon icon={faCopy} className='mr-4 text-grey text-xl cursor-pointer'  />
                            <FontAwesomeIcon icon={faRotateRight} className='mr-4 text-grey  text-xl cursor-pointer' />

                        </div>
                    </div>
                    <div className="flex justify-between  mt-11 font-medium mx-5">
                        <div className="flex items-center space-x-4">
                            <div>
                                1
                            </div>


                            <div className="w-44 flex items-center">


                                <PrettoSlider
                                    valueLabelDisplay="auto"
                                    aria-label="pretto slider"
                                    defaultValue={20}
                                    color="secondary"
                                    min={1}
                                    max={50}
                                    value={sliderValue} // Usa el estado para controlar el valor
                                    onChange={handleSliderChange}
                                />

                            </div>

                            <div>
                                50
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div>Weak</div>
                            <div className="flex justify-start items-center relative">
                                <div
                                    style={{ width: calculateBarWidth(sliderValue) }}
                                    className="absolute flex justify-end items-center h-2 bg-blue rounded-full"
                                />
                                <div className="h-2 w-44 bg-blue opacity-35 rounded-full" />
                            </div>
                            <div>Strong</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Generator;