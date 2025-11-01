import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usersService } from '../../services/appwriteService';
import { 
  ModernCard, 
  ModernButton,
  ModernAlert,
  ModernSkeleton,
  ModernBadge
} from '@shared/ui/modern/ModernComponents';

const UsersManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usersService.getAll();
      setUsers(data);
    } catch (err) {
      setError(t('admin.loadError'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ModernSkeleton lines={5} />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        إدارة المستخدمين ({users.length})
      </h2>
      
      {error && <ModernAlert type="error">{error}</ModernAlert>}

      <div className="grid gap-4">
        {users.map(user => (
          <ModernCard key={user.$id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white">{user.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
              <ModernBadge variant="success">نشط</ModernBadge>
            </div>
          </ModernCard>
        ))}
      </div>
    </div>
  );
};

export default UsersManagement;

