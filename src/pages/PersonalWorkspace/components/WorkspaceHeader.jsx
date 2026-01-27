import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { account } from '../../../config/appwrite';
import './WorkspaceHeader.css';

/**
 * ✨ Workspace Header - Premium Edition
 * 3D Avatar + Gradient Glow + Smooth Inline Editing
 * Inspired by Landing Page & GPA Calculator
 */
const WorkspaceHeader = ({ user, onLogout, onDeleteAccount, onUserUpdate }) => {
  const { t } = useTranslation();
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // 3D Avatar hover effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);

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
  
  const handleAvatarHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };
  
  const handleAvatarLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <>
      <motion.header 
        className="workspace-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="header-content">
          <div className="user-profile-section">
            {/* Left Side: 3D Avatar + User Info */}
            <div className="user-info-left">
              <motion.div 
                className="avatar-container"
                onMouseMove={handleAvatarHover}
                onMouseLeave={handleAvatarLeave}
                style={{ perspective: 1000 }}
              >
                <motion.div 
                  className="user-avatar"
                  style={{
                    rotateX,
                    rotateY,
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {(user.name || user.email).charAt(0).toUpperCase()}
                  
                  {/* Orbiting Ring */}
                  <motion.div 
                    className="avatar-ring"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Ambient Glow */}
                  <motion.div 
                    className="avatar-glow"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5] 
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>
              
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
      </motion.header>

      {/* Message Toast */}
      {message && (
        <motion.div 
          className={`message-toast ${message.includes('✅') ? 'success' : 'error'}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {message}
        </motion.div>
      )}
    </>
  );
};

export default WorkspaceHeader;
