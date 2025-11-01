import React from 'react';
import { ModernCard } from '@shared/ui/modern/ModernComponents';

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <ModernCard className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            ⚠️ إخلاء المسؤولية
          </h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center font-semibold">
              آخر تحديث: 20 أكتوبر 2025
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              المعلومات والمواد المتاحة على منصة Fyleo ("نظام المعلومات" و"الشبكة المعلوماتية" بالمعنى المقصود في قانون الجرائم الإلكترونية الأردني) مقدمة من قبل مستخدمي المنصة وهي لأغراض تعليمية وتبادل معرفي فقط.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                1. طبيعة المنصة ودور المستخدمين
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Fyleo هي منصة تعليمية تعمل كـ "مزود خدمة" (Service Provider) بالمعنى المقصود في قانون الجرائم الإلكترونية. نحن نوفر البنية التحتية التقنية فقط، بينما المحتوى يتم إنشاؤه ورفعه من قبل المستخدمين.
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>المحتوى من المستخدمين:</strong> جميع الملفات والمنشورات والروابط المتاحة على المنصة يتم رفعها ومشاركتها من قبل المستخدمين المسجلين</li>
                <li><strong>دورنا التقني:</strong> نوفر نظام تخزين الملفات (MinIO + Oracle Cloud)، قاعدة البيانات (Appwrite)، ونظام المصادقة فقط</li>
                <li><strong>عدم المراجعة المسبقة:</strong> لا نقوم بمراجعة أو فحص المحتوى قبل نشره، ولكننا نستجيب للبلاغات فوراً</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                2. دقة المحتوى وموثوقيته
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Fyleo لا تضمن دقة، اكتمال، أو فائدة أي من الملفات أو الروابط أو المعلومات المنشورة:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>آراء شخصية:</strong> كل المحتوى يعبر عن آراء ناشريه من المستخدمين وليس بالضرورة عن رأي المنصة أو إدارتها</li>
                <li><strong>عدم التحقق:</strong> لا نتحقق من صحة المعلومات الأكاديمية أو العلمية المنشورة</li>
                <li><strong>التحديثات:</strong> المحتوى قد يكون قديماً أو غير محدث، ولا نضمن تحديثه</li>
                <li><strong>الأخطاء:</strong> قد يحتوي المحتوى على أخطاء علمية أو معلومات غير دقيقة</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                3. الروابط الخارجية والمواقع الإلكترونية
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                قد تحتوي المنصة على روابط لمواقع إلكترونية خارجية ("الموقع الإلكتروني" بالمعنى القانوني):
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>سهولة الوصول فقط:</strong> هذه الروابط متوفرة لسهولة الوصول للمستخدمين فقط</li>
                <li><strong>عدم المسؤولية:</strong> Fyleo ليست مسؤولة عن محتوى أو سياسات الخصوصية أو ممارسات تلك المواقع</li>
                <li><strong>فحص الروابط:</strong> نستخدم Google Safe Browsing API لفحص الروابط، لكن لا نضمن أمان جميع الروابط</li>
                <li><strong>المسؤولية الشخصية:</strong> زيارتك لأي موقع خارجي تكون على مسؤوليتك الخاصة</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                4. استخدام على مسؤوليتك الشخصية
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                إن استخدامك لأي محتوى أو الاعتماد عليه من خلال المنصة يقع على مسؤوليتك الشخصية الكاملة:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>القرارات الأكاديمية:</strong> لا تعتمد على المحتوى المنشور في اتخاذ قرارات أكاديمية مهمة دون التحقق من مصادر رسمية</li>
                <li><strong>الامتحانات:</strong> المحتوى لا يغني عن المراجع الرسمية والكتب المعتمدة من الجامعة</li>
                <li><strong>حقوق النشر:</strong> تأكد من أن استخدامك للمحتوى لا ينتهك حقوق الملكية الفكرية</li>
                <li><strong>الأضرار:</strong> Fyleo تخلي مسؤوليتها عن أي خسائر أو أضرار مادية أو معنوية قد تنجم عن استخدام المحتوى</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                5. حقوق الملكية الفكرية
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                بخصوص حقوق النشر والملكية الفكرية:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>مسؤولية المستخدم:</strong> المستخدم الذي يرفع المحتوى هو المسؤول عن التأكد من عدم انتهاك حقوق النشر</li>
                <li><strong>الاستجابة للبلاغات:</strong> نستجيب فوراً لأي بلاغ عن انتهاك حقوق النشر ونحذف المحتوى المخالف خلال 48 ساعة</li>
                <li><strong>الاستخدام العادل:</strong> المحتوى المنشور يجب أن يكون للأغراض التعليمية ضمن مبدأ "الاستخدام العادل"</li>
                <li><strong>الإبلاغ:</strong> إذا وجدت محتوى ينتهك حقوقك، يرجى الإبلاغ عنه فوراً عبر <a href="mailto:fyleo.bawa3neh.97@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">fyleo.bawa3neh.97@gmail.com</a></li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                6. الأمان والفيروسات
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                بخصوص أمان الملفات المرفوعة:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>فحص الملفات:</strong> نقوم بفحص نوع الملفات (File Type Validation) لكننا لا نضمن خلوها من الفيروسات أو البرمجيات الخبيثة</li>
                <li><strong>استخدام برامج الحماية:</strong> ننصح بشدة باستخدام برامج مكافحة الفيروسات قبل فتح أي ملف</li>
                <li><strong>التحميل الآمن:</strong> تأكد من تحميل الملفات من مصادر موثوقة فقط</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                7. التوفر والأداء التقني
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                بخصوص توفر الخدمة والأداء:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>عدم ضمان التوفر:</strong> لا نضمن أن المنصة ستكون متاحة 24/7 دون انقطاع</li>
                <li><strong>الصيانة:</strong> قد نقوم بإيقاف الخدمة مؤقتاً للصيانة أو التحديثات</li>
                <li><strong>الأخطاء التقنية:</strong> قد تحدث أخطاء تقنية أو مشاكل في الأداء</li>
                <li><strong>فقدان البيانات:</strong> ننصح بالاحتفاظ بنسخ احتياطية من ملفاتك المهمة</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg">
              <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-400 mb-4">
                ⚠️ تنبيه قانوني هام
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                المحتوى المتاح على المنصة مقدم من المستخدمين ولأغراض تعليمية فقط:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li>يجب عليك التحقق من دقة المعلومات قبل الاعتماد عليها في أي قرارات أكاديمية أو مهنية</li>
                <li>أنت مسؤول قانونياً عن أي محتوى تنشره وفقاً لقانون الجرائم الإلكترونية الأردني</li>
                <li>استخدامك للمنصة يعني موافقتك على تحمل المسؤولية الكاملة عن أفعالك</li>
                <li>في حال وجود أي محتوى مخالف، يرجى الإبلاغ عنه فوراً</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                8. التواصل والاستفسارات
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                لأي استفسارات أو بلاغات عن محتوى مخالف، يرجى التواصل معنا عبر:<br/>
                البريد الإلكتروني: <a href="mailto:fyleo.bawa3neh.97@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">fyleo.bawa3neh.97@gmail.com</a>
              </p>
            </section>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default Disclaimer;

