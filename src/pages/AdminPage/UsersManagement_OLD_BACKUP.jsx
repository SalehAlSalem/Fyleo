import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usersService } from '../../services/appwriteService';
import { blockUser, addUserToTeam, removeUserFromTeam, areFunctionsConfigured, getUsersStatus, getAllTeams, getAllUserTeams } from '../../services/appwriteFunctions';

/**
 * 👥 Users Management - Premium Redesign
 */
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
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  
  const functionsConfigured = areFunctionsConfigured();

  useEffect(() => {
    loadUsers();
    if (functionsConfigured) {
      loadAvailableTeams();
    }
  }, []);

  const loadAvailableTeams = async () => {
    try {
      const CACHE_KEY = 'appwrite_teams_cache';
      const CACHE_DURATION = 60 * 60 * 1000;
      
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { teams, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setAvailableTeams(teams);
          return;
        }
      }
      
      const teams = await getAllTeams();
      setAvailableTeams(teams);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ teams, timestamp: Date.now() }));
    } catch (err) {
      console.error('⚠️ Failed to load teams:', err);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await usersService.getAll(1000);
      
      if (functionsConfigured && data.length > 0) {
        setLoadingStatus(true);
        
        try {
          const userIds = data.map(u => u.$id);
          const statusMap = await getUsersStatus(userIds);
          
          const usersWithStatus = data.map(user => ({
            ...user,
            status: statusMap[user.$id] !== undefined ? statusMap[user.$id] : true
          }));
          
          setUsers(usersWithStatus);
        } catch (statusErr) {
          const usersWithStatus = data.map(user => ({ ...user, status: true }));
          setUsers(usersWithStatus);
        } finally {
          setLoadingStatus(false);
        }
      } else {
        setUsers(data);
      }
      
      if (functionsConfigured && data.length > 0) {
        try {
          const userIds = data.map(u => u.$id);
          const userTeamsMap = await getAllUserTeams(userIds);
          setUserTeams(userTeamsMap);
        } catch (err) {
          const emptyTeams = {};
          data.forEach(u => { emptyTeams[u.$id] = []; });
          setUserTeams(emptyTeams);
        }
      } else {
        const emptyTeams = {};
        data.forEach(u => { emptyTeams[u.$id] = []; });
        setUserTeams(emptyTeams);
      }
    } catch (err) {
      setError(t('admin.users.messages.loadError'));
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
      clearTeamsCache();
      await loadUsers();
    } catch (err) {
      setError(`فشل إضافة المستخدم للفريق: ${err.message}`);
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
      clearTeamsCache();
      await loadUsers();
    } catch (err) {
      setError(`فشل إزالة المستخدم من الفريق: ${err.message}`);
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10 animate-pulse">
            <div className="h-32 bg-white/10 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
            👥
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">إدارة المستخدمين</h2>
            <p className="text-white/60">عرض ومعلومات المستخدمين والتواصل معهم</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="backdrop-blur-sm bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 rounded-full font-bold text-white shadow-lg">
            {filteredUsers.length} مستخدم
          </div>
          {/* View Toggle */}
          <div className="backdrop-blur-sm bg-white/10 rounded-full p-1 border border-white/20">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/60'}`}
            >
              ⊞
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/60'}`}
            >
              ☰
            </button>
          </div>
        </div>
      </div>
      
      {/* Alerts */}
      {loadingStatus && (
        <div className="backdrop-blur-sm bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
          <p className="text-blue-200">⏳ جاري تحميل حالة المستخدمين من Auth...</p>
        </div>
      )}
      
      {!functionsConfigured && (
        <div className="backdrop-blur-sm bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4">
          <p className="text-yellow-200 font-bold">⚠️ Functions غير مفعلة</p>
          <p className="text-yellow-200/80 text-sm mt-1">ميزات الحظر وإدارة الفرق معطلة. تأكد من إضافة Function IDs في .env</p>
        </div>
      )}

      {functionsConfigured && (
        <div className="backdrop-blur-sm bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
          <p className="text-green-200 font-bold">✅ Functions جاهزة! يمكنك الآن حظر المستخدمين وإدارة الفرق</p>
        </div>
      )}

      {error && (
        <div className="backdrop-blur-sm bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between">
          <p className="text-red-200">{error}</p>
          <button onClick={() => setError('')} className="text-red-200 hover:text-white">✕</button>
        </div>
      )}
      
      {success && (
        <div className="backdrop-blur-sm bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center justify-between">
          <p className="text-green-200">{success}</p>
          <button onClick={() => setSuccess('')} className="text-green-200 hover:text-white">✕</button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder={t('admin.users.placeholders.searchUser')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-all"
        />
        <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
      </div>

      {/* Users Grid/List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-24 backdrop-blur-sm bg-white/5 rounded-3xl border border-white/10">
          <div className="text-6xl mb-4">👤</div>
          <p className="text-white/60 text-xl">{searchTerm ? t('admin.users.messages.noResults') : t('admin.users.messages.noUsers')}</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredUsers.map(user => {
            const teams = userTeams[user.$id] || [];
            const userInitial = user.name?.charAt(0)?.toUpperCase() || '?';
            const isBlocked = !user.status;
            
            return (
              <div 
                key={user.$id} 
                className={`group backdrop-blur-sm bg-white/5 border border-white/10 hover:border-white/30 rounded-3xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isBlocked ? 'opacity-60' : ''}`}
              >
                <div className="space-y-4">
                  {/* User Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform">
                          {userInitial}
                        </div>
                        {/* Status Indicator */}
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${isBlocked ? 'bg-red-500' : 'bg-green-400'}`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-lg truncate">{user.name || t('admin.users.labels.noName')}</h3>
                        <p className="text-white/60 text-sm truncate">📧 {user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex flex-wrap gap-2 text-xs text-white/50">
                    <span className="backdrop-blur-sm bg-white/5 px-3 py-1 rounded-full">
                      📅 {formatDate(user.$createdAt)}
                    </span>
                    {isBlocked && (
                      <span className="backdrop-blur-sm bg-red-500/20 text-red-300 px-3 py-1 rounded-full font-semibold">
                        🚫 محظور
                      </span>
                    )}
                  </div>

                  {/* Teams */}
                  {teams.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {teams.map((team) => (
                        <div key={team.membershipId} className="group/team relative">
                          <span className="backdrop-blur-sm bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-blue-200 text-xs font-medium flex items-center gap-2">
                            👥 {team.teamName}
                            {functionsConfigured && (
                              <button
                                onClick={() => handleRemoveFromTeam(team.teamId, team.membershipId, team.teamName)}
                                disabled={processingUsers[team.membershipId]}
                                className="text-red-300 hover:text-red-100 transition-colors"
                              >
                                ✕
                              </button>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEmailUser(user.email)}
                      className="flex-1 backdrop-blur-sm bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
                    >
                      ✉️ مراسلة
                    </button>
                    {functionsConfigured && (
                      <button
                        onClick={() => handleBlockUser(user.$id, isBlocked)}
                        disabled={processingUsers[user.$id]}
                        className={`flex-1 backdrop-blur-sm ${isBlocked ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'} hover:opacity-90 text-white px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg disabled:opacity-50`}
                      >
                        {processingUsers[user.$id] ? '⏳' : isBlocked ? '✓ إلغاء الحظر' : '🚫 حظر'}
                      </button>
                    )}
                  </div>

                  {/* Add to Team Dropdown */}
                  {functionsConfigured && availableTeams.length > 0 && (
                    <details className="group/dropdown">
                      <summary className="cursor-pointer backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-white/80 hover:text-white transition-all list-none">
                        <span className="flex items-center justify-between">
                          <span>➕ إضافة لفريق</span>
                          <span className="group-open/dropdown:rotate-180 transition-transform">▼</span>
                        </span>
                      </summary>
                      <div className="mt-2 space-y-2">
                        {availableTeams
                          .filter(team => !teams.some(ut => ut.teamId === team.$id))
                          .map(team => (
                            <button
                              key={team.$id}
                              onClick={() => handleAddToTeam(user.$id, team.$id, team.name)}
                              disabled={processingUsers[`${user.$id}-${team.$id}`]}
                              className="w-full text-left backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-white/80 hover:text-white transition-all disabled:opacity-50"
                            >
                              {processingUsers[`${user.$id}-${team.$id}`] ? '⏳ جاري الإضافة...' : `👥 ${team.name}`}
                            </button>
                          ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
