import React, { useState } from 'react';

import { Register } from './Register/Register';
import { Login } from './Login/Login';

import './style.scss';

const TABS = {
  REGISTER: 'Register',
  LOGIN: 'Login',
};

const { REGISTER, LOGIN } = TABS;

export const Authentication = () => {
  const [tab, setTab] = useState(REGISTER);

  const changeTab = tabToOpen => {
    setTab(tabToOpen);
  };

  return (
    <div className='authentication-wrapper'>
      <div className='title'>
        <h1>Welcome to the Butler!</h1>
      </div>
      <div className='authentication-tabs'>
        <p onClick={() => changeTab(REGISTER)}>{REGISTER}</p>
        <p onClick={() => changeTab(LOGIN)}>{LOGIN}</p>
      </div>
      {(() => {
        switch (tab) {
          case REGISTER:
            return <Register />;
          case LOGIN:
            return <Login />;
          default:
            return null;
        }
      })()}
    </div>
  );
};