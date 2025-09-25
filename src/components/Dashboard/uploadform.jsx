import React, { useState } from "react";
import classNames from "classnames";
import { uploadFileToFirebaseStorage } from '../../../Firebase/Storage.mjs';
import { auth } from '../../../Firebase/ClientApp.mjs';
import cardData from '../../config/CardData.mjs';

const Upload = ({ open, setOpen }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [lastFailDetails, setLastFailDetails] = useState(null);

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handlePdfChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setPdfFile(f || null);
  };

  const handleSubmit = async () => {
    // Ensure the user is signed in before uploading (client-side guard)
    if (!auth || !auth.currentUser) {
      setStatus('Please sign in before uploading.');
      return;
    }

    setStatus('Uploading...');
    setProgress(0);

    try {
      const total = imageFiles.length + (pdfFile ? 1 : 0);
      let done = 0;
      const results = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const categoryObj = cardData.find(c => c.domain === category) || null;
        
        const onFileProgress = (percent) => {
          const overallProgress = ((done + (percent / 100)) / total) * 100;
          setProgress(Math.round(overallProgress));
        };
        
        const res = await uploadFileToFirebaseStorage(file, {
          category: categoryObj ? categoryObj.domain : category,
          categorySlug: categoryObj ? categoryObj.urlparams : (category || null),
          description: description,
          tags: [category].filter(Boolean),
        }, onFileProgress);
        
        results.push({ file: file.name, result: res });
        done++;
        setProgress(Math.round((done / total) * 100));
      }

      if (pdfFile) {
        const categoryObj = cardData.find(c => c.domain === category) || null;
        
        const onFileProgress = (percent) => {
          const overallProgress = ((done + (percent / 100)) / total) * 100;
          setProgress(Math.round(overallProgress));
        };
        
        const res = await uploadFileToFirebaseStorage(pdfFile, {
          category: categoryObj ? categoryObj.domain : category,
          categorySlug: categoryObj ? categoryObj.urlparams : (category || null),
          description: description,
          tags: [category].filter(Boolean),
        }, onFileProgress);
        
        results.push({ file: pdfFile.name, result: res });
        done++;
        setProgress(Math.round((done / total) * 100));
      }

      // Check results - Firebase Storage uploads are atomic (either succeed completely or fail)
      const successfulUploads = results.filter(r => r.result && r.result.success);
      const failedUploads = results.filter(r => !r.result || !r.result.success);
      
      if (failedUploads.length > 0) {
        setStatus(`${failedUploads.length} file(s) failed to upload. Check console for details.`);
        console.error('Failed uploads:', failedUploads);
      } else {
        setStatus(`تم رفع ${successfulUploads.length} ملف بنجاح! 🎉`);
        // Clear form on success
        setTitle('');
        setDescription('');
        setCategory('');
        setImageFiles([]);
        setPdfFile(null);
        
        // Show success message with file details
        console.log('Uploaded files:', successfulUploads.map(r => ({
          name: r.file,
          url: r.result.downloadURL,
          id: r.result.fileId
        })));
      }
    } catch (err) {
      console.error('Upload error:', err);
      setStatus('Upload failed. See console for details.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setImageFiles([]);
    setPdfFile(null);
    setProgress(0);
    setStatus('');
  };

  return (
    <div className="flex items-center flex-col">
      <div className="w-[78vw] bg-gray-100 dark:bg-[#E7E5E4] flex items-center justify-center m-5 shadow-md rounded-2xl flex-col px-3 py-5">
        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-[85%] h-10 rounded-lg border border-gray-400 text-100 py-2 pl-4 m-2" placeholder="Title" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} cols={30} rows={6} className="w-[85%] h-40 rounded-lg border border-gray-400 text-100 py-2 pl-4 mb-2" placeholder="Description" />

        <label className="text-xl mb-2 w-[85%]">Images:</label>
        <input type="file" onChange={handleImageChange} className="w-[85%] h-12 rounded-lg border border-gray-400 text-100 py-2 pl-4 mb-2" accept="image/*" multiple />

        <label className="text-xl mb-2 w-[85%]">PDF:</label>
        <input type="file" onChange={handlePdfChange} className="w-[85%] h-12 rounded-lg border border-gray-400 text-100 py-2 pl-4 mb-2" accept="application/pdf" />

        <label className="text-gray-500 w-[85%]">Category / Subject</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-[85%] h-10 rounded-lg border border-gray-400 text-100 py-2 pl-4 m-2">
          <option value="">Select a category</option>
          {cardData.map(c => (
            <option key={c.id} value={c.domain}>{c.domain}</option>
          ))}
        </select>

        <div className="w-[85%] flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">{status}</div>
          <div className="text-sm text-gray-600">{progress}%</div>
        </div>

        {progress > 0 && progress < 100 && (
          <div className="w-[85%] mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{width: `${progress}%`}}></div>
            </div>
          </div>
        )}

        {status && (
          <div className={`w-[85%] mt-4 p-3 rounded-md ${
            status.includes('بنجاح') || status.includes('complete') 
              ? 'bg-green-50 text-green-700' 
              : status.includes('failed') || status.includes('error')
              ? 'bg-red-50 text-red-700'
              : 'bg-blue-50 text-blue-700'
          }`}>
            <div className="text-sm font-medium">{status}</div>
          </div>
        )}

        <button onClick={handleSubmit}
          className={classNames({
            'theme-btn-shadow rounded-xl bg-[#3B82F6]': true,
            'px-4 py-2': true,
            'monu text-sm text-white font-normal': true,
            'mobile:text-xs': true,
          })}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Upload;