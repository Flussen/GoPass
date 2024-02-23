"use client"
import React, { useState, useEffect } from 'react';
import Dashboard from './Components/Dashboard';
import LoginComp from "./Components/Login";
import SignupComp from "./Components/Signup";
import { GetVersion } from '@/wailsjs/wailsjs/go/main/App';

export default function Home() {
  const [showSignup, setShowSignup] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false); 
  const [version, setVersion] = useState('');

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
    return <Dashboard />;
  }

  return (
    <div>
      {showSignup ? (
        <SignupComp setShowSignup={setShowSignup} handleLoginSignup={handleLoginSignup} version={version} />
      ) : (
        <LoginComp setShowSignup={setShowSignup} handleLoginSignup={handleLoginSignup} version={version} />
      )}
    </div>
  );
};