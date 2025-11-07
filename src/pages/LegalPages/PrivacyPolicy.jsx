import React from 'react';
import { useTranslation } from 'react-i18next';
import { ModernCard } from '@shared/ui/modern/ModernComponents';

const PrivacyPolicy = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl" dir={isRTL ? 'rtl' : 'ltr'}>
        <ModernCard className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            🔒 {t('legal.privacy.title')}
          </h1>
          
          <div className={`prose dark:prose-invert max-w-none ${!isRTL ? 'text-left' : ''}`}>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center font-semibold">
              {t('legal.lastUpdated', { date: '20 October 2025' })}
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              {t('legal.privacy.intro')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.privacy.section1.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.privacy.section1.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 mr-6">
                <li><strong>{t('legal.privacy.section1.personalInfo')}</strong> {t('legal.privacy.section1.personalInfoDesc')}</li>
                <li><strong>{t('legal.privacy.section1.autoCollected')}</strong> {t('legal.privacy.section1.autoCollectedDesc')}</li>
                <li><strong>{t('legal.privacy.section1.uploadedContent')}</strong> {t('legal.privacy.section1.uploadedContentDesc')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.privacy.section2.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.privacy.section2.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li>{t('legal.privacy.section2.point1')}</li>
                <li>{t('legal.privacy.section2.point2')}</li>
                <li>{t('legal.privacy.section2.point3')}</li>
                <li>{t('legal.privacy.section2.point4')}</li>
                <li>{t('legal.privacy.section2.point5')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.privacy.section3.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.privacy.section3.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong><span dir="ltr" className="inline-block">{t('legal.privacy.section3.sessionCookies')}</span></strong> {t('legal.privacy.section3.sessionCookiesDesc')}</li>
                <li><strong><span dir="ltr" className="inline-block">{t('legal.privacy.section3.authTokens')}</span></strong> {t('legal.privacy.section3.authTokensDesc')}</li>
                <li><strong><span dir="ltr" className="inline-block">{t('legal.privacy.section3.langPreference')}</span></strong> {t('legal.privacy.section3.langPreferenceDesc')}</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                <strong>{t('legal.privacy.section3.note')}</strong> {t('legal.privacy.section3.noteDesc')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.privacy.section4.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.privacy.section4.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 mr-6">
                <li><strong><span dir="ltr" className="inline-block">{t('legal.privacy.section4.appwrite')}</span></strong> {t('legal.privacy.section4.appwriteDesc')}</li>
                <li><strong><span dir="ltr" className="inline-block">{t('legal.privacy.section4.oracle')}</span></strong> {t('legal.privacy.section4.oracleDesc')}</li>
                <li><strong>{t('legal.privacy.section4.analytics')}</strong> {t('legal.privacy.section4.analyticsDesc')}</li>
                <li><strong>{t('legal.privacy.section4.dataSharing')}</strong> {t('legal.privacy.section4.dataSharingDesc')}</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 mb-4">
                {t('legal.privacy.section5.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.privacy.section5.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 mr-6">
                <li><strong>{t('legal.privacy.section5.passwordEncryption')}</strong> {t('legal.privacy.section5.passwordEncryptionDesc')}</li>
                <li><strong><span dir="ltr" className="inline-block">{t('legal.privacy.section5.httpsTLS')}</span></strong> {t('legal.privacy.section5.httpsTLSDesc')}</li>
                <li><strong>{t('legal.privacy.section5.accessControl')}</strong> {t('legal.privacy.section5.accessControlDesc')}</li>
                <li><strong><span dir="ltr" className="inline-block">{t('legal.privacy.section5.sessionManagement')}</span></strong> {t('legal.privacy.section5.sessionManagementDesc')}</li>
                <li><strong>{t('legal.privacy.section5.fileValidation')}</strong> {t('legal.privacy.section5.fileValidationDesc')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.privacy.section6.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.privacy.section6.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>{t('legal.privacy.section6.accountData')}</strong> {t('legal.privacy.section6.accountDataDesc')}</li>
                <li><strong>{t('legal.privacy.section6.ipLogs')}</strong> {t('legal.privacy.section6.ipLogsDesc')}</li>
                <li><strong>{t('legal.privacy.section6.uploadedFiles')}</strong> {t('legal.privacy.section6.uploadedFilesDesc')}</li>
                <li><strong>{t('legal.privacy.section6.legalData')}</strong> {t('legal.privacy.section6.legalDataDesc')}</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg">
              <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-400 mb-4">
                {t('legal.privacy.section7.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.privacy.section7.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>{t('legal.privacy.section7.userData')}</strong> {t('legal.privacy.section7.userDataDesc')}</li>
                <li><strong>{t('legal.privacy.section7.activityLogs')}</strong> {t('legal.privacy.section7.activityLogsDesc')}</li>
                <li><strong>{t('legal.privacy.section7.publishedContent')}</strong> {t('legal.privacy.section7.publishedContentDesc')}</li>
                <li><strong>{t('legal.privacy.section7.metadata')}</strong> {t('legal.privacy.section7.metadataDesc')}</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                <strong>{t('legal.privacy.section7.note')}</strong> {t('legal.privacy.section7.noteDesc')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.privacy.section8.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.privacy.section8.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>{t('legal.privacy.section8.accessRight')}</strong> {t('legal.privacy.section8.accessRightDesc')}</li>
                <li><strong>{t('legal.privacy.section8.correctionRight')}</strong> {t('legal.privacy.section8.correctionRightDesc')}</li>
                <li><strong>{t('legal.privacy.section8.deletionRight')}</strong> {t('legal.privacy.section8.deletionRightDesc')}</li>
                <li><strong>{t('legal.privacy.section8.objectionRight')}</strong> {t('legal.privacy.section8.objectionRightDesc')}</li>
                <li><strong>{t('legal.privacy.section8.portabilityRight')}</strong> {t('legal.privacy.section8.portabilityRightDesc')}</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                {t('legal.privacy.section8.contactInfo')} <a href={`mailto:${t('legal.contactEmail')}`} className="text-blue-600 dark:text-blue-400 hover:underline">{t('legal.contactEmail')}</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.privacy.section9.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.privacy.section9.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li>{t('legal.privacy.section9.point1')}</li>
                <li>{t('legal.privacy.section9.point2')}</li>
                <li>{t('legal.privacy.section9.point3')}</li>
                <li>{t('legal.privacy.section9.point4')}</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                <strong>{t('legal.privacy.section9.note')}</strong> {t('legal.privacy.section9.noteDesc')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.privacy.section10.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('legal.privacy.section10.content')}
              </p>
            </section>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

