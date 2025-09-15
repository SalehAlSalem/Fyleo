import React from 'react'
import classNames from 'classnames';
import { Link } from "react-router-dom";
import DarkMode from '../DarkMode';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '../../../Firebase/ClientApp.mjs';

const NavBar = () => {
  const [user, loading, error] = useAuthState(auth);
  const [signout, loadingg, erorr] = useSignOut(auth);
  return (
    <div className={classNames({
      'w-screen h-fit': true,
      'fixed top-2 z-[10000] ': true,
      'flex justify-center items-center': true,
    })}>
      <div className={classNames({
        'w-[97.5vw] h-fit': true,
        'px-10 py-2': true,
        'flex items-center justify-center': true,
        'rounded-2xl shadow-md bg-[#F4F4F5]': true,
        'dark:bg-[#44403C] dark:!text-white': true,
        'mobile:px-2': true,
      })}>
        {/* Logo... */}
        <div className={classNames({
          'w-1/4 h-fit p-2': true,
          'flex items-center justify-start': true,
          'monu font-normal text-xl text-[#37474f]': true,
          'dark:text-white': true,
          'mobile:text-lg': true,
        })}>
          <Link to='/' className="flex items-center">
            {/* Logo image - place the provided PNG at /public/fyleo-logo.png */}
            <img src="/fyleo-logo.png" alt="Fyleo" className="h-10 w-auto mr-3 object-contain" onError={(e)=>{e.currentTarget.style.display='none'}} />
            <span className="inline">Fyleo</span>
          </Link>
        </div>

        {/* NavItems... */}
        <div className={classNames({
          'w-3/4 h-fit': true,
          'flex items-center justify-end gap-4': true,
          'mobile:gap-2': true,
        })}>
          {!user && (
            <>
              <Link to='/login' className="theme-btn-shadow rounded-xl bg-[#3B82F6] px-4 py-2 monu text-sm text-white font-normal mobile:text-xs">Login</Link>
              <Link to='/signup' className="theme-btn-shadow rounded-xl bg-[#3B82F6] px-4 py-2 monu text-sm text-white font-normal mobile:text-xs">Sign Up</Link>
            </>
          )}

          {user && (
            <>
              <Link to='/Dashboard' className="px-4 py-2 monu text-sm text-gray-800">{user.displayName || user.email}</Link>
              <Link to='/Dashboard/upload' className="theme-btn-shadow rounded-xl bg-[#10B981] px-4 py-2 monu text-sm text-white">Upload</Link>
              <button onClick={() => signout()} className="theme-btn-shadow rounded-xl bg-[#3B82F6] px-4 py-2 monu text-sm text-white">Logout</button>
            </>
          )}
          <DarkMode />
        </div>
      </div>
    </div>
  )
}

export default NavBar;
