import React, { useState } from "react";
import classNames from "classnames";
import { uploadFileToCloudinaryAndFirestore, saveMetadataToFirestore } from '../../../Cloudinary/index.mjs';
import { auth } from '../../../Firebase/ClientApp.mjs';

const Upload = ({ open, setOpen }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [pages, setPages] = useState(0);
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
        const res = await uploadFileToCloudinaryAndFirestore(file, {
          title,
          description,
          category,
          pages,
          resource_type: 'image'
        });
        results.push({ file: file.name, result: res });
        done++;
        setProgress(Math.round((done / total) * 100));
      }

      if (pdfFile) {
        const res = await uploadFileToCloudinaryAndFirestore(pdfFile, {
          title,
          description,
          category,
          pages,
          resource_type: 'raw'
        });
        results.push({ file: pdfFile.name, result: res });
        done++;
        setProgress(Math.round((done / total) * 100));
      }

      // Summarize results
      const failedFirestore = results.filter(r => r.result && r.result.firestoreSaved === false);
      if (failedFirestore.length > 0) {
        // Show detailed error info if available
        const details = failedFirestore.map(f => ({ file: f.file, error: f.result.firestoreError }));
        setStatus(`Upload succeeded to Cloudinary but saving to Firestore failed for ${failedFirestore.length} file(s). See console for details.`);
        // Persist failures locally so user can retry later
        const pending = JSON.parse(localStorage.getItem('pendingFileMetadata') || '[]');
        const toSave = failedFirestore.map(f => ({ ...f.result }));
        localStorage.setItem('pendingFileMetadata', JSON.stringify([...pending, ...toSave]));
        // eslint-disable-next-line no-console
        console.warn('Some uploads failed to save to Firestore, saved to localStorage pendingFileMetadata:', toSave, 'details:', details);
        setLastFailDetails(details);
      } else {
        setStatus('Upload complete');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setStatus('Upload failed. See console for details.');
    }
  };

  // Retry pending metadata saved in localStorage
  const [pending, setPending] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pendingFileMetadata') || '[]');
    } catch (e) {
      return [];
    }
  });

  const handleRetryPending = async () => {
    if (!pending.length) return;
    setStatus('Retrying pending metadata saves...');
    const remaining = [];
    for (const pd of pending) {
      const res = await saveMetadataToFirestore(pd);
      if (!res.ok) {
        remaining.push(pd);
      }
    }
    localStorage.setItem('pendingFileMetadata', JSON.stringify(remaining));
    setPending(remaining);
    if (remaining.length === 0) setStatus('All pending metadata saved successfully');
    else setStatus(`${remaining.length} pending items remain`);
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

        <input value={category} onChange={(e) => setCategory(e.target.value)} type="text" className="w-[85%] h-10 rounded-lg border border-gray-400 text-100 py-2 pl-4 m-2" placeholder="Category" />
        <input value={pages} onChange={(e) => setPages(e.target.value)} type="number" className="w-[85%] h-10 rounded-lg border border-gray-400 text-100 py-2 pl-4 m-2" placeholder="Number of pages" />

        <div className="w-[85%] flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">{status}</div>
          <div className="text-sm text-gray-600">{progress}%</div>
        </div>

        {pending.length > 0 && (
          <div className="w-[85%] mt-4 p-3 bg-yellow-50 rounded-md">
            <div className="text-sm font-medium">You have {pending.length} pending metadata save(s).</div>
            <div className="mt-2 flex gap-2">
              <button onClick={handleRetryPending} className="theme-btn-shadow rounded-xl bg-[#10B981] px-4 py-2 monu text-sm text-white">Retry pending saves</button>
            </div>
          </div>
        )}

        {lastFailDetails && (
          <div className="w-[85%] mt-4 p-3 bg-red-50 rounded-md">
            <div className="text-sm font-medium text-red-700">Last Firestore save failures (copy details):</div>
            <pre className="text-xs overflow-auto max-h-40 mt-2 p-2 bg-white rounded">{JSON.stringify(lastFailDetails, null, 2)}</pre>
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