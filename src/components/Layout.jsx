import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <div className='bg-bgLight'>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};