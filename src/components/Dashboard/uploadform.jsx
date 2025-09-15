import React, { useState } from "react";
import classNames from "classnames";
import { uploadFileToCloudinaryAndFirestore } from '../../../Cloudinary/index.mjs';

const Upload = ({ open, setOpen }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [pages, setPages] = useState(0);
  const [imageFiles, setImageFiles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handlePdfChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setPdfFile(f || null);
  };

  const handleSubmit = async () => {
    setStatus('Uploading...');
    setProgress(0);

    try {
      // Upload images first (if any)
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        await uploadFileToCloudinaryAndFirestore(file, {
          title,
          description,
          category,
          pages,
          resource_type: 'image'
        });
        setProgress(Math.round(((i + 1) / (imageFiles.length + (pdfFile ? 1 : 0))) * 100));
      }

      // Upload pdf
      if (pdfFile) {
        await uploadFileToCloudinaryAndFirestore(pdfFile, {
          title,
          description,
          category,
          pages,
          resource_type: 'raw'
        });
        setProgress(100);
      }

      setStatus('Upload complete');
    } catch (err) {
      console.error('Upload error:', err);
      setStatus('Upload failed. See console for details.');
    }
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