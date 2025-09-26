import React, { useEffect, useState } from 'react';
import { Link, Navigate } from "react-router-dom";
import { useAuthState, useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../../../Firebase/ClientApp.js';
import { browserLocalPersistence, browserSessionPersistence, setPersistence } from 'firebase/auth';


function LoginForm() {
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);
  const [emailid, setEmailid] = useState('');
  const [password, setPassword] = useState('');
  const [rememberme, setRememberMe]=useState(false);
  const [userr, loadingg, erorr] = useAuthState(auth);
  const [errorcause, setErrorcause] = useState('');
  useEffect(() => {
    if (rememberme)
    {
      setPersistence(auth, browserLocalPersistence);
    }
    else
    {
      setPersistence(auth, browserSessionPersistence);
    }
  }, [rememberme]);
  useEffect(()=>{
    if (error)
    {
      if (error.message.toLowerCase().includes('password'))
      {
        setErrorcause('password');
      }
      else if (error.message.toLowerCase().includes('email'))
      {
        setErrorcause('email');
      }
    }
  }, [error])
  if (user || userr)
  {
    return <Navigate replace to="/" />;
  }
  return (
    <div className="h-screen flex items-center justify-center border-black pt-[10vh]" dir="rtl" style={{
      backgroundImage: 'url("/loginpage-background-image.webp")',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      filter: 'blur(0px)'
    }}>
      <div className="bg-white rounded-lg shadow-lg w-96 border-double border-4 border-sky-500" dir="rtl">
        <div className="flex justify-between items-center text-center w-full px-10 pt-5 pb-1">
          <h1 className="text-2xl font-bold dark:text-[#1A1A1C]" style={{ fontFamily: 'monospace' }}>تسجيل الدخول</h1>

          <h2 className="flex items-center justify-end dark:text-[#1A1A1C]">
            <img src="/iiitdmj-logo.webp" alt="شعار المعهد" className="w-8 h-8 iiitdmj-logo mx-1" />
            Fyleo
          </h2>

        </div>
        <hr className=' ' />
        <form className="px-6 py-4" dir="rtl">
          <div className="mb-4 flex justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setErrorcause('');
                console.log('Google Sign In clicked');
                signInWithGoogle().then((result) => {
                  console.log('Google sign in successful:', result);
                }).catch((error) => {
                  console.error('Google sign in error:', error);
                });
              }}
              className="w-full bg-white border border-gray-300 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-all duration-200"
              disabled={gLoading}
            >
              {gLoading ? (
                <img src="/loader.gif" alt="جاري التحميل" className="w-5 h-5" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  المتابعة مع Google
                </>
              )}
            </button>
          </div>
        <div className={`my-3 text-center text-base bg-red-500 text-white rounded-lg p-1 capitalize ${(error)? 'visible' : 'hidden'}`}>
              {(error) ? error.message.replaceAll('Firebase: Error (auth/', '').replaceAll(').', '').replaceAll('-', ' ') : null}
            </div>
          <div className="mb-6">
            <label className="text-gray-500 block text-right">البريد الإلكتروني</label>
            <input 
              type="email" 
              dir="ltr"
              placeholder="example@email.com"
              className={`w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none dark:text-[#1A1A1C] text-left ${(errorcause=='email') ? 'border-red-500' : null}`} 
              required 
              onChange={(e) => setEmailid(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="text-gray-500 block text-right">كلمة المرور</label>
            <input 
              type="password" 
              dir="ltr"
              placeholder="********"
              className={`w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none dark:text-[#1A1A1C] text-left ${(errorcause=='password') ? 'border-red-500' : null}`} 
              required 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="checkb1 flex items-center">
              <input type="checkbox" id="remember" className="form-checkbox ml-2" onChange={(e) => {setRememberMe(e.target.checked);}}/>
              <label htmlFor="remember" className="text-sm text-gray-600">تذكرني</label>
            </div>
            <div className="text-sm text-gray-600">
              <Link to='/resetpassword' className="text-blue-500 hover:underline">نسيت كلمة المرور؟</Link>
            </div>
          </div>
          {loading ? 
            <div className={`flex items-center justify-center h-10`}>
              <img src="/loader.gif" alt="جاري التحميل" className='bg-white h-full' />
            </div> : 
            <input 
              type="submit" 
              value="تسجيل الدخول" 
              className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors duration-200" 
              onClick={(e) => {
                e.preventDefault();
                setErrorcause('');
                signInWithEmailAndPassword(emailid, password)
              }}
            />
          }
          <div className="mt-6 text-center text-base text-gray-600">
            ليس عضواً بعد؟ <Link to="/signup" className="text-blue-500 hover:underline">إنشاء حساب</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;