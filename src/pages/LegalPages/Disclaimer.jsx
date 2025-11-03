import React from 'react';
import { useTranslation } from 'react-i18next';
import { ModernCard } from '@shared/ui/modern/ModernComponents';

const Disclaimer = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl" dir={isRTL ? 'rtl' : 'ltr'}>
        <ModernCard className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            ⚠️ {t('legal.disclaimer.title')}
          </h1>
          
          <div className={`prose dark:prose-invert max-w-none ${!isRTL ? 'text-left' : ''}`}>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center font-semibold">
              {t('legal.lastUpdated', { date: '20 October 2025' })}
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              {t('legal.disclaimer.intro')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.disclaimer.section1.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.disclaimer.section1.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>{t('legal.disclaimer.section1.userContent')}</strong> {t('legal.disclaimer.section1.userContentDesc')}</li>
                <li><strong>{t('legal.disclaimer.section1.technicalRole')}</strong> {t('legal.disclaimer.section1.technicalRoleDesc')}</li>
                <li><strong>{t('legal.disclaimer.section1.noReview')}</strong> {t('legal.disclaimer.section1.noReviewDesc')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.disclaimer.section2.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.disclaimer.section2.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>{t('legal.disclaimer.section2.personalOpinions')}</strong> {t('legal.disclaimer.section2.personalOpinionsDesc')}</li>
                <li><strong>{t('legal.disclaimer.section2.noVerification')}</strong> {t('legal.disclaimer.section2.noVerificationDesc')}</li>
                <li><strong>{t('legal.disclaimer.section2.updates')}</strong> {t('legal.disclaimer.section2.updatesDesc')}</li>
                <li><strong>{t('legal.disclaimer.section2.errors')}</strong> {t('legal.disclaimer.section2.errorsDesc')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.disclaimer.section3.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.disclaimer.section3.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>{t('legal.disclaimer.section3.easeOfAccess')}</strong> {t('legal.disclaimer.section3.easeOfAccessDesc')}</li>
                <li><strong>{t('legal.disclaimer.section3.noResponsibility')}</strong> {t('legal.disclaimer.section3.noResponsibilityDesc')}</li>
                <li><strong>{t('legal.disclaimer.section3.linkCheck')}</strong> {t('legal.disclaimer.section3.linkCheckDesc')}</li>
                <li><strong>{t('legal.disclaimer.section3.personalResponsibility')}</strong> {t('legal.disclaimer.section3.personalResponsibilityDesc')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.disclaimer.section4.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.disclaimer.section4.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>{t('legal.disclaimer.section4.academicDecisions')}</strong> {t('legal.disclaimer.section4.academicDecisionsDesc')}</li>
                <li><strong>{t('legal.disclaimer.section4.exams')}</strong> {t('legal.disclaimer.section4.examsDesc')}</li>
                <li><strong>{t('legal.disclaimer.section4.copyrights')}</strong> {t('legal.disclaimer.section4.copyrightsDesc')}</li>
                <li><strong>{t('legal.disclaimer.section4.damages')}</strong> {t('legal.disclaimer.section4.damagesDesc')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.disclaimer.section5.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.disclaimer.section5.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>{t('legal.disclaimer.section5.userResponsibility')}</strong> {t('legal.disclaimer.section5.userResponsibilityDesc')}</li>
                <li><strong>{t('legal.disclaimer.section5.reportResponse')}</strong> {t('legal.disclaimer.section5.reportResponseDesc')}</li>
                <li><strong>{t('legal.disclaimer.section5.fairUse')}</strong> {t('legal.disclaimer.section5.fairUseDesc')}</li>
                <li><strong>{t('legal.disclaimer.section5.reporting')}</strong> {t('legal.disclaimer.section5.reportingDesc')} <a href={`mailto:${t('legal.contactEmail')}`} className="text-blue-600 dark:text-blue-400 hover:underline">{t('legal.contactEmail')}</a></li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.disclaimer.section6.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.disclaimer.section6.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>{t('legal.disclaimer.section6.fileCheck')}</strong> {t('legal.disclaimer.section6.fileCheckDesc')}</li>
                <li><strong>{t('legal.disclaimer.section6.antivirusUse')}</strong> {t('legal.disclaimer.section6.antivirusUseDesc')}</li>
                <li><strong>{t('legal.disclaimer.section6.safeDownload')}</strong> {t('legal.disclaimer.section6.safeDownloadDesc')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.disclaimer.section7.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.disclaimer.section7.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li><strong>{t('legal.disclaimer.section7.noGuarantee')}</strong> {t('legal.disclaimer.section7.noGuaranteeDesc')}</li>
                <li><strong>{t('legal.disclaimer.section7.maintenance')}</strong> {t('legal.disclaimer.section7.maintenanceDesc')}</li>
                <li><strong>{t('legal.disclaimer.section7.technicalErrors')}</strong> {t('legal.disclaimer.section7.technicalErrorsDesc')}</li>
                <li><strong>{t('legal.disclaimer.section7.dataLoss')}</strong> {t('legal.disclaimer.section7.dataLossDesc')}</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg">
              <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-400 mb-4">
                {t('legal.disclaimer.warningBox.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.disclaimer.warningBox.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mr-6">
                <li>{t('legal.disclaimer.warningBox.point1')}</li>
                <li>{t('legal.disclaimer.warningBox.point2')}</li>
                <li>{t('legal.disclaimer.warningBox.point3')}</li>
                <li>{t('legal.disclaimer.warningBox.point4')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {t('legal.disclaimer.section8.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('legal.disclaimer.section8.content')}<br/>
                {t('legal.disclaimer.section8.email')} <a href={`mailto:${t('legal.contactEmail')}`} className="text-blue-600 dark:text-blue-400 hover:underline">{t('legal.contactEmail')}</a>
              </p>
            </section>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default Disclaimer;

