"use client"
import React, { useState, useEffect } from 'react';
import Dashboard from './Components/Dashboard';
import LoginComp from "./Components/Login";
import SignupComp from "./Components/Signup";
import { GetVersion } from '@/wailsjs/wailsjs/go/app/App';
import Generator from './Components/Generator';
import LoadingComp from './Components/Loading'
import SignupResult from './Components/SignupResult';



export default function Home() {
  const [showSignup, setShowSignup] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false); 
  const [version, setVersion] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [userKey, setUserKey] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading]= useState(false);

  

      async function fetchVersion() {
    try {
      const response = await GetVersion();
      setVersion(response);
    } catch (error) {
      console.error('Error fetching version:', error);
    }
  }

  useEffect(() => {
    fetchVersion();
  }, []);

  const handleLoginSignup = () => {
    setIsLoading(true); // Muestra el componente de carga
    // Simula una carga o espera por una operación asíncrona
    setTimeout(() => {
      setIsLoading(false); // Oculta el componente de carga
    }, 1000); // Ajusta este tiempo según sea necesario
  };


if(isLoading){
  return <LoadingComp/>;
}else if (showDashboard) {
    return ( 
      <>
      {showGenerator ? (
        <Generator setShowGenerator={setShowGenerator} showGenerator={showGenerator} userName={userName}  />
      ) : (
        <Dashboard setShowGenerator={setShowGenerator} showGenerator={showGenerator} userName={userName} userKey={userKey}/>
      )}
      </>
    
    )
        
      
  }

  return (
    <div className='bg-back h-screen'>
      {showSignup ? (
        <SignupComp setIsLoading={setIsLoading} setShowSignup={setShowSignup}  version={version}  />
      ) : (
        <LoginComp setIsLoading={setIsLoading} setShowSignup={setShowSignup} setShowDashboard={setShowDashboard} handleLoginSignup={handleLoginSignup} version={version} token={''} userKey={''} setUserKey={setUserKey} setUserName={setUserName}  />
      )}
    </div>
  );
};