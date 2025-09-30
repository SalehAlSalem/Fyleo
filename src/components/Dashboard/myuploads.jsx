import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import DatabaseService from '../../services/databaseService';

const MyUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUploads = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        const filesRef = collection(db, 'files');
        const q = query(
          filesRef,
          where('uploadedBy', '==', auth.currentUser.uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const uploadsList = [];
        
        querySnapshot.forEach((doc) => {
          uploadsList.push({
            id: doc.id,
            ...doc.data()
          });
        });

        setUploads(uploadsList);
      } catch (err) {
        console.error('Error fetching uploads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUploads();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Uploads ({uploads.length})</h2>
      <div className="grid gap-4">
        {uploads.map((file) => (
          <div key={file.id} className="border rounded p-4">
            <h3 className="font-semibold">{file.name}</h3>
            <p className="text-sm text-gray-600">{file.category}</p>
            <a 
              href={file.downloadURL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View File
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyUploads;
