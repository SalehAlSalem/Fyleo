import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { account, teams } from '../config/appwrite';

/**
 * AdminRoleGuard - Protects admin routes with role-based access
 * 
 * Allows access to users with:
 * - Label: 'admin' (Full access)
 * - Team: 'reviewer-team' (Content review)
 * - Team: 'content_manager' (Categories & Subjects)
 */
const AdminRoleGuard = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (loading) return;

      if (!user) {
        console.warn('⚠️ AdminRoleGuard: No user, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        // Get user details from Appwrite
        const userDetails = await account.get();
        console.log('🔍 AdminRoleGuard: Checking user details...', userDetails);

        // Check if email is verified
        const isEmailVerified = userDetails.emailVerification;
        console.log('📧 AdminRoleGuard: Email verified?', isEmailVerified);

        if (!isEmailVerified) {
          console.warn('⚠️ AdminRoleGuard: Email not verified');
          alert('يجب تأكيد بريدك الإلكتروني للوصول إلى لوحة التحكم');
          navigate('/');
          setChecking(false);
          return;
        }

        // Check for admin label
        const labels = userDetails.labels || [];
        const hasAdminLabel = labels.includes('admin');
        console.log('🔐 AdminRoleGuard: User labels:', labels);
        console.log('👑 AdminRoleGuard: Is admin?', hasAdminLabel);

        if (hasAdminLabel) {
          console.log('✅ AdminRoleGuard: Access granted - Admin');
          setHasAccess(true);
          setChecking(false);
          return;
        }

        // Check for team membership
        try {
          const userTeamsList = await teams.list();
          const teamIds = userTeamsList.teams.map(t => t.$id);
          console.log('👥 AdminRoleGuard: User teams:', teamIds);

          const isReviewer = teamIds.includes('reviewer-team');
          const isContentManager = teamIds.includes('content_manager');

          console.log('👁️ AdminRoleGuard: Is reviewer?', isReviewer);
          console.log('📝 AdminRoleGuard: Is content manager?', isContentManager);

          if (isReviewer || isContentManager) {
            console.log('✅ AdminRoleGuard: Access granted - Team member');
            setHasAccess(true);
            setChecking(false);
            return;
          }
        } catch (teamError) {
          console.error('❌ AdminRoleGuard: Error fetching teams:', teamError);
        }

        // No access
        console.warn('⚠️ AdminRoleGuard: User does not have admin access');
        alert('ليس لديك صلاحيات الوصول إلى لوحة التحكم');
        navigate('/');
      } catch (error) {
        console.error('❌ AdminRoleGuard: Error checking admin access:', error);
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

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
};

export default AdminRoleGuard;
