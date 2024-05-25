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
import SettingsPage from "./Components/Settings/SettingsPage"
import GroupsComp from "./Components/Groups/GroupsPage"
import CardsComp from "./Components/Cards/CardsPage"
import { request, response, models } from '@/wailsjs/wailsjs/go/models';
import { GetAccountInfo } from '@/wailsjs/wailsjs/go/app/App';

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
  const [theme, setTheme] = useState('dark')

  

  async function GetToken() {

    try {
      setVersion(await GetVersion())
      const response = await GetLastSession();
      console.log('Last sesion' + response)
      setUserKey(response.userKey)

      setUserName(response.username)
      setToken(response.token)
      console.log('Username: ' + response.username)
      if (response.token !== null && response.username !== null) {

        const resultado = await VerifyToken(response.token);
        if (resultado) {
          console.log('dentro del if' + response.username)

          setShowDashboard(true)


        }
      }
    
    } catch (error) {
      console.log('Not a saved session' + error)
    } finally {
      setIsLoading(false)
    }
  }
  async function ChangeTheme() {
    if (userName) { 
      try {
        const response = await GetAccountInfo(userName);
        setTheme(response.config.ui);
      } catch (e) {
        console.log(e);
      }finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    GetToken()
  }, [])
 

  useEffect(() => {
    ChangeTheme();
  }, [userName]); 
  
  



  if (isLoading) {
    return <LoadingComp />;

  } else if (showProfile) {
    return (
      <SettingsPage setShowProfile={setShowProfile} setIsLoading={setIsLoading} userName={userName} setTheme={setTheme} theme={theme} />
    )
  } else if (showDashboard) {
    return (
      <div className='h-screen dark:bg-black bg-whitebg'>

        {
          optionName == 'Generator' ?
            (<Generator setShowProfile={setShowProfile} setShowDashboard={setShowDashboard} setOptionName={setOptionName} optionName={optionName} userName={userName} setTheme={setTheme} theme={theme} />) :
            optionName == 'Groups' ?
              (<GroupsComp showDashboard={showDashboard} setShowProfile={setShowProfile} setShowDashboard={setShowDashboard} setOptionName={setOptionName} optionName={optionName} userName={userName} userKey={userKey} setTheme={setTheme} theme={theme} />) :
              optionName == 'Cards' ?
                (<CardsComp showDashboard={showDashboard} setShowProfile={setShowProfile} setShowDashboard={setShowDashboard} setOptionName={setOptionName} optionName={optionName} userName={userName} userKey={userKey} setTheme={setTheme} theme={theme} />)
                :
                (<Dashboard showDashboard={showDashboard} setShowProfile={setShowProfile} setShowDashboard={setShowDashboard} setOptionName={setOptionName} optionName={optionName} userName={userName} userKey={userKey} setTheme={setTheme} theme={theme} />)

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
          <div className=' h-screen dark:bg-black bg-whitebg'>
            {showSignup ? (
              <SignupComp setIsLoading={setIsLoading} setShowSignup={setShowSignup} version={version} />
            ) : (
              <LoginComp setIsLoading={setIsLoading} setShowSignup={setShowSignup} setShowDashboard={setShowDashboard} version={version} token={''} userKey={''} setUserKey={setUserKey} setToken={setToken} setUserName={setUserName} setTheme={setTheme} theme={theme} />
            )}
          </div>
      }
    </>


  );
};