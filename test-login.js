// 🧪 اختبار تلقائي لتسجيل الدخول
// تشغل هذا في Console المتصفح للاختبار السريع

console.log('🚀 بدء اختبار تسجيل الدخول...');

// بيانات الاختبار
const testCredentials = {
  email: 'testing@fyleo.com',
  password: 'testing@972025'
};

// دالة الاختبار
async function testLogin() {
  try {
    console.log('📧 محاولة تسجيل الدخول بـ:', testCredentials.email);
    
    // البحث عن حقول الإدخال
    const emailInput = document.querySelector('input[type="email"], input[name="email"]');
    const passwordInput = document.querySelector('input[type="password"], input[name="password"]');
    const loginButton = document.querySelector('button[type="submit"], button:contains("دخول")');
    
    if (!emailInput || !passwordInput) {
      console.error('❌ لم يتم العثور على حقول تسجيل الدخول');
      console.log('💡 تأكد أنك في صفحة تسجيل الدخول: http://localhost:5173/login');
      return;
    }
    
    // ملء البيانات
    emailInput.value = testCredentials.email;
    passwordInput.value = testCredentials.password;
    
    // تحفيز events
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    console.log('✅ تم ملء البيانات');
    
    // انقر زر تسجيل الدخول
    if (loginButton) {
      loginButton.click();
      console.log('🔄 تم النقر على زر تسجيل الدخول...');
      
      // انتظار النتيجة
      setTimeout(() => {
        if (window.location.pathname.includes('dashboard')) {
          console.log('🎉 نجح تسجيل الدخول! تم التوجيه للوحة التحكم');
        } else if (document.querySelector('.error, .alert-error')) {
          console.log('❌ فشل تسجيل الدخول - تحقق من رسالة الخطأ');
        } else {
          console.log('⏳ لا يزال في انتظار النتيجة...');
        }
      }, 3000);
      
    } else {
      console.error('❌ لم يتم العثور على زر تسجيل الدخول');
    }
    
  } catch (error) {
    console.error('💥 خطأ في الاختبار:', error);
  }
}

// دالة للتحقق من حالة التطبيق
function checkAppStatus() {
  console.log('🔍 فحص حالة التطبيق...');
  console.log('📍 الصفحة الحالية:', window.location.href);
  console.log('🧩 عنصر React متوفر:', !!window.React);
  console.log('🔗 Router متوفر:', !!window.location);
  
  // التحقق من Appwrite
  if (window.appwrite) {
    console.log('✅ Appwrite متصل');
  } else {
    console.log('⚠️ Appwrite غير متوفر في window');
  }
  
  // التحقق من وجود أخطاء
  const errors = document.querySelectorAll('.error, .alert-danger, [role="alert"]');
  if (errors.length > 0) {
    console.log('⚠️ أخطاء موجودة في الصفحة:', errors.length);
    errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error.textContent}`);
    });
  } else {
    console.log('✅ لا توجد أخطاء ظاهرة');
  }
}

// تشغيل الاختبارات
console.log('\n📋 قائمة الأوامر المتاحة:');
console.log('checkAppStatus() - فحص حالة التطبيق');
console.log('testLogin() - اختبار تسجيل الدخول التلقائي');
console.log('\n💡 للبدء، انسخ والصق: checkAppStatus()');

// فحص تلقائي عند التحميل
checkAppStatus();