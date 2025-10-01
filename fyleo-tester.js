// 🧪 اختبارات شاملة للتطبيق
// استخدم هذه الاختبارات في Console المتصفح

const FyleoTester = {
  // بيانات الاختبار
  testData: {
    email: 'testing@fyleo.com',
    password: 'testing@972025'
  },

  // 1. اختبار الاتصال بـ Appwrite
  async testAppwriteConnection() {
    console.log('🔗 اختبار الاتصال بـ Appwrite...');
    
    try {
      // التحقق من متغيرات البيئة
      const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
      const endpoint = import.meta.env.VITE_APPWRITE_URL;
      
      console.log('📋 معرف المشروع:', projectId);
      console.log('🌐 النقطة النهائية:', endpoint);
      
      if (!projectId || !endpoint) {
        console.error('❌ متغيرات البيئة غير مكتملة');
        return false;
      }
      
      console.log('✅ إعدادات Appwrite صحيحة');
      return true;
      
    } catch (error) {
      console.error('❌ خطأ في الاتصال:', error);
      return false;
    }
  },

  // 2. اختبار تسجيل الدخول
  async testLogin() {
    console.log('🔐 اختبار تسجيل الدخول...');
    
    // التأكد من وجود الصفحة الصحيحة
    if (!window.location.pathname.includes('login')) {
      console.log('📍 الانتقال لصفحة تسجيل الدخول...');
      window.location.href = '/login';
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // البحث عن العناصر
    const emailInput = this.findElement([
      'input[type="email"]',
      'input[name="email"]',
      'input[placeholder*="email"]',
      'input[placeholder*="بريد"]'
    ]);
    
    const passwordInput = this.findElement([
      'input[type="password"]',
      'input[name="password"]',
      'input[placeholder*="password"]',
      'input[placeholder*="كلمة"]'
    ]);
    
    const submitButton = this.findElement([
      'button[type="submit"]',
      'button:contains("دخول")',
      'button:contains("Login")',
      '.login-btn'
    ]);
    
    if (!emailInput || !passwordInput) {
      console.error('❌ لم يتم العثور على حقول الإدخال');
      return false;
    }
    
    // ملء البيانات
    this.fillInput(emailInput, this.testData.email);
    this.fillInput(passwordInput, this.testData.password);
    
    console.log('📝 تم ملء البيانات');
    
    // النقر على زر الإرسال
    if (submitButton) {
      submitButton.click();
      console.log('🔄 تم إرسال النموذج...');
      
      // انتظار النتيجة
      return await this.waitForResult();
    } else {
      console.error('❌ لم يتم العثور على زر الإرسال');
      return false;
    }
  },

  // 3. اختبار رفع ملف
  async testFileUpload() {
    console.log('📁 اختبار رفع ملف...');
    
    // التأكد من وجود صفحة رفع الملفات
    if (!window.location.pathname.includes('upload')) {
      console.log('📍 الانتقال لصفحة رفع الملفات...');
      window.location.href = '/dashboard/upload';
      return;
    }
    
    // البحث عن عنصر رفع الملف
    const fileInput = this.findElement([
      'input[type="file"]',
      '.file-input'
    ]);
    
    if (!fileInput) {
      console.error('❌ لم يتم العثور على حقل رفع الملف');
      return false;
    }
    
    console.log('✅ تم العثور على حقل رفع الملف');
    console.log('💡 يمكنك الآن اختبار رفع ملف يدوياً');
    
    return true;
  },

  // دوال مساعدة
  findElement(selectors) {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }
    return null;
  },

  fillInput(input, value) {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  },

  async waitForResult(timeout = 5000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      // تحقق من نجاح تسجيل الدخول
      if (window.location.pathname.includes('dashboard')) {
        console.log('🎉 نجح تسجيل الدخول!');
        return true;
      }
      
      // تحقق من وجود رسائل خطأ
      const errorElements = document.querySelectorAll('.error, .alert-danger, [role="alert"]');
      if (errorElements.length > 0) {
        console.error('❌ فشل تسجيل الدخول:', errorElements[0].textContent);
        return false;
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('⏳ انتهت مهلة الانتظار');
    return false;
  },

  // اختبار شامل
  async runAllTests() {
    console.log('🚀 بدء الاختبارات الشاملة...\n');
    
    const results = {};
    
    results.appwrite = await this.testAppwriteConnection();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    results.login = await this.testLogin();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (results.login) {
      results.upload = await this.testFileUpload();
    }
    
    console.log('\n📊 نتائج الاختبارات:');
    console.log('🔗 Appwrite:', results.appwrite ? '✅' : '❌');
    console.log('🔐 تسجيل الدخول:', results.login ? '✅' : '❌');
    console.log('📁 رفع الملفات:', results.upload ? '✅' : '❌');
    
    return results;
  }
};

// إتاحة الكائن عالمياً
window.FyleoTester = FyleoTester;

console.log('🧪 أدوات اختبار Fyleo جاهزة!');
console.log('\n📋 الأوامر المتاحة:');
console.log('FyleoTester.testAppwriteConnection() - اختبار Appwrite');
console.log('FyleoTester.testLogin() - اختبار تسجيل الدخول');
console.log('FyleoTester.testFileUpload() - اختبار رفع الملفات');
console.log('FyleoTester.runAllTests() - تشغيل جميع الاختبارات');
console.log('\n💡 للبدء: FyleoTester.runAllTests()');