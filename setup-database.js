// 🚀 سكريبت إنشاء Collections في Appwrite
// تشغل هذا السكريبت مرة واحدة فقط لإعداد قاعدة البيانات

import { Client, Databases, Permission, Role } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('68d9740b0012416cb71b'); // Project ID

const databases = new Databases(client);
const databaseId = '68d97982002b686c7151';

// إنشاء Collection للملفات
async function createFilesCollection() {
    try {
        await databases.createCollection(
            databaseId,
            'files',
            'Files'
        );
        
        // إضافة Attributes
        await databases.createStringAttribute(databaseId, 'files', 'name', 255, true);
        await databases.createStringAttribute(databaseId, 'files', 'description', 1000, false);
        await databases.createStringAttribute(databaseId, 'files', 'fileId', 255, true);
        await databases.createStringAttribute(databaseId, 'files', 'fileName', 255, true);
        await databases.createIntegerAttribute(databaseId, 'files', 'fileSize', true);
        await databases.createStringAttribute(databaseId, 'files', 'fileType', 100, true);
        await databases.createStringAttribute(databaseId, 'files', 'category', 100, true);
        await databases.createStringAttribute(databaseId, 'files', 'subject', 100, true);
        await databases.createStringAttribute(databaseId, 'files', 'uploaderId', 255, true);
        await databases.createStringAttribute(databaseId, 'files', 'uploaderName', 255, true);
        await databases.createIntegerAttribute(databaseId, 'files', 'downloadCount', false, 0);
        await databases.createBooleanAttribute(databaseId, 'files', 'isPublic', true, true);
        
        console.log('✅ Files collection created successfully');
    } catch (error) {
        console.log('❌ Error creating files collection:', error.message);
    }
}

// إنشاء Collection للمفضلة
async function createBookmarksCollection() {
    try {
        await databases.createCollection(
            databaseId,
            'bookmarks',
            'Bookmarks'
        );
        
        await databases.createStringAttribute(databaseId, 'bookmarks', 'userId', 255, true);
        await databases.createStringAttribute(databaseId, 'bookmarks', 'fileId', 255, true);
        
        console.log('✅ Bookmarks collection created successfully');
    } catch (error) {
        console.log('❌ Error creating bookmarks collection:', error.message);
    }
}

// إنشاء Collection للتحميلات
async function createDownloadsCollection() {
    try {
        await databases.createCollection(
            databaseId,
            'downloads',
            'Downloads'
        );
        
        await databases.createStringAttribute(databaseId, 'downloads', 'userId', 255, true);
        await databases.createStringAttribute(databaseId, 'downloads', 'fileId', 255, true);
        await databases.createDatetimeAttribute(databaseId, 'downloads', 'downloadedAt', true);
        
        console.log('✅ Downloads collection created successfully');
    } catch (error) {
        console.log('❌ Error creating downloads collection:', error.message);
    }
}

// إنشاء Collection لملفات المستخدمين
async function createUserProfilesCollection() {
    try {
        await databases.createCollection(
            databaseId,
            'user_profiles',
            'User Profiles'
        );
        
        await databases.createStringAttribute(databaseId, 'user_profiles', 'userId', 255, true);
        await databases.createStringAttribute(databaseId, 'user_profiles', 'bio', 500, false);
        await databases.createStringAttribute(databaseId, 'user_profiles', 'university', 255, false);
        await databases.createStringAttribute(databaseId, 'user_profiles', 'major', 255, false);
        
        console.log('✅ User profiles collection created successfully');
    } catch (error) {
        console.log('❌ Error creating user profiles collection:', error.message);
    }
}

// تشغيل جميع الوظائف
async function setupDatabase() {
    console.log('🚀 بدء إعداد قاعدة البيانات...');
    
    await createFilesCollection();
    await createBookmarksCollection();
    await createDownloadsCollection();
    await createUserProfilesCollection();
    
    console.log('🎉 تم الانتهاء من إعداد قاعدة البيانات!');
}

// تشغيل الإعداد
setupDatabase();