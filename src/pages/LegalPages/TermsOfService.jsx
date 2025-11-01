import React from 'react';
import { ModernCard } from '@shared/ui/modern/ModernComponents';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <ModernCard className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            📜 شروط استخدام منصة Fyleo
          </h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center font-semibold">
              آخر تحديث: 20 أكتوبر 2025
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              أهلاً بك في Fyleo. باستخدامك لمنصتنا ("الخدمة")، فإنك توافق على الالتزام بهذه الشروط والأحكام ("الشروط") وجميع القوانين السارية في المملكة الأردنية الهاشمية، بما في ذلك قانون الجرائم الإلكترونية رقم (17) لسنة 2023 وقانون المعاملات الإلكترونية.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                1. الأهلية القانونية (الحد الأدنى للعمر)
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                يجب ألا يقل عمرك عن 18 عاماً لإنشاء حساب واستخدام هذه الخدمة. باستخدامك للمنصة، فإنك تقر وتضمن أنك تبلغ من العمر 18 عاماً على الأقل وأن لديك الأهلية القانونية الكاملة للموافقة على هذه الشروط والالتزام بالقوانين الأردنية.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                2. وصف الخدمة
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Fyleo هي منصة تعليمية إلكترونية، مفتوحة المصدر، تهدف إلى تمكين المستخدمين من مشاركة الملفات التعليمية ومصادر الدراسة ("المحتوى") لأغراض تعليمية بحتة. المنصة تعمل كـ "نظام معلومات" و"شبكة معلوماتية" بالمعنى المقصود في قانون الجرائم الإلكترونية الأردني.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                3. مسؤولية المستخدم والمحتوى
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                أنت وحدك المسؤول مسؤولية كاملة عن أي محتوى تقوم برفعه أو مشاركته. وتقر بأنك تملك جميع الحقوق اللازمة التي تسمح لك بمشاركة هذا المحتوى، وأن محتواك لا ينتهك أي قوانين سارية في المملكة الأردنية الهاشمية.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>التزامك القانوني:</strong> بموجب قانون الجرائم الإلكترونية الأردني، أنت مسؤول قانونياً عن أي محتوى تنشره، وقد تتعرض للمساءلة القانونية في حال نشر محتوى مخالف.
              </p>
            </section>

            <section className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
              <h2 className="text-2xl font-bold text-red-800 dark:text-red-400 mb-4">
                ⚠️ 4. المحتوى المحظور (إلزامي قانونياً)
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                وفقاً لقانون الجرائم الإلكترونية الأردني رقم (17) لسنة 2023، يُحظر بشكل صارم نشر أو مشاركة أي محتوى يتضمن:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 mr-6">
                <li><strong>المحتوى الإباحي أو الفاضح:</strong> أي محتوى يتعلق بالدعارة أو الفجور أو يخدش الحياء العام (المادة 14 - عقوبة: 6 أشهر + 9,000-15,000 دينار)</li>
                <li><strong>الأخبار الكاذبة:</strong> نشر معلومات كاذبة أو مضللة تستهدف الأمن الوطني أو السلم المجتمعي (المادة 15 - عقوبة: 3 أشهر + 5,000-20,000 دينار)</li>
                <li><strong>القدح والذم:</strong> أي محتوى يتضمن إهانة أو تشهير أو اغتيال شخصية الآخرين (المواد 15 و 16 - عقوبة: 3 أشهر + 5,000-20,000 دينار)</li>
                <li><strong>إثارة الفتنة والكراهية:</strong> المحتوى الذي يثير النعرات الطائفية أو العرقية أو يحض على الكراهية أو العنف (المادة 17 - عقوبة: 1-3 سنوات + 5,000-20,000 دينار)</li>
                <li><strong>الابتزاز الإلكتروني:</strong> أي محاولة لابتزاز أو تهديد الآخرين (المادة 18 - عقوبة: سنة + 3,000-6,000 دينار)</li>
                <li><strong>المحتوى المتطرف:</strong> الترويج للأسلحة أو المتفجرات أو الأفكار المتطرفة (المادة 19 - عقوبة: سنتين + 10,000-30,000 دينار)</li>
                <li><strong>انتهاك الخصوصية:</strong> نشر صور أو فيديوهات خاصة دون إذن (المادة 20 - عقوبة: 3 أشهر + 20,000-40,000 دينار)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                5. سياسة حقوق النشر (الإبلاغ والحذف)
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                نحن نحترم حقوق الملكية الفكرية وفقاً لقانون حماية حق المؤلف الأردني. إذا كنت تعتقد أن محتوى ما ينتهك حقوقك، يرجى إرسال بلاغ مفصل يتضمن:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6 mb-4">
                <li>وصفاً دقيقاً للعمل المنتهك</li>
                <li>رابط المحتوى على المنصة</li>
                <li>إثبات ملكيتك للحقوق</li>
                <li>معلومات الاتصال الخاصة بك</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                البريد الإلكتروني: <a href="mailto:fyleo.bawa3neh.97@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">fyleo.bawa3neh.97@gmail.com</a>
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
                نتعهد بمراجعة البلاغات وإزالة المحتوى المخالف خلال 48 ساعة من استلام البلاغ.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                6. التعاون مع السلطات
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                نحن ملتزمون بالتعاون الكامل مع السلطات الأردنية المختصة. في حال ورود طلب رسمي من النيابة العامة أو الجهات القضائية، سنقوم بتوفير:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6 mt-2">
                <li><strong>بيانات المستخدم:</strong> الاسم، البريد الإلكتروني، تاريخ التسجيل</li>
                <li><strong>سجلات النشاط:</strong> عناوين IP، تواريخ الدخول، المحتوى المنشور</li>
                <li><strong>المحتوى المخالف:</strong> نسخ من الملفات أو المنشورات المبلغ عنها</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                7. إخلاء المسؤولية عن الضمانات
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                الخدمة مقدمة "كما هي" و "كما هي متاحة" دون أي ضمانات من أي نوع. نحن لا نضمن أن الخدمة ستكون آمنة، أو خالية من الأخطاء، أو أن المحتوى المتاح عليها دقيق أو موثوق. المحتوى المنشور يعبر عن آراء ناشريه وليس بالضرورة عن رأي المنصة.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                8. حدود المسؤولية
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                لن يكون مالك Fyleo مسؤولاً بأي حال من الأحوال عن أي أضرار مباشرة أو غير مباشرة تنشأ عن استخدامك أو عدم قدرتك على استخدام الخدمة، أو عن أي محتوى تم الحصول عليه من خلالها. المستخدم يتحمل كامل المسؤولية القانونية عن أفعاله على المنصة.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                9. إنهاء الحساب
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                نحتفظ بالحق في تعليق أو إنهاء حسابك فوراً ودون إشعار مسبق في حال:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6 mt-2">
                <li>انتهاك أي من هذه الشروط</li>
                <li>نشر محتوى محظور قانونياً</li>
                <li>تلقي شكاوى متكررة ضدك</li>
                <li>استخدام المنصة لأغراض غير قانونية</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                10. القانون الحاكم والاختصاص القضائي
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                تخضع هذه الشروط وتُفسر وفقًا لقوانين المملكة الأردنية الهاشمية، بما في ذلك:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6 mt-2">
                <li>قانون الجرائم الإلكترونية رقم (17) لسنة 2023</li>
                <li>قانون المعاملات الإلكترونية</li>
                <li>قانون حماية حق المؤلف</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                تختص المحاكم الأردنية بالنظر في أي نزاع ينشأ عن استخدام هذه المنصة.
              </p>
            </section>

            <section className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg">
              <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-400 mb-4">
                ⚠️ تنبيه قانوني هام
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                باستخدامك لهذه المنصة، فإنك تقر بأنك قرأت وفهمت جميع الشروط أعلاه، وتوافق على الالتزام بالقوانين الأردنية. أي مخالفة لهذه الشروط قد تعرضك للمساءلة القانونية والعقوبات المنصوص عليها في قانون الجرائم الإلكترونية الأردني.
              </p>
            </section>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default TermsOfService;

