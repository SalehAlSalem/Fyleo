import React from 'react';
import { ModernCard } from '@shared/ui/modern/ModernComponents';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <ModernCard className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            🔒 سياسة خصوصية منصة Fyleo
          </h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center font-semibold">
              آخر تحديث: 20 أكتوبر 2025
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              خصوصيتك تهمنا. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدامك لمنصة Fyleo ("الخدمة") وفقاً لقانون المعاملات الإلكترونية وقانون حماية البيانات الشخصية في المملكة الأردنية الهاشمية.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                1. المعلومات التي نجمعها
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                نقوم بجمع الأنواع التالية من المعلومات ("البيانات" بالمعنى المقصود في قانون الجرائم الإلكترونية):
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 mr-6">
                <li><strong>المعلومات الشخصية التي تقدمها:</strong> الاسم والبريد الإلكتروني عند إنشاء الحساب. يتم التعامل مع كلمة المرور الخاصة بك وتخزينها بشكل آمن ومشفّر (Hashed باستخدام خوارزمية Bcrypt) ولا يمكننا الاطلاع عليها بأي شكل من الأشكال.</li>
                <li><strong>البيانات المجمعة تلقائياً:</strong> نقوم بجمع وتخزين عنوان بروتوكول الإنترنت (IP Address) الخاص بك و"خط سير بيانات الحركة" (تواريخ ووقت الدخول) في سجلات الخادم. يتم ذلك للأغراض الأمنية فقط، مثل الحماية من الاستخدام غير المصرح به وتشخيص المشاكل التقنية والتعاون مع السلطات عند الحاجة.</li>
                <li><strong>المحتوى الذي ترفعه:</strong> الملفات التعليمية والمنشورات التي تشاركها على المنصة، بما في ذلك البيانات الوصفية (metadata) مثل اسم الملف، الحجم، نوع الملف، وتاريخ الرفع.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                2. كيف نستخدم معلوماتك
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                نستخدم معلوماتك للأغراض التالية:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li>إنشاء وإدارة حسابك على المنصة</li>
                <li>التواصل معك بشأن الأمور الهامة المتعلقة بحسابك</li>
                <li>الحفاظ على أمن وسلامة المنصة ومنع الاستخدام غير المصرح به</li>
                <li>الامتثال للمتطلبات القانونية والتعاون مع السلطات المختصة</li>
                <li>تحسين جودة الخدمة وإصلاح الأخطاء التقنية</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                3. ملفات تعريف الارتباط (Cookies)
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                نحن نستخدم ملفات تعريف الارتباط للأغراض الضرورية فقط:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>Session Cookies:</strong> للحفاظ على جلسة تسجيل دخولك نشطة أثناء تصفحك للمنصة</li>
                <li><strong>Authentication Tokens:</strong> لتوثيق هويتك بشكل آمن عند كل طلب</li>
                <li><strong>Language Preference:</strong> لحفظ تفضيلات اللغة الخاصة بك</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                <strong>ملاحظة هامة:</strong> نحن لا نستخدم ملفات تعريف الارتباط لأغراض التتبع أو الإعلانات أو التحليلات التسويقية.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                4. تخزين البيانات والبنية التحتية التقنية
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                نستخدم خدمات موثوقة لتخزين بياناتك بشكل آمن:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 mr-6">
                <li><strong>Appwrite (قاعدة البيانات والمصادقة):</strong> نستخدم منصة Appwrite مفتوحة المصدر لإدارة قواعد البيانات وتوثيق الدخول. جميع البيانات مشفرة أثناء النقل (TLS/SSL) وفي حالة السكون (Encryption at Rest).</li>
                <li><strong>Oracle Cloud + MinIO (تخزين الملفات):</strong> الملفات التي ترفعها يتم تخزينها على خوادم Oracle Cloud باستخدام نظام MinIO. كل ملف يحصل على معرف فريد (UUID) ويتم تخزينه بشكل آمن مع صلاحيات وصول محددة.</li>
                <li><strong>تحليل الزوار:</strong> نحن لا نستخدم أي أدوات تحليل خارجية (مثل Google Analytics أو Facebook Pixel) لتتبع سلوك الزوار على المنصة.</li>
                <li><strong>مشاركة البيانات:</strong> نحن لا نقوم ببيع أو تأجير أو مشاركة معلوماتك الشخصية مع أي جهات خارجية لأغراض تسويقية أو إعلانية.</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 mb-4">
                🔐 5. الأمان والتشفير
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                نتخذ إجراءات أمنية صارمة لحماية بياناتك:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>تشفير كلمات المرور:</strong> باستخدام Bcrypt مع Salt Factor عالي</li>
                <li><strong>HTTPS/TLS:</strong> جميع الاتصالات مشفرة باستخدام بروتوكول TLS 1.3</li>
                <li><strong>Access Control:</strong> صلاحيات وصول محددة لكل مستخدم (Role-Based Access Control)</li>
                <li><strong>Session Management:</strong> جلسات آمنة مع انتهاء صلاحية تلقائي</li>
                <li><strong>File Validation:</strong> فحص جميع الملفات المرفوعة للتأكد من سلامتها</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                6. الاحتفاظ بالبيانات ومدة التخزين
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                نحتفظ ببياناتك للمدد التالية:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>بيانات الحساب:</strong> طالما كان حسابك نشطاً، أو حتى تطلب حذفه</li>
                <li><strong>سجلات IP والنشاط:</strong> 90 يوماً للأغراض الأمنية</li>
                <li><strong>الملفات المرفوعة:</strong> حتى تقوم بحذفها أو حذف حسابك</li>
                <li><strong>البيانات المطلوبة قانونياً:</strong> قد نحتفظ ببعض البيانات لفترة أطول إذا كان ذلك مطلوباً بموجب أمر قضائي</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg">
              <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-400 mb-4">
                ⚖️ 7. التعاون مع السلطات (إلزامي قانونياً)
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                وفقاً لقانون الجرائم الإلكترونية الأردني، نحن ملتزمون بالتعاون الكامل مع السلطات المختصة. في حال ورود طلب رسمي من النيابة العامة أو الجهات القضائية أو الأمنية، سنقوم بتوفير:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>بيانات المستخدم:</strong> الاسم، البريد الإلكتروني، تاريخ التسجيل</li>
                <li><strong>سجلات النشاط:</strong> عناوين IP ("العنوان البروتوكولي")، تواريخ ووقت الدخول ("خط سير بيانات الحركة")</li>
                <li><strong>المحتوى المنشور:</strong> نسخ من الملفات أو المنشورات المبلغ عنها</li>
                <li><strong>البيانات الوصفية:</strong> معلومات عن الملفات المرفوعة والتفاعلات</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                <strong>ملاحظة:</strong> لن نقوم بمشاركة أي بيانات إلا بموجب أمر قضائي رسمي أو طلب من جهة حكومية مختصة.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                8. حقوقك في البيانات الشخصية
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>الحق في الوصول:</strong> يمكنك طلب نسخة من جميع بياناتك الشخصية</li>
                <li><strong>الحق في التصحيح:</strong> يمكنك تعديل معلومات حسابك في أي وقت</li>
                <li><strong>الحق في الحذف:</strong> يمكنك حذف حسابك وجميع بياناتك بشكل دائم من خلال صفحة الإعدادات</li>
                <li><strong>الحق في الاعتراض:</strong> يمكنك الاعتراض على معالجة بياناتك لأغراض معينة</li>
                <li><strong>الحق في نقل البيانات:</strong> يمكنك طلب نسخة من بياناتك بصيغة قابلة للقراءة</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                للقيام بأي من ذلك، يرجى التواصل معنا عبر البريد الإلكتروني: <a href="mailto:fyleo.bawa3neh.97@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">fyleo.bawa3neh.97@gmail.com</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                9. حذف الحساب والبيانات
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                عند حذف حسابك، سنقوم بحذف:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li>جميع بياناتك الشخصية من قاعدة البيانات</li>
                <li>جميع الملفات التي رفعتها من خوادم التخزين (MinIO)</li>
                <li>جميع منشوراتك وتعليقاتك</li>
                <li>سجلات نشاطك (بعد 90 يوماً)</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                <strong>ملاحظة:</strong> قد نحتفظ ببعض البيانات المجهولة (Anonymous) لأغراض إحصائية أو إذا كان ذلك مطلوباً قانونياً.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                10. تحديثات سياسة الخصوصية
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                قد نقوم بتحديث هذه السياسة من وقت لآخر. سنقوم بإشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار على المنصة. استمرارك في استخدام المنصة بعد التحديثات يعني موافقتك على السياسة المحدثة.
              </p>
            </section>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

