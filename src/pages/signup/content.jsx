import React, { useEffect, useState } from 'react';
import { Link, Navigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';

const PasswordValidationModal = () => {
  return (
    <div className="group relative flex items-center justify-center" dir="rtl">
      <img
        src={"/info.png"} className="w-4 h-4 cursor-pointer opacity-70 mb-[0.2rem]"
      />
      <span className="z-[1000] w-[25rem] absolute top-0 right-[-7.35rem] scale-0 rounded bg-white border-double border-4 border-sky-500 p-2 text-xs text-gray-900 group-hover:scale-100 transition-all">
        <span className='flex items-center justify-start gap-1'>
          <p>{"1️⃣"}</p>
          كلمة المرور يجب أن تكون 6 أحرف على الأقل
        </span>
        <span className='flex items-center justify-start gap-1'>
          <p>{"2️⃣"}</p>
          يجب أن تحتوي على حرف كبير واحد على الأقل
        </span>
        <span className='flex items-center justify-start gap-1'>
          <p>{"3️⃣"}</p>
          يجب أن تحتوي على حرف صغير واحد على الأقل
        </span>
        <span className='flex items-center justify-start gap-1'>
          <p>{"4️⃣"}</p>
          يجب أن تحتوي على رقم واحد على الأقل
        </span>
        <span className='flex items-center justify-start gap-1'>
          <p>{"5️⃣"}</p>
          Password should contain one special symbol.
        </span>
      </span>
    </div>
  )
}

function SignForm() {
  const { user, signup, loginWithGoogle, loading } = useAuth();
  const [emailid, setEmailid] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [errorr, setErrorr] = useState(null);
  const [gLoading, setGLoading] = useState(false);
  const [errorcause, setErrorcause] = useState('');
  const validEmail = /^\d{2}[A-Za-z]{3}\d{3}$/; // legacy pattern (kept if needed)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{6,}$/;
  const signupuser = async (emailid, password, confirmpassword, name) => {
    // Accept any standard email address for signup (MVP).
    if (!emailRegex.test(emailid)) {
      setErrorr('أدخل عنوان بريد إلكتروني صحيح');
      setErrorcause('email');
      return;
    }
    if (password != confirmpassword) {
      setErrorr('كلمة المرور وتأكيدها يجب أن يتطابقا');
      setErrorcause('password');
      return;
    }
    if (!validPassword.test(password)) {
      setErrorr('كلمة مرور غير صحيحة');
      setErrorcause('password');
      return;
    }
    if (!name.trim()) {
      setErrorr('يرجى إدخال الاسم');
      setErrorcause('name');
      return;
    }
    
    const result = await signup(emailid, password, name.trim());
    if (!result.success) {
      setErrorr(result.error);
    }
  };
  
  if (user) {
    return <Navigate replace to="/dashboard" />;
  }
  
  const handleGoogleSignup = async () => {
    setGLoading(true);
    setErrorr(null);
    setErrorcause('');
    
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        setErrorr(result.error);
      }
    } catch (err) {
      setErrorr(err.message);
    } finally {
      setGLoading(false);
    }
  };
  return (
    <div className=" h-screen flex items-center justify-center border-black pt-[11vh]" style={{
      backgroundImage: 'url("/loginpage-background-image.webp")',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      filter: 'blur(0px)'
    }}>
      <div className="bg-white rounded-lg shadow-lg w-96 border-double border-4 border-sky-500" >
        <div className="flex justify-between items-center text-center w-full pl-10 pr-10 pt-5 pb-1" dir="rtl">
          <h1 className="text-2xl font-bold dark:text-[#1A1A1C]" style={{ fontFamily: 'monospace' }}>إنشاء حساب</h1>

          <div className="flex items-center">
            <img src="/iiitdmj-logo.webp" alt="شعار الجامعة" className="w-8 h-8 iiitdmj-logo mx-1" />
            جامعة البلقاء التطبيقية
          </div>

        </div>
        <hr className=' ' />
        <form className="px-6 py-4">
          {/* Google signup */}
          <div className="mb-4 flex justify-center">
            <button
              type="button"
              onClick={handleGoogleSignup}
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
          <div className={`my-3 text-center text-base bg-red-500 text-white rounded-lg p-1 ${(errorr) ? 'visible' : 'hidden'}`}>
            {(errorr) ? errorr : null}
          </div>
          <div className="mb-6">
            <label className="text-gray-500">الاسم</label>
            <input 
              type="text" 
              className={`w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none dark:text-[#1A1A1C] ${(errorcause == 'name') ? 'border-red-500' : null}`} 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="الاسم الكامل"
            />
          </div>
          <div className="mb-6">
            <label className="text-gray-500">البريد الإلكتروني</label>
            <input 
              type="email" 
              className={`w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none dark:text-[#1A1A1C] ${(errorcause == 'email') ? 'border-red-500' : null}`} 
              required 
              value={emailid}
              onChange={(e) => setEmailid(e.target.value)}
              placeholder="example@email.com"
              dir="ltr"
            />
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-start gap-1">
              <label className="text-gray-500">كلمة المرور</label>
              <PasswordValidationModal />
            </div>
            <input 
              type="password" 
              className={`w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none dark:text-[#1A1A1C] ${(errorcause == 'password') ? 'border-red-500' : null}`} 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
            {/* Visible password requirements for clarity */}
            <ul className="text-xs text-gray-500 mt-2 ml-2 list-disc">
              <li>At least 6 characters</li>
              <li>At least one uppercase letter (A-Z)</li>
              <li>At least one lowercase letter (a-z)</li>
              <li>At least one number (0-9)</li>
              <li>At least one special character (e.g. @ # $ % ^ & + =)</li>
            </ul>
          </div>
          <div className="mb-6">
            <label className="text-gray-500">تأكيد كلمة المرور</label>
            <input 
              type="password" 
              className={`w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none dark:text-[#1A1A1C] ${(errorcause == 'password') ? 'border-red-500' : null}`} 
              required 
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
            />
          </div>

          {loading ?
            <div className={`flex items-center justify-center h-10`}>
              <img src="/loader.gif" alt="" className='bg-white h-full' />
            </div> :
            <input
              type="submit"
              value="إنشاء حساب"
              className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                setErrorr(null);
                setErrorcause('');
                signupuser(emailid, password, confirmpassword, name);
              }}
            />}
          <div className="mt-6 text-center text-base text-gray-600" dir="rtl">
            لديك حساب بالفعل؟ <Link to="/login" className="text-blue-500 hover:underline">تسجيل الدخول</Link>
          </div>
        </form>
      </div >
    </div >
  );
}

export default SignForm;