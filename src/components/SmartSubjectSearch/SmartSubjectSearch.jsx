import React, { useState, useEffect, useRef } from 'react';
import { subjectsService } from '../../services/appwriteService';
import { useTranslation } from 'react-i18next';

/**
 * Smart Subject Search Component
 * Autocomplete searchable dropdown for selecting subjects
 */
const SmartSubjectSearch = ({ value, onChange, required = false, className = '' }) => {
  const { t, i18n } = useTranslation();
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch all subjects on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const allSubjects = await subjectsService.getAll();
        setSubjects(allSubjects);
        setFilteredSubjects(allSubjects);
        
        // If value is provided, find and set the selected subject
        if (value) {
          const selected = allSubjects.find(s => s.$id === value);
          if (selected) {
            setSelectedSubject(selected);
            setSearchTerm(i18n.language === 'ar' ? selected.nameAr : selected.nameEn);
          }
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [value, i18n.language]);

  // Filter subjects based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSubjects(subjects);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = subjects.filter(subject => {
      const nameAr = subject.nameAr?.toLowerCase() || '';
      const nameEn = subject.nameEn?.toLowerCase() || '';
      return nameAr.includes(term) || nameEn.includes(term);
    });
    
    setFilteredSubjects(filtered);
  }, [searchTerm, subjects]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (subject) => {
    setSelectedSubject(subject);
    setSearchTerm(i18n.language === 'ar' ? subject.nameAr : subject.nameEn);
    setIsOpen(false);
    onChange(subject.$id);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);
    
    // If user clears the input, clear selection
    if (!value.trim()) {
      setSelectedSubject(null);
      onChange('');
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={loading ? t('common.loading') : t('upload.searchSubject')}
          disabled={loading}
          required={required}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 text-center"
        />
        
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Clear Button */}
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedSubject(null);
              onChange('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && filteredSubjects.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredSubjects.map((subject) => (
            <button
              key={subject.$id}
              type="button"
              onClick={() => handleSelect(subject)}
              className={`w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors ${
                selectedSubject?.$id === subject.$id
                  ? 'bg-blue-100 dark:bg-gray-700 text-blue-900 dark:text-blue-300'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              <div className="font-medium text-center">
                {i18n.language === 'ar' ? subject.nameAr : subject.nameEn}
              </div>
              {subject.categoryName && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                  {subject.categoryName}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && searchTerm && filteredSubjects.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 text-center text-gray-500 dark:text-gray-400">
          {t('materials.noResults')}
        </div>
      )}

      {/* Selected Subject Info */}
      {selectedSubject && !isOpen && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          ✓ {t('upload.selectedSubject')}: <span className="font-medium">{i18n.language === 'ar' ? selectedSubject.nameAr : selectedSubject.nameEn}</span>
        </div>
      )}
    </div>
  );
};

export default SmartSubjectSearch;
