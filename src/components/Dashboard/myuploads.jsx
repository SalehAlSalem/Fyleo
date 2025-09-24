import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, doc, writeBatch } from 'firebase/firestore';
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

  const [publishing, setPublishing] = useState(false);
  const publishAll = async () => {
    if (!files.length) return;
    setPublishing(true);
    try {
      const batch = writeBatch(db);
      let any = false;
      for (const f of files) {
        if (!f.approved) {
          const docRef = doc(db, 'files', f.id);
          batch.update(docRef, { approved: true });
          any = true;
        }
      }
      if (any) {
        await batch.commit();
      }
      // refresh list
      const uid = auth.currentUser ? auth.currentUser.uid : null;
      const q = query(collection(db, 'files'), where('uploaderUid', '==', uid), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setFiles(results);
    } catch (err) {
      console.error('Error publishing uploads', err);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-3">My uploads</h3>
      <div className="mb-3">
        <button onClick={publishAll} disabled={publishing} className="theme-btn-shadow rounded-xl bg-[#10B981] px-4 py-2 monu text-sm text-white">
          {publishing ? 'Publishing...' : 'Publish my uploads (approve)'}
        </button>
      </div>
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
