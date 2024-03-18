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
import { GetLastSession } from '@/wailsjs/wailsjs/go/app/App';


export default function Home() {
  const [showSignup, setShowSignup] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [version, setVersion] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [userKey, setUserKey] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [tokenVerificated, setTokenVerificated] = useState(false)
  const [token, setToken] = useState('')


  async function GetToken() {
    
    try {
      
      const result = await GetLastSession();
      const data = JSON.parse(result);
      setUserName(data.username)
      setToken(data.token)
      setUserKey(data.userKey)
    
      
      if (data.token !== null && data.username !== null) {

        const resultado = await GetTokenVerification(data.username, data.token);
        if(resultado){
          setShowDashboard(true)
        }
      }
    } catch {
      console.log('Not a saved session')
    }finally{
      setIsLoading(false)
    }
  }


  useEffect(() => {
    GetToken();
  }, []);

  useEffect(() => {
    // Este código se ejecuta después de que `userKey` se haya actualizado.
    console.log(userKey);
  }, [userKey]);



  if (isLoading) {
    return <LoadingComp />;
  } else if (showDashboard ) {
    return (
      <div className='bg-blackbox h-screen'>
        {showGenerator ? (
          <Generator setShowDashboard={setShowDashboard} setShowGenerator={setShowGenerator} showGenerator={showGenerator} userName={userName} />
        ) : (
          <Dashboard setShowDashboard={setShowDashboard} setShowGenerator={setShowGenerator} showGenerator={showGenerator} userName={userName} userKey={userKey} />
        )}
      </div>

    )


  }

  return (
    <>
    {
      isLoading?
      <LoadingComp/>
      :
<div className='bg-black h-screen'>
      {showSignup ? (
        <SignupComp setIsLoading={setIsLoading} setShowSignup={setShowSignup} version={version} />
      ) : (
        <LoginComp setIsLoading={setIsLoading} setShowSignup={setShowSignup} setShowDashboard={setShowDashboard} version={version} token={''} userKey={''} setUserKey={setUserKey} setToken={setToken} setUserName={setUserName} />
      )}
    </div>
    }
    </>
    
    
  );
};