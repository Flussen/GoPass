"use client"
import React, { useState, useEffect, use } from 'react';
import Dashboard from './Components/Dashboard';
import LoginComp from "./Components/Login";
import SignupComp from "./Components/Signup";
import { GetVersion } from '@/wailsjs/wailsjs/go/app/App';
import Generator from './Components/Generator';
import LoadingComp from './Components/Loading'
import SignupResult from './Components/SignupResult';
import { GetTokenVerification } from '@/wailsjs/wailsjs/go/app/App';



export default function Home() {
  const [showSignup, setShowSignup] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [version, setVersion] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [userKey, setUserKey] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenVerificated, setTokenVerificated] = useState(false)
  const [token, setToken] = useState('')

  async function fetchVersion() {
    try {
      const response = await GetVersion();
      setVersion(response);
      console.log('Token: ' +token)
    } catch (error) {
      console.error('Error fetching version:', error);
    }
  }

async function VerifyToken(){
  try{
    const result = await GetTokenVerification(userName, token)
    console.log('Verified: '+result)
    setTokenVerificated(result)
    if(result){
      setShowDashboard(true)
    }
  }catch{
console.log('verified error')
  }
}

  useEffect(() => {
    fetchVersion();
    VerifyToken();
  }, []);

  const handleLoginSignup = () => {
    setIsLoading(true); // Muestra el componente de carga
    // Simula una carga o espera por una operación asíncrona
    setTimeout(() => {
      setIsLoading(false); // Oculta el componente de carga
    }, 1000); // Ajusta este tiempo según sea necesario
  };

 

  if (isLoading) {
    return <LoadingComp />;
  } else if (showDashboard||tokenVerificated ) {
    return (
      <>
        {showGenerator ? (
          <Generator setShowGenerator={setShowGenerator} showGenerator={showGenerator} userName={userName} />
        ) : (
          <Dashboard setShowGenerator={setShowGenerator} showGenerator={showGenerator} userName={userName} userKey={userKey} />
        )}
      </>

    )


  }

  return (
    <div className='bg-back h-screen'>
      {showSignup ? (
        <SignupComp setIsLoading={setIsLoading} setShowSignup={setShowSignup} version={version} />
      ) : (
        <LoginComp setIsLoading={setIsLoading} setShowSignup={setShowSignup} setShowDashboard={setShowDashboard} handleLoginSignup={handleLoginSignup} version={version} token={''} userKey={''} setUserKey={setUserKey} setToken={setToken} setUserName={setUserName} />
      )}
    </div>
  );
};