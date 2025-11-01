import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './GPACalculatorPage.css';

/**
 * GPA Calculator Page - Standalone
 * Supports GPA calculation for scales: 4.0, 5.0, and 100
 */
const GPACalculatorPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const resultsRef = useRef(null);

  // GPA Scale: 4, 5, or 100
  const [gpaScale, setGpaScale] = useState(4);
  
  // Previous semester data
  const [previousGPA, setPreviousGPA] = useState('');
  const [previousHours, setPreviousHours] = useState('');
  
  // Current semester courses (7 default rows)
  const [courses, setCourses] = useState(
    Array(7).fill(null).map((_, i) => ({
      id: i + 1,
      grade: '',
      hours: 3,
      isRepeated: false,
      previousGrade: ''
    }))
  );

  // Results
  const [semesterGPA, setSemesterGPA] = useState(null);
  const [newCumulativeGPA, setNewCumulativeGPA] = useState(null);
  const [newTotalHours, setNewTotalHours] = useState(null);
  const [gpaStatus, setGpaStatus] = useState(null); // 'increased', 'decreased', 'stable'
  const [showResults, setShowResults] = useState(false);

  // First year mode
  const [isFirstYear, setIsFirstYear] = useState(false);

  const handleFirstYearClick = () => {
    setIsFirstYear(true);
    setPreviousGPA('0');
    setPreviousHours('0');
  };

  const handleScaleChange = (scale) => {
    setGpaScale(scale);
    // Reset all inputs when scale changes
    setPreviousGPA('');
    setPreviousHours('');
    setCourses(courses.map(c => ({ ...c, grade: '', previousGrade: '' })));
    setShowResults(false);
  };

  const handleCourseChange = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  };

  const addCourse = () => {
    setCourses([...courses, {
      id: courses.length + 1,
      grade: '',
      hours: 3,
      isRepeated: false,
      previousGrade: ''
    }]);
  };

  const removeCourse = (index) => {
    if (courses.length > 1) {
      setCourses(courses.filter((_, i) => i !== index));
    }
  };

  const validateInput = () => {
    const prevGPA = parseFloat(previousGPA);
    const prevHrs = parseFloat(previousHours);

    // Validate previous GPA
    if (isNaN(prevGPA) || prevGPA < 0) {
      alert(t('gpa.validGPARequired'));
      return false;
    }

    if (gpaScale === 4 && prevGPA > 4) {
      alert(t('gpa.gpaMustBeBetween0And4'));
      return false;
    }
    if (gpaScale === 5 && prevGPA > 5) {
      alert(t('gpa.gpaMustBeBetween0And5'));
      return false;
    }
    if (gpaScale === 100 && prevGPA > 100) {
      alert(t('gpa.gpaMustBeBetween0And100'));
      return false;
    }

    // Validate previous hours
    if (isNaN(prevHrs) || prevHrs < 0) {
      alert(t('gpa.validHoursRequired'));
      return false;
    }

    // Validate current courses
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      const grade = parseFloat(course.grade);
      const hours = parseFloat(course.hours);

      if (course.grade !== '' && !isNaN(grade)) {
        if (gpaScale === 4 && (grade < 0 || grade > 4)) {
          alert(t('gpa.courseGradeMustBeBetween', { number: i + 1, min: 0, max: 4 }));
          return false;
        }
        if (gpaScale === 5 && (grade < 0 || grade > 5)) {
          alert(t('gpa.courseGradeMustBeBetween', { number: i + 1, min: 0, max: 5 }));
          return false;
        }
        if (gpaScale === 100 && (grade < 0 || grade > 100)) {
          alert(t('gpa.courseGradeMustBeBetween', { number: i + 1, min: 0, max: 100 }));
          return false;
        }

        if (isNaN(hours) || hours <= 0) {
          alert(t('gpa.courseHoursMustBeGreater', { number: i + 1 }));
          return false;
        }

        // If repeated, validate previous grade
        if (course.isRepeated) {
          const prevGrade = parseFloat(course.previousGrade);
          if (isNaN(prevGrade) || prevGrade < 0) {
            alert(t('gpa.coursePreviousGradeRequired', { number: i + 1 }));
            return false;
          }
        }
      }
    }

    return true;
  };

  const calculateGPA = () => {
    if (!validateInput()) return;

    const prevGPA = parseFloat(previousGPA) || 0;
    const prevHrs = parseFloat(previousHours) || 0;

    // Calculate points from previous semesters
    let previousPoints = prevGPA * prevHrs;
    let totalPreviousHours = prevHrs;

    // Calculate current semester
    let currentPoints = 0;
    let currentHours = 0;

    courses.forEach(course => {
      const grade = parseFloat(course.grade);
      const hours = parseFloat(course.hours);

      if (!isNaN(grade) && !isNaN(hours) && course.grade !== '') {
        currentPoints += grade * hours;
        currentHours += hours;

        // Handle repeated courses
        if (course.isRepeated) {
          const prevGrade = parseFloat(course.previousGrade);
          if (!isNaN(prevGrade)) {
            // Subtract old attempt from previous points
            previousPoints -= prevGrade * hours;
            totalPreviousHours -= hours;
          }
        }
      }
    });

    // Calculate semester GPA
    const semGPA = currentHours > 0 ? currentPoints / currentHours : 0;

    // Calculate new cumulative GPA
    const totalPoints = previousPoints + currentPoints;
    const totalHours = totalPreviousHours + currentHours;
    const newCumGPA = totalHours > 0 ? totalPoints / totalHours : 0;

    setSemesterGPA(semGPA.toFixed(2));
    setNewCumulativeGPA(newCumGPA.toFixed(2));
    setNewTotalHours(totalHours);
    
    // Determine GPA status
    const prevGPANum = parseFloat(previousGPA) || 0;
    const difference = Math.abs(newCumGPA - prevGPANum);
    
    // If difference is very small (less than 0.01), consider it stable
    if (difference < 0.01) {
      setGpaStatus('stable');
    } else if (newCumGPA > prevGPANum) {
      setGpaStatus('increased');
    } else {
      setGpaStatus('decreased');
    }
    
    setShowResults(true);
    
    // Scroll to results after a short delay to ensure DOM update
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
      }
    }, 100);
  };

  const resetCalculator = () => {
    setPreviousGPA('');
    setPreviousHours('');
    setCourses(Array(7).fill(null).map((_, i) => ({
      id: i + 1,
      grade: '',
      hours: 3,
      isRepeated: false,
      previousGrade: ''
    })));
    setSemesterGPA(null);
    setNewCumulativeGPA(null);
    setNewTotalHours(null);
    setGpaStatus(null);
    setShowResults(false);
    setIsFirstYear(false);
  };

  return (
    <div className="gpa-calculator-page">
      <div className="gpa-calculator">
        <div className="gpa-header">
          <h2 className="gpa-title">
            {t('gpa.title')}
          </h2>
          <p className="gpa-subtitle">
            {t('gpa.subtitle')}
          </p>
        </div>

        {/* First Year Button */}
        <div className="first-year-section">
          <button 
            className="first-year-btn"
            onClick={handleFirstYearClick}
          >
            {t('gpa.firstYearButton')}
          </button>
        </div>

        {/* GPA Scale Selection */}
        <div className="scale-selection">
          <label className="scale-label">
            {t('gpa.scaleLabel')}
          </label>
          <div className="scale-buttons">
            <button 
              className={`scale-btn ${gpaScale === 4 ? 'active' : ''}`}
              onClick={() => handleScaleChange(4)}
            >
              {t('gpa.outOf4')}
            </button>
            <button 
              className={`scale-btn ${gpaScale === 5 ? 'active' : ''}`}
              onClick={() => handleScaleChange(5)}
            >
              {t('gpa.outOf5')}
            </button>
            <button 
              className={`scale-btn ${gpaScale === 100 ? 'active' : ''}`}
              onClick={() => handleScaleChange(100)}
            >
              {t('gpa.outOf100')}
            </button>
          </div>
        </div>

        {/* Previous Semester Data */}
        <div className="previous-data-section">
          <div className="input-group">
            <label>
              {t('gpa.previousGPA')}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max={gpaScale}
              value={previousGPA}
              onChange={(e) => setPreviousGPA(e.target.value)}
              placeholder={`0 - ${gpaScale}`}
              disabled={isFirstYear}
            />
          </div>

          <div className="input-group">
            <label>
              {t('gpa.previousHours')}
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={previousHours}
              onChange={(e) => setPreviousHours(e.target.value)}
              placeholder="0"
              disabled={isFirstYear}
            />
          </div>

          <div className="important-notes">
            <p className="note-text">
              {t('gpa.note1')}
            </p>
            <p className="note-text">
              {t('gpa.note2')}
            </p>
            <p className="note-text emphasis">
              {t('gpa.note3')}
            </p>
          </div>
        </div>

        {/* Current Semester Courses Table */}
        <div className="courses-section">
          <h3 className="section-title">
            {t('gpa.currentSemesterCourses')}
          </h3>
          
          <div className="courses-table-wrapper">
            <table className="courses-table">
              <thead>
                <tr>
                  <th>{t('gpa.course')}</th>
                  <th>{t('gpa.grade')}</th>
                  <th>{t('gpa.creditHours')}</th>
                  <th>{t('gpa.repeated')}</th>
                  <th>{t('gpa.previousGrade')}</th>
                  <th>{t('gpa.action')}</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={course.id}>
                    <td className="course-label">
                      {isArabic ? `المادة ${index + 1}` : `Course ${index + 1}`}
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max={gpaScale}
                        value={course.grade}
                        onChange={(e) => handleCourseChange(index, 'grade', e.target.value)}
                        placeholder={`0-${gpaScale}`}
                        className="table-input"
                      />
                    </td>
                    <td>
                      <select
                        value={course.hours}
                        onChange={(e) => handleCourseChange(index, 'hours', parseInt(e.target.value))}
                        className="table-select"
                      >
                        {[1, 2, 3, 4, 5, 6].map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={course.isRepeated}
                        onChange={(e) => handleCourseChange(index, 'isRepeated', e.target.checked)}
                        className="table-checkbox"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max={gpaScale}
                        value={course.previousGrade}
                        onChange={(e) => handleCourseChange(index, 'previousGrade', e.target.value)}
                        placeholder={course.isRepeated ? `0-${gpaScale}` : '-'}
                        disabled={!course.isRepeated}
                        className="table-input"
                      />
                    </td>
                    <td>
                      {courses.length > 1 && (
                        <button
                          onClick={() => removeCourse(index)}
                          className="remove-btn"
                          title={isArabic ? 'حذف' : 'Remove'}
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={addCourse} className="add-course-btn">
            + {t('gpa.addCourse')}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={calculateGPA} className="calculate-btn">
            {t('gpa.calculate')}
          </button>
          <button onClick={resetCalculator} className="reset-btn">
            {t('gpa.reset')}
          </button>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="results-section" ref={resultsRef}>
            <h3 className="results-title">
              {t('gpa.results')}
            </h3>
            
            {/* GPA Status Message */}
            <div className={`gpa-status-message gpa-status-${gpaStatus}`}>
              <div className="status-title">
                {gpaStatus === 'increased' && t('gpa.gpaIncreased')}
                {gpaStatus === 'decreased' && t('gpa.gpaDecreased')}
                {gpaStatus === 'stable' && t('gpa.gpaStable')}
              </div>
              <div className="status-message">
                {gpaStatus === 'increased' && t('gpa.gpaIncreasedMessage')}
                {gpaStatus === 'decreased' && t('gpa.gpaDecreasedMessage')}
                {gpaStatus === 'stable' && t('gpa.gpaStableMessage')}
              </div>
            </div>
            
            <div className="results-grid">
              <div className="result-card">
                <span className="result-label">
                  {t('gpa.semesterGPA')}
                </span>
                <span className="result-value">{semesterGPA}</span>
              </div>
              <div className="result-card">
                <span className="result-label">
                  {t('gpa.newCumulativeGPA')}
                </span>
                <span className="result-value">{newCumulativeGPA}</span>
              </div>
              <div className="result-card">
                <span className="result-label">
                  {t('gpa.newTotalHours')}
                </span>
                <span className="result-value">{newTotalHours}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GPACalculatorPage;
