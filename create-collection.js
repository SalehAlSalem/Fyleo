// إنشاء Collection في Appwrite
import { Client, Databases, ID } from 'appwrite';

const client = new Client()
  .setEndpoint('https://fyleo.appwrite.network/v1')
  .setProject('68d9740b0012416cb71b');

const databases = new Databases(client);

async function createFilesCollection() {
  try {
    console.log('🔄 إنشاء Collection files...');
    
    const response = await databases.createCollection(
      '68d97982002b686c7151', // Database ID
      'files', // Collection ID
      'Files' // Collection Name
    );
    
    console.log('✅ تم إنشاء Collection بنجاح:', response);
    
    // إضافة Attributes
    await databases.createStringAttribute(
      '68d97982002b686c7151',
      'files',
      'title',
      255,
      true
    );
    
    await databases.createStringAttribute(
      '68d97982002b686c7151',
      'files',
      'description',
      1000,
      false
    );
    
    await databases.createStringAttribute(
      '68d97982002b686c7151',
      'files',
      'fileId',
      255,
      true
    );
    
    await databases.createStringAttribute(
      '68d97982002b686c7151',
      'files',
      'fileName',
      255,
      true
    );
    
    await databases.createIntegerAttribute(
      '68d97982002b686c7151',
      'files',
      'fileSize',
      true
    );
    
    await databases.createStringAttribute(
      '68d97982002b686c7151',
      'files',
      'mimeType',
      100,
      true
    );
    
    await databases.createStringAttribute(
      '68d97982002b686c7151',
      'files',
      'category',
      100,
      true
    );
    
    await databases.createStringAttribute(
      '68d97982002b686c7151',
      'files',
      'uploadedBy',
      255,
      true
    );
    
    await databases.createStringAttribute(
      '68d97982002b686c7151',
      'files',
      'downloadURL',
      500,
      true
    );
    
    console.log('✅ تم إضافة جميع Attributes بنجاح');
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء Collection:', error);
  }
}

createFilesCollection();
