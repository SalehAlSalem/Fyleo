import React, { useState, useEffect } from 'react';
import { 
  ModernCard, 
  ModernButton, 
  ModernInput, 
  ModernAlert 
} from '@shared/ui/modern/ModernComponents';
import { subjectsService, fileTypesService, educationalPurposesService } from '../../services/appwriteService';

const EditModal = ({ isOpen, onClose, item, type, onSave }) => {
  const [formData, setFormData] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);
  const [educationalPurposes, setEducationalPurposes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Subject search
  const [subjectSearch, setSubjectSearch] = useState('');
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  useEffect(() => {
    if (isOpen && item) {
      // Initialize form data with item values
      setFormData({
        title: item.title || '',
        description: item.description || '',
        contentText: item.contentText || '',
        linkURL: item.linkURL || '',
        subjectId: item.subjectId || '',
        fileTypeId: item.fileTypeId || '',
        educationalPurposeId: item.educationalPurposeId || '',
        tags: item.tags || ''
      });

      // Load dropdown data
      loadDropdownData();
    }
  }, [isOpen, item]);

  useEffect(() => {
    if (subjectSearch.trim()) {
      const filtered = subjects.filter(subject => {
        const nameAr = subject.nameAr?.toLowerCase() || '';
        const nameEn = subject.nameEn?.toLowerCase() || '';
        const search = subjectSearch.toLowerCase();
        return nameAr.includes(search) || nameEn.includes(search);
      });
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects([]);
    }
  }, [subjectSearch, subjects]);

  const loadDropdownData = async () => {
    try {
      const [subjectsData, fileTypesData, purposesData] = await Promise.all([
        subjectsService.getAll(),
        fileTypesService.getAll(),
        educationalPurposesService.getAll()
      ]);

      setSubjects(subjectsData);
      setFileTypes(fileTypesData);
      
      // Filter educational purposes based on type
      // For posts: ONLY show purposes that support links (isLinkAllowed = true)
      // For materials: show all purposes
      let filteredPurposes = purposesData;
      if (type === 'posts') {
        filteredPurposes = purposesData.filter(p => p.isLinkAllowed === true);
      }
      setEducationalPurposes(filteredPurposes);
      
      // Auto-select educational purpose if only one option exists
      if (filteredPurposes.length === 1 && !item?.educationalPurposeId) {
        setFormData(prev => ({
          ...prev,
          educationalPurposeId: filteredPurposes[0].$id
        }));
      }
      
      // Set initial subject if exists
      if (item?.subjectId) {
        const currentSubject = subjectsData.find(s => s.$id === item.subjectId);
        if (currentSubject) {
          setSelectedSubject(currentSubject);
          setSubjectSearch(currentSubject.nameAr || currentSubject.nameEn);
        }
      }
    } catch (err) {
      console.error('Error loading dropdown data:', err);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setSubjectSearch(subject.nameAr || subject.nameEn);
    setFormData(prev => ({
      ...prev,
      subjectId: subject.$id
    }));
    setShowSubjectDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate subject selection
      if (!formData.subjectId) {
        setError('يرجى اختيار المادة');
        setLoading(false);
        return;
      }

      // Build updates based on type - ONLY SEND VALID FIELDS
      let updates = {};
      
      if (type === 'materials') {
        // Materials DB Schema: title, description, subjectId, fileTypeId, tags
        updates = {
          title: formData.title || '',
          description: formData.description || '',
          subjectId: formData.subjectId
        };
        
        if (formData.fileTypeId) {
          updates.fileTypeId = formData.fileTypeId;
        }
        
        if (formData.tags) {
          updates.tags = formData.tags;
        }
      } else {
        // Posts DB Schema: contentText, linkURL, subjectId, educationalPurposeId
        updates = {
          contentText: formData.contentText || '',
          linkURL: formData.linkURL || '',
          subjectId: formData.subjectId
        };
        
        // Only include educationalPurposeId if it exists
        if (formData.educationalPurposeId) {
          updates.educationalPurposeId = formData.educationalPurposeId;
        }
      }

      await onSave(item.$id, updates);
      onClose();
    } catch (err) {
      console.error('Error saving:', err);
      setError('فشل حفظ التعديلات');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}>
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <ModernCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {type === 'materials' ? 'تعديل الملف' : 'تعديل المنشور'}
            </h2>
            <button onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl">
              ✕
            </button>
          </div>

          {error && (
            <ModernAlert type="error" className="mb-4" onClose={() => setError('')}>
              {error}
            </ModernAlert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ==================== MATERIALS FORM ==================== */}
            {type === 'materials' && (
              <>
                {/* Subject Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🎓 اختر المادة
                  </label>
                  <div className="relative">
                    <ModernInput
                      type="text"
                      value={subjectSearch}
                      onChange={(e) => {
                        setSubjectSearch(e.target.value);
                        setShowSubjectDropdown(true);
                      }}
                      onFocus={() => setShowSubjectDropdown(true)}
                      placeholder="ابحث عن اسم المادة..."
                      required
                    />
                    
                    {/* Dropdown for filtered subjects */}
                    {showSubjectDropdown && filteredSubjects.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredSubjects.map(subject => (
                          <button
                            key={subject.$id}
                            type="button"
                            onClick={() => handleSubjectSelect(subject)}
                            className="w-full px-4 py-2 text-right hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            {subject.nameAr || subject.nameEn}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Selected Subject Display */}
                  {selectedSubject && (
                    <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-green-700 dark:text-green-300">
                        ✓ المادة المختارة: <strong>{selectedSubject.nameAr || selectedSubject.nameEn}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubject(null);
                          setSubjectSearch('');
                          setFormData(prev => ({ ...prev, subjectId: '' }));
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    📌 عنوان الملف
                  </label>
                  <ModernInput
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="عنوان الملف"
                    required
                  />
                </div>

                {/* File Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🏷️ نوع الملف
                  </label>
                  <select
                    value={formData.fileTypeId || ''}
                    onChange={(e) => handleChange('fileTypeId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">اختر نوع الملف</option>
                    {fileTypes.map(fileType => (
                      <option key={fileType.$id} value={fileType.$id}>
                        {fileType.icon} {fileType.nameAr || fileType.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    📄 وصف الملف
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="وصف تفصيلي للملف"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </>
            )}

            {/* ==================== POSTS FORM ==================== */}
            {type === 'posts' && (
              <>
                {/* Subject Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🎓 اختر المادة
                  </label>
                  <div className="relative">
                    <ModernInput
                      type="text"
                      value={subjectSearch}
                      onChange={(e) => {
                        setSubjectSearch(e.target.value);
                        setShowSubjectDropdown(true);
                      }}
                      onFocus={() => setShowSubjectDropdown(true)}
                      placeholder="ابحث عن اسم المادة..."
                      required
                    />
                    
                    {/* Dropdown for filtered subjects */}
                    {showSubjectDropdown && filteredSubjects.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredSubjects.map(subject => (
                          <button
                            key={subject.$id}
                            type="button"
                            onClick={() => handleSubjectSelect(subject)}
                            className="w-full px-4 py-2 text-right hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            {subject.nameAr || subject.nameEn}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Selected Subject Display */}
                  {selectedSubject && (
                    <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-green-700 dark:text-green-300">
                        ✓ المادة المختارة: <strong>{selectedSubject.nameAr || selectedSubject.nameEn}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubject(null);
                          setSubjectSearch('');
                          setFormData(prev => ({ ...prev, subjectId: '' }));
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Link URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🔗 رابط URL
                  </label>
                  <ModernInput
                    type="url"
                    value={formData.linkURL || ''}
                    onChange={(e) => handleChange('linkURL', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>

                {/* Content Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    📝 نص المنشور (وصف أو محتوى إضافي)
                  </label>
                  <textarea
                    value={formData.contentText || ''}
                    onChange={(e) => handleChange('contentText', e.target.value)}
                    placeholder="محتوى المنشور أو وصف الرابط"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Educational Purpose - ONLY show if there are link-supported purposes */}
                {educationalPurposes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      🎯 الغرض التعليمي *
                    </label>
                    {educationalPurposes.length === 1 ? (
                      // If only one option, show it as read-only
                      <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                        {educationalPurposes[0].nameAr || educationalPurposes[0].nameEn}
                      </div>
                    ) : (
                      // Multiple options, show dropdown
                      <select
                        value={formData.educationalPurposeId || ''}
                        onChange={(e) => handleChange('educationalPurposeId', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        {educationalPurposes.map(purpose => (
                          <option key={purpose.$id} value={purpose.$id}>
                            {purpose.nameAr || purpose.nameEn}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
                
                {/* Warning if no link-supported purposes exist */}
                {educationalPurposes.length === 0 && (
                  <ModernAlert type="warning">
                    ⚠️ لا يوجد أغراض تعليمية تدعم الروابط في قاعدة البيانات
                  </ModernAlert>
                )}
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <ModernButton
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'جاري الحفظ...' : '💾 حفظ التعديلات'}
              </ModernButton>
              <ModernButton
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                إلغاء
              </ModernButton>
            </div>
          </form>
        </ModernCard>
      </div>
    </div>
  );
};

export default EditModal;
