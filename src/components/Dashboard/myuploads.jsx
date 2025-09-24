import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../../../Firebase/ClientApp.mjs';

const MyUploads = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const uid = auth.currentUser ? auth.currentUser.uid : null;
        if (!uid) {
          setFiles([]);
          setLoading(false);
          return;
        }
        const q = query(collection(db, 'files'), where('uploaderUid', '==', uid), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setFiles(results);
      } catch (err) {
        console.error('Error fetching my uploads', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) return <div>Loading your uploads...</div>;
  if (!files.length) return <div>No uploads yet.</div>;

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-3">My uploads</h3>
      <ul className="space-y-2">
        {files.map(f => (
          <li key={f.id} className="p-2 bg-white rounded shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{f.name}</div>
                <div className="text-sm text-gray-500">{f.category} • {f.format}</div>
              </div>
              <a href={f.secure_url} target="_blank" rel="noreferrer" className="text-blue-600">Open</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyUploads;
