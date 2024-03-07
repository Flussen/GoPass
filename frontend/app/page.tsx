"use client"
import React, { useState, useEffect } from 'react';
import Dashboard from './Components/Dashboard';
import LoginComp from "./Components/Login";
import SignupComp from "./Components/Signup";
import { GetVersion } from '@/wailsjs/wailsjs/go/app/App';
import Generator from './Components/Generator';


export default function Home() {
  const [showSignup, setShowSignup] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false); 
  const [version, setVersion] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [userKey, setUserKey] = useState('');
  const [userName, setUserName] = useState('');

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
    setShowDashboard(true); 
  };

  if (showDashboard) {
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
        <SignupComp setShowSignup={setShowSignup} handleLoginSignup={handleLoginSignup} version={version}  />
      ) : (
        <LoginComp setShowSignup={setShowSignup} handleLoginSignup={handleLoginSignup} version={version} token={''} userKey={''} setUserKey={setUserKey} setUserName={setUserName} />
      )}
    </div>
  );
};