import React from 'react';
import { ArrowRight, Download, Users, Star, BookOpen, Award, TrendingUp } from 'lucide-react';
import ModernNavBar from '../../components/ModernNavBar';
import AnimatedLogo from '../../components/AnimatedLogo';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './ModernLandingPage.css';

const ModernLandingPage = () => {
  const featuresRef = useScrollAnimation();
  const statsRef = useScrollAnimation();
  const testimonialsRef = useScrollAnimation();
  const partnersRef = useScrollAnimation();

  return (
    <div className="modern-landing-page">
      <ModernNavBar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-logo">
            <AnimatedLogo />
          </div>
          
          <div className="hero-text">
            <h1 className="hero-title">
              مشاركة
              <span className="gradient-text"> ذكية</span>
              <br />
              للمواد التعليمية
            </h1>
            
            <p className="hero-subtitle">
              منصة حديثة لمشاركة وتنظيم المواد التعليمية مع واجهة بسيطة وتجربة مستخدم استثنائية
            </p>
            
            <div className="hero-buttons">
              <button className="btn-primary">
                <span>ابدأ الآن</span>
                <ArrowRight size={20} />
              </button>
              
              <button className="btn-secondary">
                <Download size={20} />
                <span>تحميل التطبيق</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating Cards */}
        <div className="floating-cards">
          <div className="floating-card card-1">
            <BookOpen size={24} />
            <span>مكتبة ضخمة</span>
          </div>
          
          <div className="floating-card card-2">
            <Users size={24} />
            <span>مجتمع نشط</span>
          </div>
          
          <div className="floating-card card-3">
            <Star size={24} />
            <span>محتوى عالي الجودة</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" ref={featuresRef}>
        <div className="container">
          <div className="section-header">
            <h2>لماذا فايليو؟</h2>
            <p>اكتشف المميزات التي تجعل تجربتك التعليمية أفضل</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <BookOpen size={32} />
              </div>
              <h3>مكتبة شاملة</h3>
              <p>آلاف المواد التعليمية في جميع التخصصات</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <h3>مشاركة سهلة</h3>
              <p>شارك ملفاتك مع زملائك بضغطة واحدة</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Star size={32} />
              </div>
              <h3>تقييم الجودة</h3>
              <p>نظام تقييم ذكي لضمان جودة المحتوى</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Award size={32} />
              </div>
              <h3>شهادات معتمدة</h3>
              <p>احصل على شهادات إنجاز للمواد المكتملة</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">طالب نشط</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">مادة تعليمية</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">200+</div>
              <div className="stat-label">جامعة</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">4.9</div>
              <div className="stat-label">تقييم المستخدمين</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" ref={testimonialsRef}>
        <div className="container">
          <div className="section-header">
            <h2>ماذا يقول المستخدمون؟</h2>
            <p>تجارب حقيقية من طلاب وأساتذة يستخدمون فايليو</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-text">
                "فايليو غيّر طريقة دراستي بالكامل. أصبح العثور على المواد التعليمية والمشاركة مع الزملاء أسهل بكثير."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <span>أ</span>
                </div>
                <div className="author-info">
                  <div className="author-name">أحمد محمد</div>
                  <div className="author-title">طالب هندسة - الجامعة الأردنية</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-text">
                "كأستاذة، فايليو سهّل علي مشاركة المحاضرات والتفاعل مع الطلاب. نظام تنظيم المواد ممتاز."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <span>د</span>
                </div>
                <div className="author-info">
                  <div className="author-name">د. فاطمة العلي</div>
                  <div className="author-title">أستاذة الرياضيات - جامعة دمشق</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-text">
                "المنصة سهلة الاستخدام وتوفر كل ما أحتاجه كطالب. التصميم جميل والتجربة سلسة جداً."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <span>س</span>
                </div>
                <div className="author-info">
                  <div className="author-name">سارة أحمد</div>
                  <div className="author-title">طالبة طب - الجامعة اللبنانية</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* University Partners Section */}
      <section className="partners-section" ref={partnersRef}>
        <div className="container">
          <div className="section-header">
            <h2>شركاؤنا في التعليم</h2>
            <p>نتعاون مع أفضل الجامعات والمؤسسات التعليمية في المنطقة</p>
          </div>
          
          <div className="partners-grid">
            <div className="partner-logo">
              <div className="partner-placeholder">الجامعة الأردنية</div>
            </div>
            <div className="partner-logo">
              <div className="partner-placeholder">جامعة دمشق</div>
            </div>
            <div className="partner-logo">
              <div className="partner-placeholder">الجامعة اللبنانية</div>
            </div>
            <div className="partner-logo">
              <div className="partner-placeholder">جامعة القاهرة</div>
            </div>
            <div className="partner-logo">
              <div className="partner-placeholder">جامعة الملك سعود</div>
            </div>
            <div className="partner-logo">
              <div className="partner-placeholder">الجامعة الأمريكية</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>ابدأ رحلتك التعليمية اليوم</h2>
            <p>انضم إلى آلاف الطلاب والأساتذة في منصة فايليو</p>
            
            <div className="cta-buttons">
              <button className="btn-primary large">
                <span>إنشاء حساب جديد</span>
                <ArrowRight size={20} />
              </button>
              
              <button className="btn-outline large">
                تصفح المواد
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernLandingPage;