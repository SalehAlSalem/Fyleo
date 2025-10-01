import React from 'react';
import classNames from 'classnames';
import { Link } from "react-router-dom";
import DarkMode from '../DarkMode';
import { useAuth } from '../../hooks/useAuth';

const NavBar = () => {
  const { user, logout } = useAuth();
  
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
              <Link to='/categories' className="px-4 py-2 monu text-sm text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                🗂️ التصنيفات
              </Link>
              <Link to='/login' className="theme-btn-shadow rounded-xl bg-[#3B82F6] px-4 py-2 monu text-sm text-white font-normal mobile:text-xs hover:bg-blue-700 transition-colors">
                🔑 تسجيل دخول
              </Link>
              <Link to='/signup' className="theme-btn-shadow rounded-xl bg-[#10B981] px-4 py-2 monu text-sm text-white font-normal mobile:text-xs hover:bg-green-700 transition-colors">
                📝 تسجيل جديد
              </Link>
            </>
          )}

          {user && (
            <>
              <Link to='/categories' className="px-4 py-2 monu text-sm text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                🗂️ التصنيفات
              </Link>
              <Link to='/dashboard' className="px-4 py-2 monu text-sm text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                📊 لوحة التحكم
              </Link>
              <Link to='/uploads' className="theme-btn-shadow rounded-xl bg-[#10B981] px-4 py-2 monu text-sm text-white hover:bg-green-600 transition-colors">
                📤 رفع ملف
              </Link>
              <span className="px-4 py-2 monu text-sm text-gray-600 dark:text-gray-400">
                👤 {user.name || user.email}
              </span>
              <button onClick={() => logout()} className="theme-btn-shadow rounded-xl bg-[#3B82F6] px-4 py-2 monu text-sm text-white hover:bg-blue-700 transition-colors">
                🚪 خروج
              </button>
            </>
          )}
          <DarkMode />
        </div>
      </div>
    </div>
  )
}

export default NavBar;
