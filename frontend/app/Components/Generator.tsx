"use client"
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCopy, } from '@fortawesome/free-regular-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

import OptionsOverlay from "./OptionsOverlay";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons/faRotateRight";
import Slider, {
    SliderThumb,
    SliderValueLabelProps,
} from "@mui/material/Slider";
import { styled } from "@mui/material/styles";

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import FormatLineSpacingRoundedIcon from '@mui/icons-material/FormatLineSpacingRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
interface GeneratorProps {
    setShowGenerator: (show: boolean) => void;
    showGenerator: boolean

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
const Generator: React.FC<GeneratorProps> = ({ setShowGenerator, showGenerator }) => {
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [barColor1, setBarColor1] = useState('bg-black');
    const [barColor2, setBarColor2] = useState('bg-black');
    const [barColor3, setBarColor3] = useState('bg-black');
    const [barColor4, setBarColor4] = useState('bg-black');


    const [sliderValue, setSliderValue] = useState<number>(25);
    const [password, setPassword] = useState<string>("");
    const calculateBarWidth = (value: number) => {
        setBarColor1(value > 1 ? 'bg-blue' : 'bg-lightgrey');
        setBarColor2(value > 5 ? 'bg-blue' : 'bg-lightgrey');
        setBarColor3(value > 10 ? 'bg-blue' : 'bg-lightgrey');
        setBarColor4(value > 25 ? 'bg-blue' : 'bg-lightgrey');
    };

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setSliderValue(newValue as number);
    };


    const handleCheckboxChange = (stateSetter: { (value: React.SetStateAction<boolean>): void; (arg0: boolean): void; }, currentValue: boolean) => {
        // Contar cuántos checkboxes están actualmente seleccionados
        const totalSelected = [includeUppercase, includeLowercase, includeNumbers, includeSymbols].filter(Boolean).length;

        // Si el checkbox actual está seleccionado (y es el último seleccionado), evitar que se deseleccione
        if (!currentValue || totalSelected > 1) {
            stateSetter(!currentValue);
        }

    };


    const generatePassword = (length: number): void => {
        let charset = '';
        if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (includeNumbers) charset += '0123456789';
        if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        let newPassword = '';
        for (let i = 0, n = charset.length; i < length; ++i) {
            newPassword += charset.charAt(Math.floor(Math.random() * n));
        }
        setPassword(newPassword);
        calculateBarWidth(newPassword.length);
    };
    const copyToClipboard = () => {
        if (password === '') {
            return;
        }
        navigator.clipboard.writeText(password).then(() => {
        }, (err) => {
            console.error('Error al copiar la contraseña: ', err);
        });
    };

    useEffect(() => {
        generatePassword(sliderValue);
    }, [includeUppercase, includeLowercase, includeNumbers, includeSymbols, sliderValue]);

    return (

        <div id="Generator" className='flex justify-between bg-back'>

            <OptionsOverlay
                setShowGenerator={setShowGenerator}
                showGenerator={showGenerator}
            >
                <></>
            </OptionsOverlay>
            <div className="flex flex-col justify-start items-center basis-4/5 px-16 pt-16 space-y-24">
                <div id="HEADER" className="flex justify-between w-full rounded-2xl bg-box h-20 px-3 shadow-shadow text-xl">
                    <div className='flex items-center '>
                        <SearchRoundedIcon sx={{ fontSize: 28 }} className='absolute ml-4 text-grey ' />
                        <input type="text" className='flex rounded-xl border-grey border-[2px] pl-12 w-[34rem] h-14 py-2 bg-transparent font-semibold focus:outline-none placeholder-lightgrey' placeholder='Buscar' />
                    </div>
                    <div className="flex items-center space-x-5">
                        <div className="flex justify-center items-center h-14 px-3 border-2 border-lightgrey rounded-xl text-grey font-semibold space-x-2">
                            <div>
                                Filter
                            </div>
                            <FilterAltRoundedIcon />

                        </div>
                        <div className="flex justify-center items-center h-14 px-3 border-2 border-lightgrey rounded-xl text-grey font-semibold space-x-2">
                            <div>
                                Sort
                            </div>
                            <FormatLineSpacingRoundedIcon sx={{ fontSize: 28 }} />
                        </div>
                    </div>
                </div>
                <div className="flex-col justify-center w-full items-start">
                    <div className='flex justify-start mb-10'>
                        <div className='text-5xl font-bold text-bkblue'>
                            Password Generator
                        </div>

                    </div>
                    <div className='flex w-full space-x-5'>
                        <div className="flex-col items-start justify-center bg-box rounded-2xl basis-4/5 p-3">
                            <div className="flex items-start w-full space-x-3 ">
                                <div className='flex-col justify-center items-center basis-5/6 '>
                                    <div className="flex justify-between items-center mb-3 px-4 border-grey border-[2px] rounded-xl h-14 w-full">
                                        <input type="text" readOnly value={password} className="select-all w-full flex justify-center items-center bg-transparent  focus:outline-none  " />
                                        <div
                                            onClick={() => generatePassword(sliderValue)}
                                            className='ml-4 text-grey cursor-pointer hover:text-blue'
                                        >
                                            <AutorenewRoundedIcon sx={{ fontSize: 28 }} />
                                        </div>
                                    </div>

                                    <div className="flex-col items-center px-3">

                                        <div className="flex justify-start items-center w-full space-x-2">
                                            <div className={`${barColor1} h-2 basis-1/4 rounded-full`} />
                                            <div className={`${barColor2} h-2 basis-1/4 rounded-full`} />
                                            <div className={`${barColor3} h-2 basis-1/4 rounded-full`} />
                                            <div className={`${barColor4} h-2 basis-1/4 rounded-full`} />
                                        </div>
                                        <div className="flex justify-between items-center text-grey  ">
                                            <div>Weak</div>
                                            <div>Strong</div>
                                        </div>

                                    </div>
                                    <div className="flex items-center space-x-4 w-full px-3 mt-5 text-grey">
                                        <div className="font-semibold text-2xl basis-1/4 text-bkblue">
                                            Password Length
                                        </div>
                                        <div className="flex space-x-4 items-center basis-3/4">
                                            <div>
                                                1
                                            </div>


                                            <div className="w-full flex items-center">


                                                <PrettoSlider
                                                    valueLabelDisplay="auto"
                                                    aria-label="pretto slider"
                                                    defaultValue={20}
                                                    color="secondary"
                                                    min={1}
                                                    max={70}
                                                    value={sliderValue}
                                                    onChange={handleSliderChange}
                                                />

                                            </div>

                                            <div>
                                                70
                                            </div>
                                        </div>

                                    </div>

                                </div>
                                <div onClick={copyToClipboard} className="flex justify-center items-center h-14 basis-1/6 bg-blue rounded-xl text-back text-xl font-semibold space-x-3 cursor-pointer ">
                                    <ContentCopyRoundedIcon sx={{ fontSize: 28 }} />
                                    <div>
                                        Copy
                                    </div>
                                </div>

                            </div>

                            <div className="flex justify-center mt-10 font-semibold ">

                            </div>


                        </div>
                        <div className="flex items-center justify-center bg-box rounded-2xl  basis-1/5">
                            <div className="flex-col justify-start items-center font-semibold text-2xl text-bkblue">
                                <div className="flex items-center space-x-3 ">
                                    <input checked={includeUppercase}

                                        onChange={() => handleCheckboxChange(setIncludeUppercase, includeUppercase)} type="checkbox" className=" accent-blue focus:accent-blue scale-150 " />
                                    <div>
                                        Uppercase
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input checked={includeLowercase}
                                        onChange={() => handleCheckboxChange(setIncludeLowercase, includeLowercase)} type="checkbox" className="accent-blue focus:accent-blue scale-150 " />
                                    <div>
                                        Lowercase
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input checked={includeNumbers}
                                        onChange={() => handleCheckboxChange(setIncludeNumbers, includeNumbers)} type="checkbox" className="accent-blue focus:accent-blue scale-150 " />
                                    <div>
                                        Numbers
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input
                                        checked={includeSymbols}
                                        onChange={() => handleCheckboxChange(setIncludeSymbols, includeSymbols)}
                                        type="checkbox"
                                        className="accent-blue focus:accent-blue scale-150" />
                                    <div>
                                        Symbols
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

            </div>


        </div>



    )
}


export default Generator;