import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { account } from '../../../config/appwrite';
import './WorkspaceHeader.css';

/**
 * Workspace Header - Redesigned with inline editing
 * User info on the right, clean inline edit icons
 */
const WorkspaceHeader = ({ user, onLogout, onDeleteAccount, onUserUpdate }) => {
  const { t } = useTranslation();
  const [editingField, setEditingField] = useState(null); // 'name' or null
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleEditClick = (field) => {
    setEditingField(field);
    setEditValue(user.name || '');
    setMessage('');
  };

  const handleSave = async () => {
    if (!editValue.trim()) {
      setMessage('❌ ' + t('profile.nameRequired'));
      return;
    }

    setSaving(true);
    try {
      // Update in Auth
      await account.updateName(editValue.trim());
      
      // Update in Database (users collection)
      const { databases } = await import('../../../config/appwrite');
      const DATABASE_ID = '68d97982002b686c7151';
      const USERS_COLLECTION_ID = 'users';
      
      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        user.$id,
        { name: editValue.trim() }
      );
      
      setMessage('✅ ' + t('profile.updateSuccess'));
      setTimeout(() => {
        setEditingField(null);
        if (onUserUpdate) onUserUpdate();
      }, 1500);
    } catch (error) {
      console.error('Error updating name:', error);
      setMessage('❌ ' + t('profile.updateError'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setMessage('');
  };

  const handleResendVerification = async () => {
    try {
      await account.createVerification(window.location.origin + '/verify-email');
      setMessage('✅ ' + t('profile.verificationSent'));
    } catch (error) {
      console.error('Error sending verification:', error);
      setMessage('❌ ' + t('profile.verificationError'));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <header className="workspace-header">
        <div className="header-content">
          <div className="user-profile-section">
            {/* Left Side: Avatar + User Info */}
            <div className="user-info-left">
              <div className="user-avatar">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </div>
              
              <div className="user-details">
                {/* Name Field with Inline Edit */}
                <div className="info-row">
                  {editingField === 'name' ? (
                    <div className="inline-edit-container">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="inline-edit-input"
                        autoFocus
                        disabled={saving}
                      />
                      <button onClick={handleSave} className="inline-btn save-btn" disabled={saving}>
                        {saving ? '⏳' : '✓'}
                      </button>
                      <button onClick={handleCancel} className="inline-btn cancel-btn" disabled={saving}>
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <h1 className="user-name">{user.name || user.email}</h1>
                      <button 
                        onClick={() => handleEditClick('name')}
                        className="edit-icon-btn"
                        title={t('profile.editName')}
                      >
                        ✏️
                      </button>
                    </>
                  )}
                </div>

                {/* Email Display */}
                <div className="info-row">
                  <p className="user-email">{user.email}</p>
                </div>

                {/* Account Info */}
                <div className="account-info">
                  <div className="info-item">
                    <span className="info-label">{t('profile.accountCreated')}:</span>
                    <span className="info-value">{formatDate(user.$createdAt)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('profile.status')}:</span>
                    {user.emailVerification ? (
                      <span className="status-badge verified">
                        ✓ Verified
                      </span>
                    ) : (
                      <div className="verification-section">
                        <span className="status-badge unverified">
                          ⚠ {t('profile.notVerified')}
                        </span>
                        <button 
                          onClick={handleResendVerification}
                          className="resend-btn"
                        >
                          📧 {t('profile.resendVerification')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Action Buttons */}
            <div className="user-actions-right">
              <button 
                onClick={onLogout}
                className="action-btn logout-btn"
              >
                <span className="btn-icon">🚪</span>
                <span className="btn-text">{t('nav.logout')}</span>
              </button>
              <button 
                onClick={onDeleteAccount}
                className="action-btn delete-account-btn"
              >
                <span className="btn-icon">🗑️</span>
                <span className="btn-text">{t('profile.deleteAccount')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Message Toast */}
      {message && (
        <div className={`message-toast ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </>
  );
};

export default WorkspaceHeader;
