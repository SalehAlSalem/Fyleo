import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usersService } from '../../services/appwriteService';
import { blockUser, addUserToTeam, removeUserFromTeam, areFunctionsConfigured, getUsersStatus, getAllTeams, getAllUserTeams } from '../../services/appwriteFunctions';
import { 
  ModernCard, 
  ModernButton,
  ModernAlert,
  ModernSkeleton,
  ModernBadge,
  ModernInput
} from '@shared/ui/modern/ModernComponents';

const UsersManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userTeams, setUserTeams] = useState({});
  const [processingUsers, setProcessingUsers] = useState({});
  const [success, setSuccess] = useState('');
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [availableTeams, setAvailableTeams] = useState([]);
  
  const functionsConfigured = areFunctionsConfigured();

  useEffect(() => {
    loadUsers();
    if (functionsConfigured) {
      loadAvailableTeams();
    }
  }, []);

  const loadAvailableTeams = async () => {
    try {
      // Cache teams for 1 hour to improve performance
      const CACHE_KEY = 'appwrite_teams_cache';
      const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
      
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { teams, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setAvailableTeams(teams);
          console.log('✅ Teams loaded from cache:', teams);
          return;
        }
      }
      
      // Fetch fresh data
      const teams = await getAllTeams();
      setAvailableTeams(teams);
      
      // Cache the result
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        teams,
        timestamp: Date.now()
      }));
      
      console.log('✅ Available teams loaded and cached:', teams);
    } catch (err) {
      console.error('⚠️ Failed to load teams:', err);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get users from Database
      const data = await usersService.getAll(1000);
      
      // Get Auth status for all users
      if (functionsConfigured && data.length > 0) {
        console.log('📊 Loading Auth status for users...');
        setLoadingStatus(true);
        
        try {
          const userIds = data.map(u => u.$id);
          const statusMap = await getUsersStatus(userIds);
          
          // Merge Auth status with Database users
          const usersWithStatus = data.map(user => ({
            ...user,
            status: statusMap[user.$id] !== undefined ? statusMap[user.$id] : true
          }));
          
          setUsers(usersWithStatus);
          console.log('✅ Users loaded with Auth status');
        } catch (statusErr) {
          console.error('⚠️ Failed to get Auth status:', statusErr);
          // Fallback: use default status
          const usersWithStatus = data.map(user => ({
            ...user,
            status: true // Default to active
          }));
          setUsers(usersWithStatus);
        } finally {
          setLoadingStatus(false);
        }
      } else {
        setUsers(data);
        console.log('✅ Users loaded:', data.length);
      }
      
      // Load teams for all users (bulk - MUCH FASTER!)
      if (functionsConfigured && data.length > 0) {
        try {
          const userIds = data.map(u => u.$id);
          const userTeamsMap = await getAllUserTeams(userIds);
          setUserTeams(userTeamsMap);
          console.log('✅ User teams loaded (bulk)');
        } catch (err) {
          console.error('⚠️ Failed to get user teams:', err);
          // Fallback: empty teams
          const emptyTeams = {};
          data.forEach(u => {
            emptyTeams[u.$id] = [];
          });
          setUserTeams(emptyTeams);
        }
      } else {
        // No functions or no users - set empty
        const emptyTeams = {};
        data.forEach(u => {
          emptyTeams[u.$id] = [];
        });
        setUserTeams(emptyTeams);
      }
    } catch (err) {
      setError(t('admin.users.messages.loadError'));
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUser = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handleBlockUser = async (userId, currentlyBlocked = false) => {
    try {
      setProcessingUsers(prev => ({ ...prev, [userId]: true }));
      setError('');
      setSuccess('');

      await blockUser(userId, !currentlyBlocked);
      
      // Update user status in local state immediately
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.$id === userId 
            ? { ...u, status: currentlyBlocked } 
            : u
        )
      );
      
      setSuccess(!currentlyBlocked ? t('admin.users.messages.userBanned') : t('admin.users.messages.userUnbanned'));
    } catch (err) {
      setError(`${!currentlyBlocked ? t('admin.users.messages.banError') : t('admin.users.messages.unbanError')}: ${err.message}`);
      console.error('Error blocking user:', err);
    } finally {
      setProcessingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };

  const clearTeamsCache = () => {
    localStorage.removeItem('appwrite_teams_cache');
  };

  const handleAddToTeam = async (userId, teamId, teamName) => {
    try {
      setProcessingUsers(prev => ({ ...prev, [`${userId}-${teamId}`]: true }));
      setError('');
      setSuccess('');

      await addUserToTeam(userId, teamId);
      
      setSuccess(`تمت إضافة المستخدم إلى ${teamName} بنجاح`);
      clearTeamsCache(); // Invalidate cache
      await loadUsers();
    } catch (err) {
      setError(`فشل إضافة المستخدم للفريق: ${err.message}`);
      console.error('Error adding to team:', err);
    } finally {
      setProcessingUsers(prev => ({ ...prev, [`${userId}-${teamId}`]: false }));
    }
  };

  const handleRemoveFromTeam = async (teamId, membershipId, teamName) => {
    try {
      setProcessingUsers(prev => ({ ...prev, [`${membershipId}`]: true }));
      setError('');
      setSuccess('');

      await removeUserFromTeam(teamId, membershipId);
      
      setSuccess(`تمت إزالة المستخدم من ${teamName} بنجاح`);
      clearTeamsCache(); // Invalidate cache
      await loadUsers();
    } catch (err) {
      setError(`فشل إزالة المستخدم من الفريق: ${err.message}`);
      console.error('Error removing from team:', err);
    } finally {
      setProcessingUsers(prev => ({ ...prev, [`${membershipId}`]: false }));
    }
  };

  const getFilteredUsers = () => {
    if (!searchTerm.trim()) return users;
    
    const search = searchTerm.toLowerCase();
    return users.filter(user => {
      const name = user.name?.toLowerCase() || '';
      const email = user.email?.toLowerCase() || '';
      return name.includes(search) || email.includes(search);
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredUsers = getFilteredUsers();

  if (loading) return <ModernSkeleton lines={5} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة المستخدمين</h2>
          <p className="text-gray-600 dark:text-gray-400">عرض معلومات المستخدمين والتواصل معهم</p>
        </div>
        <ModernBadge variant="info" className="text-lg px-4 py-2">{filteredUsers.length} مستخدم</ModernBadge>
      </div>
      
      {loadingStatus && (
        <ModernAlert type="info">
          � جاري تحميل حالة المستخدمين من Auth... الرجاء الانتظار
        </ModernAlert>
      )}
      
      {!functionsConfigured && (
        <ModernAlert type="warning">
          <div className="space-y-2">
            <p className="font-bold">⚠️ Functions غير مفعلة:</p>
            <p>ميزات الحظر وإدارة الفرق معطلة. تأكد من إضافة Function IDs في .env</p>
          </div>
        </ModernAlert>
      )}

      {functionsConfigured && (
        <ModernAlert type="success">
          <p className="font-bold">✅ Functions جاهزة! يمكنك الآن حظر المستخدمين وإدارة الفرق</p>
        </ModernAlert>
      )}

      {error && <ModernAlert type="error" onClose={() => setError('')}>{error}</ModernAlert>}
      {success && <ModernAlert type="success" onClose={() => setSuccess('')}>{success}</ModernAlert>}

      <ModernInput type="text" placeholder={t('admin.users.placeholders.searchUser')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      <div className="grid gap-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">{searchTerm ? t('admin.users.messages.noResults') : t('admin.users.messages.noUsers')}</p>
          </div>
        ) : (
          filteredUsers.map(user => {
            const teams = userTeams[user.$id] || [];
            
            return (
              <ModernCard key={user.$id} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {user.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 dark:text-white text-lg">{user.name || t('admin.users.labels.noName')}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">📧 {user.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <span>📅 {t('admin.users.labels.joined')}: {formatDate(user.$createdAt)}</span>
                      </div>

                      {userTeams[user.$id]?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">الفرق:</span>
                          {userTeams[user.$id].map(team => (
                            <div key={team.teamId} className="flex items-center gap-1">
                              <ModernBadge variant="info">{team.teamName}</ModernBadge>
                              {functionsConfigured && (
                                <button
                                  onClick={() => handleRemoveFromTeam(team.teamId, team.membershipId, team.teamName)}
                                  disabled={processingUsers[team.membershipId]}
                                  className="text-red-500 hover:text-red-700 text-xs ml-1"
                                  title="إزالة من الفريق"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <ModernButton 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEmailUser(user.email)} 
                        title="إرسال بريد إلكتروني"
                      >
                        ✉️ تواصل
                      </ModernButton>
                    </div>
                  </div>

                  {functionsConfigured && (
                    <div className="border-t dark:border-gray-700 pt-3">
                      <div className="flex flex-wrap gap-2">
                        <ModernButton
                          size="sm"
                          variant={user.status === false ? 'success' : 'danger'}
                          onClick={() => handleBlockUser(user.$id, user.status === false)}
                          disabled={processingUsers[user.$id]}
                        >
                          {processingUsers[user.$id] ? '⏳' : user.status === false ? '🔓 إلغاء الحظر' : '🔒 حظر'}
                        </ModernButton>

                        {/* Dynamic Team Buttons */}
                        {availableTeams.map(team => {
                          const isInTeam = userTeams[user.$id]?.find(t => t.teamId === team.$id);
                          if (isInTeam) return null; // Don't show button if already in team
                          
                          return (
                            <ModernButton
                              key={team.$id}
                              size="sm"
                              variant="primary"
                              onClick={() => handleAddToTeam(user.$id, team.$id, team.name)}
                              disabled={processingUsers[`${user.$id}-${team.$id}`]}
                            >
                              {processingUsers[`${user.$id}-${team.$id}`] ? '⏳' : `➕ ${team.name}`}
                            </ModernButton>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </ModernCard>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
