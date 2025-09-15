import { auth, db } from './ClientApp.mjs';
import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { uploadFileToCloudinaryAndFirestore } from '../Cloudinary/index.mjs';

//uploading pdfs
const UploadDataPdf = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [progress, setProgress] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileIds, setFileIds] = useState([]);
  
    const handleFileChange = (event) => {
      const files = event.target.files;
      setSelectedFiles(Array.from(files));
      setProgress(Array.from(files).map(() => 0));
    };
  
    const handleUpload = async () => {
      const uploadPromises = selectedFiles.map(async (file, index) => {
        try {
          // Upload to Cloudinary and save to Firestore
          const result = await uploadFileToCloudinaryAndFirestore(file, {
            dec: "",
            mat_type: "",
            pages: ""
          });

          // Update progress and file lists
          setProgress(prev => {
            const newProgress = [...prev];
            newProgress[index] = 100;
            return newProgress;
          });

          setUploadedFiles(prev => [...prev, file]);
          setFileIds(prev => [...prev, result.id]);

          return result;
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          setProgress(prev => {
            const newProgress = [...prev];
            newProgress[index] = 0;
            return newProgress;
          });
          throw error;
        }
      });

      try {
        await Promise.all(uploadPromises);
        console.log('All files uploaded successfully!');
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    };
  
    
  };
//UPloading images
const UploadDataImage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [progress, setProgress] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileIds, setFileIds] = useState([]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFiles(Array.from(files));
    setProgress(Array.from(files).map(() => 0));
  };

  const handleUpload = async () => {
    const uploadPromises = selectedFiles.map(async (file, index) => {
      try {
        // Upload to Cloudinary and save to Firestore
        const result = await uploadFileToCloudinaryAndFirestore(file, {
          resource_type: 'image'
        });

        // Update progress and file lists
        setProgress(prev => {
          const newProgress = [...prev];
          newProgress[index] = 100;
          return newProgress;
        });

        setUploadedFiles(prev => [...prev, file]);
        setFileIds(prev => [...prev, result.id]);

        return result;
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        setProgress(prev => {
          const newProgress = [...prev];
          newProgress[index] = 0;
          return newProgress;
        });
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);
      console.log('All files uploaded successfully!');
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  
};





//downloading func

const FetchItem = ({ itemId }) => {
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        console.log("Fetching item:", itemId);
        const itemDocRef = doc(db, 'files', itemId);
        const itemDocSnap = await getDoc(itemDocRef);

        if (itemDocSnap.exists()) {
          const itemDetails = itemDocSnap.data();
          setItemData(itemDetails);
          // Note: We don't need to fetch URL separately - it's stored in itemDetails.secure_url
        } else {
          console.log('Item does not exist.');
        }
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };

    fetchItemData();
  }, [itemId]);

  if (!itemData) {
    return <div>Loading...</div>;
  }

  
};



// Write your Firebase Functions here

export {UploadDataImage,UploadDataPdf,FetchItem }