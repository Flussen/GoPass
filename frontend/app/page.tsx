"use client"
import React, { useState, useEffect, use } from 'react';
import Dashboard from './Components/Passwords/Dashboard';
import LoginComp from "./Components/Login and Signup/Login";
import SignupComp from "./Components/Signup";
import { GetVersion } from '@/wailsjs/wailsjs/go/app/App';
import Generator from './Components/Generator';
import LoadingComp from './Components/Loading'
import SignupResult from './Components/Login and Signup/RegisResult';
import { VerifyToken } from '@/wailsjs/wailsjs/go/app/App';
import { GetLastSession } from '@/wailsjs/wailsjs/go/app/App';
import ProfileSection from "./Components/Settings/ProfileSection"
import GroupsComp from "./Components/Groups/GroupsPage"
import CardsComp from "./Components/Cards/CardsPage"
import { request, response, models } from '@/wailsjs/wailsjs/go/models';


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
  const [showProfile, setShowProfile] = useState(false);
  const [optionName, setOptionName] = useState('')

  const [lastSession, setLastSession] = useState<models.LastSession[]>([]);


  async function GetToken() {

    try {
      setVersion(await GetVersion())
      const response = await GetLastSession();
      console.log('Last sesion'+response)
      setUserKey(response.userKey)

      setUserName(response.username)
      setToken(response.token)

      if (response.token !== null && response.username !== null) {

        const resultado = await VerifyToken(response.token);
        if (resultado) {
          setShowDashboard(true)
        }
      }
    } catch (error) {
      console.log('Not a saved session' + error)
    } finally {
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

  } else if (showProfile) {
    return (
      <ProfileSection setShowProfile={setShowProfile} setIsLoading={setIsLoading} userName={userName} />
    )
  } else if (showDashboard) {
    return (
      <div className='h-screen'>

        {
          optionName == 'Generator' ?
            (<Generator setShowProfile={setShowProfile} setShowDashboard={setShowDashboard} setOptionName={setOptionName} optionName={optionName} userName={userName} />) :
            optionName == 'Groups' ?
              (<GroupsComp showDashboard={showDashboard} setShowProfile={setShowProfile} setShowDashboard={setShowDashboard} setOptionName={setOptionName} optionName={optionName} userName={userName} userKey={userKey} />) :
              optionName == 'Cards' ?
                (<CardsComp showDashboard={showDashboard} setShowProfile={setShowProfile} setShowDashboard={setShowDashboard} setOptionName={setOptionName} optionName={optionName} userName={userName} userKey={userKey} />)
                :
                (<Dashboard showDashboard={showDashboard} setShowProfile={setShowProfile} setShowDashboard={setShowDashboard} setOptionName={setOptionName} optionName={optionName} userName={userName} userKey={userKey} />)

        }



      </div>
    )
  }

  return (
    <>
      {
        isLoading ?
          <LoadingComp />
          :
          <div className=' h-screen'>
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