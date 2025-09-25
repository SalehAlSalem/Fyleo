// اختبار سريع لـ Cloudinary upload
import { uploadToCloudinary } from '../../Cloudinary/index.mjs';

// تحقق من متغيرات البيئة
console.log('🔧 Cloudinary Configuration Test');
console.log('Cloud Name:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
console.log('Upload Preset:', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
console.log('Auto Approve:', import.meta.env.VITE_AUTO_APPROVE);

// تحقق من الفولدر
console.log('📁 Expected folder structure: fyleo/uploads/academics');

export default function CloudinaryTest() {
  const handleTestUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('📤 Testing upload for file:', file.name);
    console.log('📊 File type:', file.type);
    console.log('📏 File size:', (file.size / 1024 / 1024).toFixed(2), 'MB');

    try {
      // تجربة Upload مباشرة
      file._folder = 'fyleo/uploads/academics'; // تحديد المجلد
      const result = await uploadToCloudinary(file);
      
      console.log('✅ Upload successful!');
      console.log('🔗 URL:', result.secure_url);
      console.log('📂 Folder:', result.folder);
      console.log('🆔 Public ID:', result.public_id);
      
      // عرض رابط للاختبار
      const testUrl = result.secure_url;
      const linkElement = document.createElement('a');
      linkElement.href = testUrl;
      linkElement.target = '_blank';
      linkElement.textContent = 'اختبر الرابط: ' + result.public_id;
      linkElement.style.display = 'block';
      linkElement.style.margin = '10px 0';
      linkElement.style.color = '#0066cc';
      
      document.getElementById('test-results').appendChild(linkElement);
      
    } catch (error) {
      console.error('❌ Upload failed:', error);
      
      const errorDiv = document.createElement('div');
      errorDiv.style.color = 'red';
      errorDiv.style.margin = '10px 0';
      errorDiv.textContent = `خطأ: ${error.message}`;
      
      document.getElementById('test-results').appendChild(errorDiv);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🧪 اختبار Cloudinary Upload</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>📋 إعدادات Cloudinary:</h3>
        <ul>
          <li><strong>Cloud Name:</strong> {import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '❌ غير محدد'}</li>
          <li><strong>Upload Preset:</strong> {import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '❌ غير محدد'}</li>
          <li><strong>Auto Approve:</strong> {import.meta.env.VITE_AUTO_APPROVE || 'true'}</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="test-file" style={{ display: 'block', marginBottom: '10px' }}>
          📁 اختر ملف للاختبار (PDF, صورة، أو فيديو):
        </label>
        <input
          id="test-file"
          type="file"
          onChange={handleTestUpload}
          accept=".pdf,.jpg,.jpeg,.png,.gif,.mp4,.mov,.doc,.docx"
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <div id="test-results" style={{ marginTop: '20px' }}>
        <h3>📊 نتائج الاختبار:</h3>
      </div>
    </div>
  );
}