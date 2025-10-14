import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { account } from '../config/appwrite';

/**
 * AdminGuard - Protects admin routes by checking for 'admin' label
 */
const AdminGuard = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (loading) return;

      if (!user) {
        console.warn('⚠️ AdminGuard: No user, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        // Get user details from Appwrite
        const userDetails = await account.get();
        console.log('🔍 AdminGuard: Checking user details...', userDetails);

        // Check if email is verified
        const isEmailVerified = userDetails.emailVerification;
        console.log('📧 AdminGuard: Email verified?', isEmailVerified);

        // Check if user has 'admin' label
        const labels = userDetails.labels || [];
        const hasAdminLabel = labels.includes('admin');

        console.log('🔐 AdminGuard: User labels:', labels);
        console.log('🔐 AdminGuard: Is admin?', hasAdminLabel);

        // User must be verified AND have admin label
        if (!isEmailVerified) {
          console.warn('⚠️ AdminGuard: Email not verified');
          alert('يجب تأكيد بريدك الإلكتروني للوصول إلى لوحة التحكم');
          navigate('/');
        } else if (!hasAdminLabel) {
          console.warn('⚠️ AdminGuard: User does not have admin access');
          alert('ليس لديك صلاحيات الوصول إلى لوحة التحكم');
          navigate('/');
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('❌ AdminGuard: Error checking admin access:', error);
        navigate('/');
      } finally {
        setChecking(false);
      }
    };

    checkAdminAccess();
  }, [user, loading, navigate]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default AdminGuard;
