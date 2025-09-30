import { useState, useEffect, createContext, useContext } from 'react';import { useState, useEffect, createContext, useContext } from 'react';

import { account } from '../config/appwrite';import { account } from '../config/appwrite';

import { ID } from 'appwrite';import { ID } from 'appwrite';



// Create Auth Context// Create Auth Context

const AuthContext = createContext();const AuthContext = createContext();



// Auth Provider Component// Auth Provider Component

export const AuthProvider = ({ children }) => {export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);  const [loading, setLoading] = useState(true);



  useEffect(() => {  useEffect(() => {

    checkUserSession();    checkUserSession();

  }, []);  }, []);



  const checkUserSession = async () => {  const checkUserSession = async () => {

    try {    try {

      const session = await account.get();      const session = await account.get();

      setUser(session);      setUser(session);

    } catch (error) {    } catch (error) {

      setUser(null);      setUser(null);

    } finally {    } finally {

      setLoading(false);      setLoading(false);

    }    }

  };  };



  const login = async (email, password, rememberMe = false) => {  const login = async (email, password, rememberMe = false) => {

    try {    try {

      await account.createEmailSession(email, password);      await account.createEmailSession(email, password);

      const session = await account.get();      const session = await account.get();

      setUser(session);      setUser(session);

      return { success: true, user: session };      return { success: true, user: session };

    } catch (error) {    } catch (error) {

      return { success: false, error: error.message };      return { success: false, error: error.message };

    }    }

  };  };



  const signup = async (email, password, name) => {  const signup = async (email, password, name) => {

    try {    try {

      // Create account      // Create account

      await account.create(ID.unique(), email, password, name);      await account.create(ID.unique(), email, password, name);

      // Auto login after signup      // Auto login after signup

      const loginResult = await login(email, password);      const loginResult = await login(email, password);

      return loginResult;      return loginResult;

    } catch (error) {    } catch (error) {

      return { success: false, error: error.message };      return { success: false, error: error.message };

    }    }

  };  };



  const logout = async () => {  const logout = async () => {

    try {    try {

      await account.deleteSession('current');      await account.deleteSession('current');

      setUser(null);      setUser(null);

      return { success: true };      return { success: true };

    } catch (error) {    } catch (error) {

      return { success: false, error: error.message };      return { success: false, error: error.message };

    }    }

  };  };



  const resetPassword = async (email) => {  const resetPassword = async (email) => {

    try {    try {

      await account.createRecovery(      await account.createRecovery(

        email,        email,

        `${window.location.origin}/reset-password`        `${window.location.origin}/reset-password`

      );      );

      return { success: true };      return { success: true };

    } catch (error) {    } catch (error) {

      return { success: false, error: error.message };      return { success: false, error: error.message };

    }    }

  };  };



  const value = {  const value = {

    user,    user,

    loading,    loading,

    login,    login,

    signup,    signup,

    logout,    logout,

    resetPassword,    resetPassword,

    checkUserSession    checkUserSession

  };  };



  return (  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

    <AuthContext.Provider value={value}>};

      {children}

    </AuthContext.Provider>// Custom hook to use auth context

  );export const useAuth = () => {

};  const context = useContext(AuthContext);

  if (!context) {

// Custom hook to use auth context    throw new Error('useAuth must be used within an AuthProvider');

export const useAuth = () => {  }

  const context = useContext(AuthContext);  return context;

  if (!context) {};
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;