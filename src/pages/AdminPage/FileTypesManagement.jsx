import React, { useState, useEffect } from 'react';
import { fileTypesService } from '../../services/appwriteService';
import { 
  ModernCard, 
  ModernButton, 
  ModernInput, 
  ModernAlert,
  ModernSkeleton,
  ModernBadge
} from '../../components/modern/ModernComponents';

/**
 * 🗂️ File Types Management Component
 */
const FileTypesManagement = () => {
  const [fileTypes, setFileTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFileType, setEditingFileType] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    nameEn: '',
    icon: '📄',
    color: '#3B82F6',
    allowedFormats: ''
  });

  useEffect(() => {
    loadFileTypes();
  }, []);

  const loadFileTypes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fileTypesService.getAll();
      setFileTypes(data);
    } catch (err) {
      console.error('Error loading file types:', err);
      setError('فشل تحميل أنواع الملفات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setSuccess('');
      
      // Convert allowedFormats string to array
      const formatsArray = formData.allowedFormats
        .split(',')
        .map(f => f.trim())
        .filter(f => f);
      
      const dataToSave = {
        ...formData,
        allowedFormats: formatsArray
      };
      
      if (editingFileType) {
        await fileTypesService.update(editingFileType.$id, dataToSave);
        setSuccess('تم تحديث نوع الملف بنجاح');
      } else {
        await fileTypesService.create(dataToSave);
        setSuccess('تم إضافة نوع الملف بنجاح');
      }
      
      resetForm();
      loadFileTypes();
    } catch (err) {
      console.error('Error saving file type:', err);
      setError('فشل حفظ نوع الملف');
    }
  };

  const handleEdit = (fileType) => {
    setEditingFileType(fileType);
    setFormData({
      name: fileType.name,
      nameAr: fileType.nameAr,
      nameEn: fileType.nameEn,
      icon: fileType.icon || '📄',
      color: fileType.color || '#3B82F6',
      allowedFormats: Array.isArray(fileType.allowedFormats) 
        ? fileType.allowedFormats.join(', ') 
        : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (fileTypeId) => {
    if (!confirm('هل أنت متأكد من حذف هذا النوع؟')) return;
    
    try {
      setError('');
      await fileTypesService.delete(fileTypeId);
      setSuccess('تم حذف نوع الملف بنجاح');
      loadFileTypes();
    } catch (err) {
      console.error('Error deleting file type:', err);
      setError('فشل حذف نوع الملف');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameAr: '',
      nameEn: '',
      icon: '📄',
      color: '#3B82F6',
      allowedFormats: ''
    });
    setEditingFileType(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <ModernSkeleton lines={3} />
        <ModernSkeleton lines={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          إدارة أنواع الملفات
        </h2>
        <ModernButton onClick={() => setShowForm(!showForm)}>
          {showForm ? 'إلغاء' : '+ إضافة نوع ملف'}
        </ModernButton>
      </div>

      {/* Alerts */}
      {error && <ModernAlert type="error" onClose={() => setError('')}>{error}</ModernAlert>}
      {success && <ModernAlert type="success" onClose={() => setSuccess('')}>{success}</ModernAlert>}

      {/* Form */}
      {showForm && (
        <ModernCard className="p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {editingFileType ? 'تعديل نوع الملف' : 'إضافة نوع ملف جديد'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ModernInput
                label="الاسم"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <ModernInput
                label="الاسم بالعربية"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                required
              />
              <ModernInput
                label="الاسم بالإنجليزية"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ModernInput
                label="الأيقونة (Emoji)"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="📄"
              />
              <ModernInput
                label="اللون (Hex)"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>

            <div>
              <ModernInput
                label="الصيغ المسموحة (مفصولة بفواصل)"
                value={formData.allowedFormats}
                onChange={(e) => setFormData({ ...formData, allowedFormats: e.target.value })}
                placeholder="pdf, doc, docx"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">مثال: pdf, doc, docx, txt</p>
            </div>

            <div className="flex gap-2">
              <ModernButton type="submit">
                {editingFileType ? 'تحديث' : 'إضافة'}
              </ModernButton>
              <ModernButton type="button" variant="outline" onClick={resetForm}>
                إلغاء
              </ModernButton>
            </div>
          </form>
        </ModernCard>
      )}

      {/* File Types List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {fileTypes.map(fileType => (
          <ModernCard key={fileType.$id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl"
                  style={{ backgroundColor: fileType.color }}
                >
                  {fileType.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    {fileType.nameAr}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {fileType.nameEn}
                  </p>
                </div>
              </div>
            </div>
            
            {fileType.allowedFormats && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">الصيغ المسموحة:</p>
                <div className="flex gap-1 flex-wrap">
                  {(Array.isArray(fileType.allowedFormats) 
                    ? fileType.allowedFormats 
                    : fileType.allowedFormats.split(',').map(f => f.trim())
                  ).map((format, index) => (
                    <ModernBadge key={index} variant="info" size="sm">
                      .{format}
                    </ModernBadge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <ModernButton 
                size="sm" 
                variant="outline"
                onClick={() => handleEdit(fileType)}
              >
                تعديل
              </ModernButton>
              <ModernButton 
                size="sm" 
                variant="danger"
                onClick={() => handleDelete(fileType.$id)}
              >
                حذف
              </ModernButton>
            </div>
          </ModernCard>
        ))}
      </div>

      {fileTypes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            لا توجد أنواع ملفات حالياً
          </p>
        </div>
      )}
    </div>
  );
};

export default FileTypesManagement;
