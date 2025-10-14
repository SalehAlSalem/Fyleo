import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  categoriesService, 
  subjectsService, 
  fileTypesService,
  materialsService,
  storageService
} from '../../services/appwriteService';
import { 
  ModernCard, 
  ModernButton, 
  ModernInput, 
  ModernAlert,
  ModernProgress
} from '../../components/modern/ModernComponents';

/**
 * 📤 File Upload Form with Appwrite Storage
 */
const FileUploadForm = () => {
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    subjectId: '',
    fileTypeId: '',
    tags: '',
    semester: '',
    year: new Date().getFullYear()
  });

  useEffect(() => {
    loadDropdownData();
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      const filtered = subjects.filter(s => s.categoryId === formData.categoryId);
      setFilteredSubjects(filtered);
      setFormData(prev => ({ ...prev, subjectId: '' }));
    }
  }, [formData.categoryId, subjects]);

  const loadDropdownData = async () => {
    try {
      setLoading(true);
      const [categoriesData, subjectsData, fileTypesData] = await Promise.all([
        categoriesService.getAll(),
        subjectsService.getAll(),
        fileTypesService.getAll()
      ]);
      
      setCategories(categoriesData);
      setSubjects(subjectsData);
      setFileTypes(fileTypesData);
    } catch (err) {
      console.error('Error loading dropdown data:', err);
      setError('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setError('حجم الملف يجب أن يكون أقل من 100 ميجابايت');
        return;
      }
      
      setSelectedFile(file);
      
      // Auto-fill title if empty
      if (!formData.title) {
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        setFormData(prev => ({ ...prev, title: fileName }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('يرجى اختيار ملف');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');
      setUploadProgress(0);

      // Step 1: Upload file to Appwrite Storage
      console.log('📤 Uploading file to storage...');
      setUploadProgress(20);
      
      const uploadedFile = await storageService.uploadFile(selectedFile);
      console.log('✅ File uploaded:', uploadedFile);
      setUploadProgress(50);

      // Step 2: Get file URLs
      const downloadURL = storageService.getFileDownloadURL(uploadedFile.$id);
      const viewURL = storageService.getFileViewURL(uploadedFile.$id);
      setUploadProgress(70);

      // Step 3: Create material record in database
      console.log('💾 Creating material record...');
      const tagsArray = formData.tags 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const materialData = {
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId,
        subjectId: formData.subjectId,
        fileTypeId: formData.fileTypeId,
        fileId: uploadedFile.$id,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        mimeType: selectedFile.type,
        downloadURL: downloadURL,
        viewURL: viewURL,
        tags: tagsArray,
        semester: formData.semester,
        year: formData.year
      };

      const material = await materialsService.create(materialData);
      console.log('✅ Material created:', material);
      setUploadProgress(100);

      setSuccess('تم رفع الملف بنجاح!');
      
      // Reset form
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('❌ Upload error:', err);
      setError('فشل رفع الملف: ' + (err.message || 'خطأ غير معروف'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <ModernCard className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        رفع ملف جديد
      </h2>

      {error && <ModernAlert type="error" onClose={() => setError('')} className="mb-4">{error}</ModernAlert>}
      {success && <ModernAlert type="success" className="mb-4">{success}</ModernAlert>}

      {uploading && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            جاري الرفع... {uploadProgress}%
          </p>
          <ModernProgress progress={uploadProgress} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Input */}
        <div className="form-group-modern">
          <label className="form-label-modern">اختر الملف *</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="input-modern"
            disabled={uploading}
            required
          />
          {selectedFile && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              الملف المحدد: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Title */}
        <ModernInput
          label="عنوان الملف *"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="مثال: ملخص الفصل الأول"
          disabled={uploading}
          required
        />

        {/* Description */}
        <div className="form-group-modern">
          <label className="form-label-modern">الوصف</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-modern"
            rows="3"
            placeholder="وصف مختصر للملف..."
            disabled={uploading}
          />
        </div>

        {/* Category and Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group-modern">
            <label className="form-label-modern">التصنيف *</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="input-modern"
              disabled={uploading || loading}
              required
            >
              <option value="">اختر التصنيف</option>
              {categories.map(category => (
                <option key={category.$id} value={category.$id}>
                  {category.icon} {category.nameAr}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group-modern">
            <label className="form-label-modern">المادة الدراسية *</label>
            <select
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="input-modern"
              disabled={uploading || !formData.categoryId}
              required
            >
              <option value="">اختر المادة</option>
              {filteredSubjects.map(subject => (
                <option key={subject.$id} value={subject.$id}>
                  {subject.nameAr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* File Type */}
        <div className="form-group-modern">
          <label className="form-label-modern">نوع الملف *</label>
          <select
            value={formData.fileTypeId}
            onChange={(e) => setFormData({ ...formData, fileTypeId: e.target.value })}
            className="input-modern"
            disabled={uploading || loading}
            required
          >
            <option value="">اختر نوع الملف</option>
            {fileTypes.map(fileType => (
              <option key={fileType.$id} value={fileType.$id}>
                {fileType.icon} {fileType.nameAr}
              </option>
            ))}
          </select>
        </div>

        {/* Tags, Semester, Year */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModernInput
            label="الكلمات المفتاحية"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="مثال: ملخص, امتحان, شرح"
            disabled={uploading}
          />

          <ModernInput
            label="الفصل الدراسي"
            value={formData.semester}
            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            placeholder="مثال: الأول، الثاني"
            disabled={uploading}
          />

          <ModernInput
            label="السنة"
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            disabled={uploading}
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <ModernButton 
            type="submit" 
            loading={uploading}
            disabled={uploading || !selectedFile}
          >
            {uploading ? 'جاري الرفع...' : 'رفع الملف'}
          </ModernButton>
          <ModernButton 
            type="button" 
            variant="outline"
            onClick={() => navigate('/dashboard')}
            disabled={uploading}
          >
            إلغاء
          </ModernButton>
        </div>
      </form>
    </ModernCard>
  );
};

export default FileUploadForm;
