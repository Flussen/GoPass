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
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';



interface GeneratorProps {
    setOptionName: (show: string) => void;
    optionName: string;
    userName: string;
    setShowDashboard: (show: boolean) => void;
    setShowProfile: (show: boolean) => void;

}
const PrettoSlider = styled(Slider)({
    color: "#00A3FF",
    height: 8,
    "& .MuiSlider-track": {
        border: "none",
    },
    "& .MuiSlider-thumb": {
        height: 24,
        width: 24,
        backgroundColor: "#00A3FF",
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
        color: "#FFFFFF",
        padding: 0,
        margin: 5,
        width: 28,
        height: 28,
        borderRadius: "20% 20% 20% 20%",
        backgroundColor: "#00A3FF",
        transformOrigin: "bottom left",
        transform: "translate(50%, -100%)  scale(0)",
        "&::before": { display: "none" },
        "&.MuiSlider-valueLabelOpen": {
            transform: "translate(0%, -120%)  scale(1)",
        },
        "& > *": {
            transform: "",
        },
    },
});
const Generator: React.FC<GeneratorProps> = ({ setShowProfile, setShowDashboard, setOptionName, optionName, userName }) => {
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [barColor1, setBarColor1] = useState('bg-black');
    const [barColor2, setBarColor2] = useState('bg-black');
    const [barColor3, setBarColor3] = useState('bg-black');
    const [barColor4, setBarColor4] = useState('bg-black');

    const [titlee, setTitlee] = useState('')
    const titlesearch = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setTitlee(event.target.value);
    };
    const [sliderValue, setSliderValue] = useState<number>(25);
    const [password, setPassword] = useState<string>("");
    const calculateBarWidth = (value: number) => {
        setBarColor1(value > 1 ? 'bg-primary' : 'bg-gray');
        setBarColor2(value > 5 ? 'bg-primary' : 'bg-gray');
        setBarColor3(value > 10 ? 'bg-primary' : 'bg-gray');
        setBarColor4(value > 25 ? 'bg-primary' : 'bg-gray');
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

        <div id="Generator" className='flex justify-between  h-screen '>

            <OptionsOverlay
                setOptionName={setOptionName}
                optionName={optionName}
                userName={userName}
                setShowDashboard={setShowDashboard}
                setShowProfile={setShowProfile}      >
                <></>
            </OptionsOverlay>
            <div className="flex flex-col justify-start items-start  w-[84%] ml-[16%] p-12 h-full">
                <div id="HEADER" className="flex justify-end w-full rounded-lg text-base mb-16 ">
                    
                    <div className="flex items-center space-x-6 h-12">
                        <div className="flex items-center">
                            <div className="flex absolute justify-center items-center h-12 w-12 bg-primary rounded-full font-semibold space-x-2">

                                <DarkModeRoundedIcon sx={{ fontSize: 24 }} />
                            </div>
                            <div className="flex justify-end items-center pr-2 h-11 w-24 border-2 border-gray rounded-full text-whitebg ">
                                <WbSunnyRoundedIcon sx={{ fontSize: 24 }} />
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex absolute justify-center items-center h-12 w-12 bg-primary rounded-full font-semibold space-x-2">

                                <AccountCircleRoundedIcon sx={{ fontSize: 36 }} />
                            </div>
                            <div className="h-11 w-48 border-2 rounded-full border-gray text-white flex justify-between items-center text-base pl-14 pr-3">
                                <div>
                                    BustaLover
                                </div>
                                <ExpandMoreRoundedIcon sx={{ fontSize: 24 }} />

                            </div>
                        </div>

                    </div>
                </div>
                <div className="flex-col justify-center w-full items-start">
                    <div className='flex justify-start mb-10'>
                        <div className='text-4xl font-bold text-whitebg'>
                            Password <span className="bg-primary bg-clip-text text-transparent">Generator</span>
                        </div>

                    </div>
                    <div className='xl:flex max-xl:flex-col w-full xl:space-x-5 max-xl:space-y-5'>
                        <div className="flex-col items-start justify-center bg-darkgray rounded-lg  xl:basis-4/5 basis-3/4 p-3">
                            <div className="flex items-start w-full space-x-3 ">
                                <div className='flex-col justify-center items-center xl:basis-5/6 w-full '>
                                    <div className="flex justify-between items-center mb-3 px-4 bg-black rounded-lg  w-full">
                                        <input type="text" readOnly value={password} className="select-all w-full text-whitebg flex justify-center items-center bg-transparent  focus:outline-none h-12  " />
                                        <div
                                            onClick={() => generatePassword(sliderValue)}
                                            className='ml-4 text-whitegray cursor-pointer hover:text-primary'
                                        >
                                            <AutorenewRoundedIcon sx={{ fontSize: 28 }} className="" />
                                        </div>
                                    </div>

                                    <div className="flex-col items-center px-3">

                                        <div className="flex justify-start items-center w-full space-x-2">
                                            <div className={`${barColor1} h-2 basis-1/4 rounded-full`} />
                                            <div className={`${barColor2} h-2 basis-1/4 rounded-full`} />
                                            <div className={`${barColor3} h-2 basis-1/4 rounded-full`} />
                                            <div className={`${barColor4} h-2 basis-1/4 rounded-full`} />
                                        </div>
                                        <div className="flex justify-between items-center text-whitegray  ">
                                            <div>Weak</div>
                                            <div>Strong</div>
                                        </div>
                                        {/* <div className="w-full">
                                            <div className={`flex w-full text-frey ${sliderValue < 10 ? 'b' : sliderValue < 15 ? 'ml-[45%]' : sliderValue < 25 ? 'ml-[70%]' : 'ml-[95%]'}`}>
                                                {sliderValue < 10 ? 'Weak' : sliderValue < 15 ? 'Medium' : sliderValue < 25 ? 'Strong' : 'Very Strong'

                                                }
                                            </div>
                                        </div> */}


                                    </div>
                                    <div className="flex items-center space-x-4 w-full px-3 mt-5 text-grey">
                                        <div className="font-semibold text-2xl basis-1/4 text-whitebg">
                                            Password Length
                                        </div>
                                        <div className="flex space-x-4 items-center basis-3/4 text-primary">
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
                                                    max={50}
                                                    value={sliderValue}
                                                    onChange={handleSliderChange}
                                                />

                                            </div>

                                            <div>
                                                50
                                            </div>
                                        </div>

                                    </div>

                                </div>
                                <div onClick={copyToClipboard} className="flex justify-center items-center  xl:basis-1/6 basis-1/4 bg-primary rounded-lg text-darkgray text-xl font-semibold   cursor-pointer  ">
                                    <div className="flex items-center justify-center w-full rounded-md space-x-2 bg-blackbox h-12  ">
                                        <ContentCopyRoundedIcon sx={{ fontSize: 28 }} />
                                        <div>
                                            Copy
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div className="flex justify-center mt-10 font-semibold ">

                            </div>


                        </div>
                        <div className="flex items-center justify-center bg-darkgray rounded-lg  lg:basis-1/5 ">
                            <div className="xl:flex-col max-xl:flex justify-start items-center font-semibold text-2xl text-whitebg max-xl:space-x-6 max-xl:py-10">
                                <div className="flex items-center space-x-3 ">
                                    <input checked={includeUppercase}

                                        onChange={() => handleCheckboxChange(setIncludeUppercase, includeUppercase)} type="checkbox" className=" accent-primary  scale-150 " />
                                    <div>
                                        Uppercase
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input checked={includeLowercase}
                                        onChange={() => handleCheckboxChange(setIncludeLowercase, includeLowercase)} type="checkbox" className="accent-primary  scale-150 " />
                                    <div>
                                        Lowercase
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input checked={includeNumbers}
                                        onChange={() => handleCheckboxChange(setIncludeNumbers, includeNumbers)} type="checkbox" className="accent-primary  scale-150" />
                                    <div>
                                        Numbers
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input
                                        checked={includeSymbols}
                                        onChange={() => handleCheckboxChange(setIncludeSymbols, includeSymbols)}
                                        type="checkbox"
                                        className="accent-primary  scale-150" />
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