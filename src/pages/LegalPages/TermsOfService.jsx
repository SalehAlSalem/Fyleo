import React from 'react';
import { useTranslation } from 'react-i18next';
import { ModernCard } from '@shared/ui/modern/ModernComponents';

const TermsOfService = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl" dir={isRTL ? 'rtl' : 'ltr'}>
        <ModernCard className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            📜 {t('legal.terms.title')}
          </h1>
          
          <div className={`prose dark:prose-invert max-w-none ${!isRTL ? 'text-left' : ''}`}>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center font-semibold">
              {t('legal.lastUpdated', { date: '20 October 2025' })}
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              {t('legal.terms.intro')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.terms.section1.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('legal.terms.section1.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.terms.section2.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('legal.terms.section2.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.terms.section3.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.terms.section3.content')}
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>{t('legal.terms.section3.legalCommitment')}</strong> {t('legal.terms.section3.legalCommitmentDesc')}
              </p>
            </section>

            <section className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
              <h2 className="text-2xl font-bold text-red-800 dark:text-red-400 mb-4">
                {t('legal.terms.section4.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.terms.section4.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 mr-6">
                <li><strong>{t('legal.terms.section4.pornographic')}</strong> {t('legal.terms.section4.pornographicDesc')}</li>
                <li><strong>{t('legal.terms.section4.falseNews')}</strong> {t('legal.terms.section4.falseNewsDesc')}</li>
                <li><strong>{t('legal.terms.section4.defamation')}</strong> {t('legal.terms.section4.defamationDesc')}</li>
                <li><strong>{t('legal.terms.section4.incitement')}</strong> {t('legal.terms.section4.incitementDesc')}</li>
                <li><strong>{t('legal.terms.section4.extortion')}</strong> {t('legal.terms.section4.extortionDesc')}</li>
                <li><strong>{t('legal.terms.section4.extremist')}</strong> {t('legal.terms.section4.extremistDesc')}</li>
                <li><strong>{t('legal.terms.section4.privacyViolation')}</strong> {t('legal.terms.section4.privacyViolationDesc')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.terms.section5.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.terms.section5.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6 mb-4">
                <li>{t('legal.terms.section5.point1')}</li>
                <li>{t('legal.terms.section5.point2')}</li>
                <li>{t('legal.terms.section5.point3')}</li>
                <li>{t('legal.terms.section5.point4')}</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('legal.terms.section5.email')} <a href={`mailto:${t('legal.contactEmail')}`} className="text-blue-600 dark:text-blue-400 hover:underline">{t('legal.contactEmail')}</a>
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
                {t('legal.terms.section5.commitment')}
              </p>
            </section>

            <section className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
              <h2 className="text-2xl font-bold text-red-800 dark:text-red-400 mb-4">
                {t('legal.terms.section6.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.terms.section6.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 mr-6">
                <li><strong className="text-red-600 dark:text-red-400">{t('legal.terms.section6.paidCourses')}</strong> {t('legal.terms.section6.paidCoursesDesc')}</li>
                <li><strong className="text-red-600 dark:text-red-400">{t('legal.terms.section6.personalAds')}</strong> {t('legal.terms.section6.personalAdsDesc')}</li>
                <li><strong className="text-red-600 dark:text-red-400">{t('legal.terms.section6.promoLinks')}</strong> {t('legal.terms.section6.promoLinksDesc')}</li>
                <li><strong className="text-red-600 dark:text-red-400">{t('legal.terms.section6.platformExploitation')}</strong> {t('legal.terms.section6.platformExploitationDesc')}</li>
                <li><strong className="text-red-600 dark:text-red-400">{t('legal.terms.section6.conditionalContent')}</strong> {t('legal.terms.section6.conditionalContentDesc')}</li>
              </ul>
              
              <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/40 rounded-lg">
                <h3 className="text-xl font-bold text-red-900 dark:text-red-300 mb-3">
                  {t('legal.terms.section6.penalties.title')}
                </h3>
                <ul className="list-disc list-inside text-gray-800 dark:text-gray-200 space-y-2 mr-6">
                  <li><strong>{t('legal.terms.section6.penalties.first')}</strong> {t('legal.terms.section6.penalties.firstDesc')}</li>
                  <li><strong>{t('legal.terms.section6.penalties.repeat')}</strong> {t('legal.terms.section6.penalties.repeatDesc')}</li>
                  <li><strong>{t('legal.terms.section6.penalties.multiple')}</strong> {t('legal.terms.section6.penalties.multipleDesc')}</li>
                  <li><strong>{t('legal.terms.section6.penalties.severe')}</strong> {t('legal.terms.section6.penalties.severeDesc')}</li>
                </ul>
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4 font-semibold">
                🎓 <strong>{t('legal.terms.section6.purpose')}</strong> {t('legal.terms.section6.purposeDesc')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.terms.section7.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('legal.terms.section7.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6 mt-2">
                <li><strong>{t('legal.terms.section7.userData')}</strong> {t('legal.terms.section7.userDataDesc')}</li>
                <li><strong>{t('legal.terms.section7.activityLogs')}</strong> {t('legal.terms.section7.activityLogsDesc')}</li>
                <li><strong>{t('legal.terms.section7.violatingContent')}</strong> {t('legal.terms.section7.violatingContentDesc')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.terms.section8.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('legal.terms.section8.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.terms.section9.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('legal.terms.section9.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.terms.section10.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('legal.terms.section10.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6 mt-2">
                <li>{t('legal.terms.section10.point1')}</li>
                <li>{t('legal.terms.section10.point2')}</li>
                <li><strong className="text-red-600 dark:text-red-400">{t('legal.terms.section10.point3')}</strong></li>
                <li>{t('legal.terms.section10.point4')}</li>
                <li>{t('legal.terms.section10.point5')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.terms.section11.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('legal.terms.section11.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6 mt-2">
                <li>{t('legal.terms.section11.law1')}</li>
                <li>{t('legal.terms.section11.law2')}</li>
                <li>{t('legal.terms.section11.law3')}</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                {t('legal.terms.section11.jurisdiction')}
              </p>
            </section>

            <section className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg">
              <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-400 mb-4">
                {t('legal.terms.warningBox.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('legal.terms.warningBox.content')}
              </p>
            </section>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default TermsOfService;

