/**
 * مساعد للتحميل مع دعم متصفحات مختلفة
 */

export class DownloadHelper {
  /**
   * تحميل ملف بطرق متعددة للتوافق مع جميع المتصفحات
   */
  static async downloadFile(url, filename = 'file') {
    console.log('🔧 DownloadHelper: Starting download...');
    console.log('📁 URL:', url);
    console.log('📄 Filename:', filename);
    
    // التحقق من المتصفح
    const userAgent = navigator.userAgent;
    console.log('🌐 Browser:', userAgent);
    
    // الطريقة الأولى: استخدام download attribute
    try {
      console.log('📥 Method 1: Using download attribute...');
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // إضافة الرابط للصفحة بشكل مؤقت
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // محاولة النقر
      link.click();
      
      // إزالة الرابط
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
      
      console.log('✅ Download method 1 completed');
      return true;
      
    } catch (error) {
      console.log('❌ Method 1 failed:', error);
    }
    
    // الطريقة الثانية: window.open
    try {
      console.log('📥 Method 2: Using window.open...');
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      if (newWindow) {
        console.log('✅ Download method 2 completed');
        return true;
      } else {
        console.log('❌ Method 2 failed: Popup blocked');
      }
    } catch (error) {
      console.log('❌ Method 2 failed:', error);
    }
    
    // الطريقة الثالثة: fetch + blob
    try {
      console.log('📥 Method 3: Using fetch + blob...');
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // تنظيف الذاكرة
      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 100);
      
      console.log('✅ Download method 3 completed');
      return true;
      
    } catch (error) {
      console.log('❌ Method 3 failed:', error);
    }
    
    // الطريقة الأخيرة: تغيير موقع الصفحة
    try {
      console.log('📥 Method 4: Using location.href...');
      window.location.href = url;
      console.log('✅ Download method 4 completed');
      return true;
    } catch (error) {
      console.log('❌ Method 4 failed:', error);
    }
    
    console.log('❌ All download methods failed');
    return false;
  }
  
  /**
   * التحقق من إمكانية التحميل
   */
  static checkDownloadCapability() {
    const capabilities = {
      downloadAttribute: 'download' in document.createElement('a'),
      windowOpen: typeof window.open === 'function',
      fetch: typeof fetch === 'function',
      blob: typeof Blob === 'function',
      createObjectURL: typeof URL.createObjectURL === 'function'
    };
    
    console.log('🔍 Browser download capabilities:', capabilities);
    return capabilities;
  }
}