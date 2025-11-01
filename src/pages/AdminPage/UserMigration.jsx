import React, { useState } from 'react';
import { Client, Databases, Users, Query } from 'appwrite';

const ENDPOINT = import.meta.env.VITE_APPWRITE_URL || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = 'standard_90f0f7e0b94207abac6d508f9508cfa4b7c5a348ab84f6eb5cd7e6722ba0b65d9dc57c1b1a40a2b6db7e8d042cf7dc7d91e2943cae55535cbaa6011f012670b94cef2ff5ba6b7d866e9ba92581d8ef27e5d50523317f68707f8cbc22494abce9a22440d068ef95977afc61a012806ca8fcbc4f41df413e328ed9f9279a91f70a';
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const USERS_COLLECTION_ID = 'users';

const UserMigration = () => {
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    migrated: 0,
    alreadyCorrect: 0,
    errors: 0
  });

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const updateStats = (key, increment = 1) => {
    setStats(prev => ({ ...prev, [key]: prev[key] + increment }));
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchAllAuthUsers = async (users) => {
    const allUsers = [];
    let offset = 0;
    const limit = 100;
    
    while (true) {
      const response = await users.list([
        Query.limit(limit),
        Query.offset(offset)
      ]);
      
      allUsers.push(...response.users);
      
      if (response.users.length < limit) {
        break;
      }
      
      offset += limit;
    }
    
    return allUsers;
  };

  const migrateUser = async (authUser, databases) => {
    const authId = authUser.$id;
    const email = authUser.email;
    const name = authUser.name;
    
    // Check if document with correct ID already exists
    try {
      await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, authId);
      addLog(`✅ ${email}: Already correct`, 'success');
      updateStats('alreadyCorrect');
      return;
    } catch (error) {
      // Continue migration
    }
    
    // Find document by email
    let oldDoc = null;
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('email', email)]
      );
      
      if (response.documents.length > 0) {
        oldDoc = response.documents[0];
        addLog(`📄 ${email}: Found old doc ${oldDoc.$id}`, 'info');
      }
    } catch (error) {
      addLog(`⚠️ ${email}: Error searching - ${error.message}`, 'warning');
    }
    
    // Create new document with correct ID
    try {
      const newDoc = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        authId,
        {
          name: oldDoc?.name || name,
          email: email
        }
      );
      
      addLog(`✅ ${email}: Created new doc ${newDoc.$id}`, 'success');
      
      // Delete old document
      if (oldDoc && oldDoc.$id !== authId) {
        try {
          await databases.deleteDocument(DATABASE_ID, USERS_COLLECTION_ID, oldDoc.$id);
          addLog(`🗑️ ${email}: Deleted old doc ${oldDoc.$id}`, 'info');
        } catch (deleteError) {
          addLog(`⚠️ ${email}: Could not delete old doc`, 'warning');
        }
      }
      
      updateStats('migrated');
      
    } catch (createError) {
      if (createError.code === 409) {
        addLog(`ℹ️ ${email}: Already exists with correct ID`, 'info');
        updateStats('alreadyCorrect');
      } else {
        addLog(`❌ ${email}: Error - ${createError.message}`, 'error');
        updateStats('errors');
      }
    }
  };

  const runMigration = async () => {
    setIsRunning(true);
    setLogs([]);
    setStats({ total: 0, migrated: 0, alreadyCorrect: 0, errors: 0 });
    
    addLog('🚀 Starting User ID Migration...', 'info');
    
    try {
      // Initialize Appwrite with API Key
      const client = new Client()
        .setEndpoint(ENDPOINT)
        .setProject(PROJECT_ID)
        .setKey(API_KEY);
      
      const databases = new Databases(client);
      const users = new Users(client);
      
      addLog('📋 Fetching all Auth users...', 'info');
      const authUsers = await fetchAllAuthUsers(users);
      
      setStats(prev => ({ ...prev, total: authUsers.length }));
      addLog(`✅ Found ${authUsers.length} Auth users`, 'success');
      
      addLog('🔄 Processing users...', 'info');
      
      for (let i = 0; i < authUsers.length; i++) {
        const authUser = authUsers[i];
        addLog(`\n[${i + 1}/${authUsers.length}] ${authUser.email}`, 'info');
        
        try {
          await migrateUser(authUser, databases);
        } catch (error) {
          addLog(`❌ Error: ${error.message}`, 'error');
          updateStats('errors');
        }
        
        await sleep(100);
      }
      
      addLog('\n🎉 Migration Complete!', 'success');
      addLog(`📊 Total: ${authUsers.length} | Migrated: ${stats.migrated} | Already Correct: ${stats.alreadyCorrect} | Errors: ${stats.errors}`, 'info');
      
    } catch (error) {
      addLog(`❌ Migration failed: ${error.message}`, 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🔧 User ID Migration Tool
          </h1>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              ⚠️ Important Information
            </h2>
            <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>This script fixes ID mismatches between Auth users and database documents</li>
              <li>It will create new documents with correct IDs and delete old ones</li>
              <li>Run this ONCE to migrate existing users</li>
              <li>New users will automatically have correct IDs</li>
            </ul>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Total Users</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.migrated}</div>
              <div className="text-sm text-green-600 dark:text-green-400">Migrated</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.alreadyCorrect}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Already Correct</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.errors}</div>
              <div className="text-sm text-red-600 dark:text-red-400">Errors</div>
            </div>
          </div>

          {/* Run Button */}
          <button
            onClick={runMigration}
            disabled={isRunning}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
              isRunning
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isRunning ? '🔄 Migration Running...' : '🚀 Start Migration'}
          </button>

          {/* Logs */}
          {logs.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                📋 Migration Logs
              </h2>
              <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
                {logs.map((log, index) => (
                  <div key={index} className={`${getLogColor(log.type)} mb-1`}>
                    <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMigration;
