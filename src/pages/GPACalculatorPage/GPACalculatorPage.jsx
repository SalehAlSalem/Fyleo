import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './GPACalculatorPage.css';

/**
 * 🎯 Fyleo GPA Calculator - Ultra Creative Design
 * Inspired by Fyleo's vibrant gradient: Orange → Purple → Blue
 * Precision: 0.001 (1/1000)
 */
const GPACalculatorPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const resultsRef = useRef(null);

  // State Management
  const [gpaScale, setGpaScale] = useState(4);
  const [previousGPA, setPreviousGPA] = useState('');
  const [previousHours, setPreviousHours] = useState('');
  const [isFirstYear, setIsFirstYear] = useState(false);
  const [courses, setCourses] = useState([
    { id: 1, grade: '', hours: 3, isRetake: false, oldGrade: '' },
    { id: 2, grade: '', hours: 3, isRetake: false, oldGrade: '' },
    { id: 3, grade: '', hours: 3, isRetake: false, oldGrade: '' },
    { id: 4, grade: '', hours: 3, isRetake: false, oldGrade: '' },
    { id: 5, grade: '', hours: 3, isRetake: false, oldGrade: '' },
  ]);
  
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Scroll to results when available
  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [results]);

  // Handlers
  const handleScaleChange = (scale) => {
    setGpaScale(scale);
    setPreviousGPA('');
    setPreviousHours('');
    setCourses(courses.map(c => ({ ...c, grade: '' })));
    setResults(null);
  };

  const handleFirstYearToggle = () => {
    const newValue = !isFirstYear;
    setIsFirstYear(newValue);
    if (newValue) {
      setPreviousGPA('0');
      setPreviousHours('0');
    } else {
      setPreviousGPA('');
      setPreviousHours('');
    }
  };

  const handleCourseChange = (index, field, value) => {
    const updated = [...courses];
    updated[index] = { ...updated[index], [field]: value };
    setCourses(updated);
  };

  const handleRetakeToggle = (index) => {
    const updated = [...courses];
    updated[index] = { 
      ...updated[index], 
      isRetake: !updated[index].isRetake,
      oldGrade: !updated[index].isRetake ? '' : updated[index].oldGrade
    };
    setCourses(updated);
  };

  const addCourse = () => {
    setCourses([...courses, { 
      id: courses.length + 1, 
      grade: '', 
      hours: 3,
      isRetake: false,
      oldGrade: ''
    }]);
  };

  const removeCourse = (index) => {
    if (courses.length > 1) {
      setCourses(courses.filter((_, i) => i !== index));
    }
  };

  // Validation
  const validate = () => {
    const prevGPA = parseFloat(previousGPA);
    const prevHrs = parseFloat(previousHours);

    // Check previous GPA
    if (isNaN(prevGPA) || prevGPA < 0) {
      alert(isArabic 
        ? 'الرجاء إدخال المعدل السابق بشكل صحيح' 
        : 'Please enter a valid previous GPA');
      return false;
    }

    // Check previous hours
    if (isNaN(prevHrs) || prevHrs < 0) {
      alert(isArabic 
        ? 'الرجاء إدخال عدد الساعات السابقة بشكل صحيح' 
        : 'Please enter valid previous hours');
      return false;
    }

    // Check if previous GPA exceeds scale
    if (prevGPA > gpaScale) {
      alert(isArabic 
        ? `المعدل السابق لا يمكن أن يتجاوز ${gpaScale}` 
        : `GPA cannot exceed ${gpaScale}`);
      return false;
    }

    // Check courses - only validate non-empty courses
    const validCoursesCount = courses.filter(c => c.grade !== '').length;
    
    if (validCoursesCount === 0) {
      alert(isArabic 
        ? 'الرجاء إدخال درجة مادة واحدة على الأقل' 
        : 'Please enter at least one course grade');
      return false;
    }

    for (let i = 0; i < courses.length; i++) {
      const grade = parseFloat(courses[i].grade);
      const hours = parseFloat(courses[i].hours);

      // Skip empty courses
      if (courses[i].grade === '' || courses[i].grade === null) continue;

      // Validate grade
      if (isNaN(grade) || grade < 0 || grade > gpaScale) {
        alert(isArabic 
          ? `المادة ${i + 1}: الدرجة يجب أن تكون بين 0 و ${gpaScale}` 
          : `Course ${i + 1}: Grade must be between 0 and ${gpaScale}`);
        return false;
      }

      // Validate hours
      if (isNaN(hours) || hours <= 0 || hours > 10) {
        alert(isArabic 
          ? `المادة ${i + 1}: عدد الساعات يجب أن يكون بين 1 و 10` 
          : `Course ${i + 1}: Credit hours must be between 1 and 10`);
        return false;
      }
    }

    return true;
  };

  // Calculate GPA with animation
  const calculateGPA = async () => {
    if (!validate()) return;

    setIsCalculating(true);
    
    // Simulate calculation delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, 600));

    const prevGPA = parseFloat(previousGPA);
    const prevHrs = parseFloat(previousHours);

    // Filter only courses with grades entered
    const validCourses = courses.filter(c => {
      return c.grade !== '' && c.grade !== null && !isNaN(parseFloat(c.grade));
    });

    if (validCourses.length === 0) {
      alert(isArabic 
        ? 'الرجاء إدخال درجة مادة واحدة على الأقل' 
        : 'Please enter at least one course');
      setIsCalculating(false);
      return;
    }

    let totalPoints = 0;
    let totalHours = 0;

    validCourses.forEach(course => {
      const grade = parseFloat(course.grade);
      const hours = parseFloat(course.hours);
      totalPoints += grade * hours;
      totalHours += hours;
    });

    const semesterGPA = totalPoints / totalHours;
    
    // Handle retaken courses - subtract old grade impact from previous GPA
    let adjustedPreviousPoints = prevGPA * prevHrs;
    let adjustedPreviousHours = prevHrs;
    
    validCourses.forEach(course => {
      if (course.isRetake && course.oldGrade && parseFloat(course.oldGrade) >= 0) {
        const oldGradeValue = parseFloat(course.oldGrade);
        const hours = parseFloat(course.hours);
        adjustedPreviousPoints -= (oldGradeValue * hours);
        adjustedPreviousHours -= hours;
      }
    });
    
    const newTotalPoints = adjustedPreviousPoints + totalPoints;
    const newTotalHours = adjustedPreviousHours + totalHours;
    const cumulativeGPA = newTotalPoints / newTotalHours;

    let status = 'stable';
    let difference = 0;
    
    if (prevGPA > 0) {
      difference = cumulativeGPA - prevGPA;
      if (difference > 0.001) status = 'increased';
      else if (difference < -0.001) status = 'decreased';
    }

    setResults({
      semesterGPA: semesterGPA.toFixed(3),
      cumulativeGPA: cumulativeGPA.toFixed(3),
      totalHours: newTotalHours,
      status,
      difference: Math.abs(difference).toFixed(3),
      progress: Math.min((cumulativeGPA / gpaScale) * 100, 100).toFixed(1)
    });

    setIsCalculating(false);
  };

  const reset = () => {
    setPreviousGPA('');
    setPreviousHours('');
    setIsFirstYear(false);
    setCourses([
      { id: 1, grade: '', hours: 3, isRetake: false, oldGrade: '' },
      { id: 2, grade: '', hours: 3, isRetake: false, oldGrade: '' },
      { id: 3, grade: '', hours: 3, isRetake: false, oldGrade: '' },
      { id: 4, grade: '', hours: 3, isRetake: false, oldGrade: '' },
      { id: 5, grade: '', hours: 3, isRetake: false, oldGrade: '' },
    ]);
    setResults(null);
  };

  return (
    <div className="gpa-page">
      {/* Animated Background */}
      <div className="gpa-bg-animation">
        <div className="gpa-orb gpa-orb-orange"></div>
        <div className="gpa-orb gpa-orb-purple"></div>
        <div className="gpa-orb gpa-orb-blue"></div>
      </div>

      <div className="gpa-container">
        
        {/* Animated Header with 3D Effect */}
        <div className="gpa-header">
          <div className="gpa-logo-wrapper">
            <div className="gpa-logo-glow"></div>
            <div className="gpa-logo">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
              </svg>
            </div>
          </div>
          <h1 className="gpa-title gradient-text">
            {isArabic ? 'برنامج حساب المعدل التراكمي' : 'Cumulative GPA Calculator'}
          </h1>
          <p className="gpa-subtitle">
            {isArabic 
              ? 'يدعم البرنامج حساب المعدل التراكمي من 4 ويحسب المعدل من 5 وأيضاً حساب المعدل من 100 بشكل دقيق وسريع.' 
              : 'This tool supports calculating GPA out of 4, out of 5, and out of 100 quickly and accurately.'}
          </p>
          <div className="gpa-precision-badge">
            <span className="badge-icon">⚡</span>
            <span>{isArabic ? 'دقة 1/1000' : 'Precision 1/1000'}</span>
          </div>
        </div>

        {/* Glass Card Container */}
        <div className="gpa-glass-card">
          
          {/* GPA Scale Selection - Modern Pills */}
          <div className="gpa-section">
            <label className="gpa-label">
              <span className="label-icon">⚙️</span>
              {isArabic ? 'نظام المعدل:' : 'GPA Scale:'}
            </label>
            <div className="scale-pills">
              <button 
                className={`scale-pill ${gpaScale === 4 ? 'active' : ''}`}
                onClick={() => handleScaleChange(4)}
              >
                <span className="pill-number">4.0</span>
                <span className="pill-label">{isArabic ? 'من 4' : 'Out of 4'}</span>
              </button>
              <button 
                className={`scale-pill ${gpaScale === 5 ? 'active' : ''}`}
                onClick={() => handleScaleChange(5)}
              >
                <span className="pill-number">5.0</span>
                <span className="pill-label">{isArabic ? 'من 5' : 'Out of 5'}</span>
              </button>
              <button 
                className={`scale-pill ${gpaScale === 100 ? 'active' : ''}`}
                onClick={() => handleScaleChange(100)}
              >
                <span className="pill-number">100</span>
                <span className="pill-label">{isArabic ? 'من 100' : 'Out of 100'}</span>
              </button>
            </div>
          </div>

          {/* Previous Semester - Neumorphic Inputs */}
          <div className="gpa-section">
            <div className="section-header">
              <label className="gpa-label">
                <span className="label-icon">📚</span>
                {isArabic ? 'المعدل والساعات السابقة' : 'Previous GPA & Hours'}
              </label>
              <button 
                className={`first-year-toggle ${isFirstYear ? 'active' : ''}`}
                onClick={handleFirstYearToggle}
              >
                <span className="toggle-icon">🎓</span>
                {isArabic ? 'سنة أولى' : 'First Year'}
              </button>
            </div>
            
            <div className="input-grid">
              <div className="input-floating">
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  max={gpaScale}
                  value={previousGPA}
                  onChange={(e) => setPreviousGPA(e.target.value)}
                  placeholder=" "
                  disabled={isFirstYear}
                  className="floating-input"
                />
                <label className="floating-label">
                  {isArabic ? 'معدلك التراكمي قبل الفصل الحالي' : 'Your cumulative GPA before this semester'}
                </label>
                <span className="input-icon">📊</span>
              </div>
              
              <div className="input-floating">
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={previousHours}
                  onChange={(e) => setPreviousHours(e.target.value)}
                  placeholder=" "
                  disabled={isFirstYear}
                  className="floating-input"
                />
                <label className="floating-label">
                  {isArabic ? 'عدد الساعات التي قطعتها قبل الفصل الحالي' : 'Number of credit hours completed before this semester'}
                </label>
                <span className="input-icon">⏱️</span>
              </div>
            </div>
          </div>

          {/* Courses Table - Modern Design */}
          <div className="gpa-section">
            <label className="gpa-label">
              <span className="label-icon">📝</span>
              {isArabic ? 'علامات مواد الفصل الحالي' : 'Current Semester Courses'}
            </label>
            
            <div className="courses-modern">
              {courses.map((course, index) => (
                <div key={course.id} className="course-card">
                  <div className="course-number-badge">
                    <span>{index + 1}</span>
                  </div>
                  
                  <div className="course-inputs">
                    <div className="input-floating small">
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        max={gpaScale}
                        value={course.grade}
                        onChange={(e) => handleCourseChange(index, 'grade', e.target.value)}
                        placeholder=" "
                        className="floating-input"
                      />
                      <label className="floating-label">
                        {isArabic ? 'العلامة الجديدة' : 'New Grade'}
                      </label>
                    </div>
                    
                    <div className="input-floating small">
                      <select
                        value={course.hours}
                        onChange={(e) => handleCourseChange(index, 'hours', parseInt(e.target.value))}
                        className="floating-input"
                      >
                        {[1, 2, 3, 4, 5, 6].map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                      <label className="floating-label">
                        {isArabic ? 'عدد الساعات' : 'Credit Hours'}
                      </label>
                    </div>
                  </div>
                  
                  {/* Retake Toggle - Creative Design */}
                  <div className="retake-toggle-wrapper">
                    <button
                      className={`retake-toggle ${course.isRetake ? 'active' : ''}`}
                      onClick={() => handleRetakeToggle(index)}
                      type="button"
                    >
                      <span className="toggle-icon">🔄</span>
                      <span className="toggle-text">
                        {isArabic ? 'مادة معادة' : 'Retake Course'}
                      </span>
                      <div className="toggle-switch">
                        <div className="toggle-slider"></div>
                      </div>
                    </button>
                  </div>
                  
                  {/* Old Grade Input - Slide Down Animation */}
                  <div className={`old-grade-container ${course.isRetake ? 'expanded' : ''}`}>
                    <div className="old-grade-content">
                      <div className="old-grade-label">
                        <span className="label-icon">📋</span>
                        <span>{isArabic ? 'العلامة القديمة للمادة' : 'Previous Grade'}</span>
                      </div>
                      <div className="input-floating small">
                        <input
                          type="number"
                          step="0.001"
                          min="0"
                          max={gpaScale}
                          value={course.oldGrade}
                          onChange={(e) => handleCourseChange(index, 'oldGrade', e.target.value)}
                          placeholder=" "
                          className="floating-input old-grade-input"
                        />
                        <label className="floating-label">
                          {isArabic ? 'العلامة القديمة' : 'Old Grade'}
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {courses.length > 1 && (
                    <button
                      className="course-remove-btn"
                      onClick={() => removeCourse(index)}
                      title="Remove"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              
              <button className="add-course-modern" onClick={addCourse}>
                <span className="add-icon">+</span>
                <span>{isArabic ? 'إضافة مادة' : 'Add Course'}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons - Gradient Magic */}
          <div className="gpa-actions">
            <button 
              className={`btn-calculate ${isCalculating ? 'calculating' : ''}`} 
              onClick={calculateGPA}
              disabled={isCalculating}
            >
              {isCalculating ? (
                <>
                  <span className="spinner"></span>
                  <span>{isArabic ? 'جاري الحساب...' : 'Calculating...'}</span>
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  <span>{isArabic ? 'احسب معدلك التراكمي' : 'Calculate Your GPA'}</span>
                </>
              )}
            </button>
            
            <button className="btn-reset" onClick={reset}>
              <span className="btn-icon">🔄</span>
              <span>{isArabic ? 'إعادة تعيين' : 'Reset'}</span>
            </button>
          </div>

        </div>

        {/* Results Section - Ultra Creative */}
        {results && (
          <div className="gpa-results" ref={resultsRef}>
            
            {/* Results Header */}
            <div className="results-hero">
              <div className="results-icon-wrapper">
                {results.status === 'increased' && (
                  <div className="results-icon success">
                    <span>🎉</span>
                  </div>
                )}
                {results.status === 'decreased' && (
                  <div className="results-icon warning">
                    <span>💪</span>
                  </div>
                )}
                {results.status === 'stable' && (
                  <div className="results-icon neutral">
                    <span>⚖️</span>
                  </div>
                )}
              </div>
              
              <h2 className="results-title">{isArabic ? 'النتائج' : 'Results'}</h2>
              
              <div className="status-message">
                {results.status === 'increased' && (
                  <p className="status-text success">
                    {isArabic 
                      ? `ممتاز! معدلك ارتفع بمقدار ${results.difference}` 
                      : `Excellent! Your GPA increased by ${results.difference}`}
                  </p>
                )}
                {results.status === 'decreased' && (
                  <p className="status-text warning">
                    {isArabic 
                      ? `انخفض بمقدار ${results.difference} - واصل الجهد!` 
                      : `Decreased by ${results.difference} - Keep pushing!`}
                  </p>
                )}
                {results.status === 'stable' && (
                  <p className="status-text neutral">
                    {isArabic ? 'معدلك مستقر - عمل رائع!' : 'Your GPA is stable - Great work!'}
                  </p>
                )}
              </div>
            </div>

            {/* Results Cards with 3D Effect */}
            <div className="results-grid">
              <div className="result-card-3d primary">
                <div className="card-glow"></div>
                <div className="card-content">
                  <div className="card-icon">🎯</div>
                  <div className="card-label">{isArabic ? 'معدل الفصل الحالي' : 'Current Semester GPA'}</div>
                  <div className="card-value">{results.semesterGPA}</div>
                  <div className="card-scale">/ {gpaScale}.000</div>
                </div>
              </div>

              <div className="result-card-3d primary">
                <div className="card-glow"></div>
                <div className="card-content">
                  <div className="card-icon">📊</div>
                  <div className="card-label">{isArabic ? 'المعدل التراكمي' : 'Cumulative GPA'}</div>
                  <div className="card-value">{results.cumulativeGPA}</div>
                  <div className="card-scale">/ {gpaScale}.000</div>
                </div>
              </div>

              <div className="result-card-3d">
                <div className="card-content">
                  <div className="card-icon">⏱️</div>
                  <div className="card-label">{isArabic ? 'مجموع الساعات' : 'Total Hours'}</div>
                  <div className="card-value">{results.totalHours}</div>
                  <div className="card-unit">{isArabic ? 'ساعة' : 'Hours'}</div>
                </div>
              </div>

              {parseFloat(previousGPA) > 0 && (
                <div className={`result-card-3d ${results.status}`}>
                  <div className="card-content">
                    <div className="card-icon">
                      {results.status === 'increased' && '📈'}
                      {results.status === 'decreased' && '📉'}
                      {results.status === 'stable' && '➡️'}
                    </div>
                    <div className="card-label">{isArabic ? 'التغيير' : 'Change'}</div>
                    <div className="card-value">
                      {results.status === 'increased' && '+'}
                      {results.status === 'decreased' && '-'}
                      {results.difference}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Animated Progress Bar */}
            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-label">
                  {isArabic ? 'التقدم الإجمالي' : 'Overall Progress'}
                </span>
                <span className="progress-percent">{results.progress}%</span>
              </div>
              <div className="progress-bar-modern">
                <div 
                  className="progress-fill-modern" 
                  style={{ width: `${results.progress}%` }}
                >
                  <div className="progress-shimmer"></div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default GPACalculatorPage;
