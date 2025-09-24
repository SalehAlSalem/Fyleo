import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavBar } from '../../components';
import Sidepanel from "./sidepanel";
import { auth, db } from '../../../Firebase/ClientApp.mjs';
import { doc, getDoc, setDoc, collection, query, where, getCountFromServer } from 'firebase/firestore';

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({ name: '', roll: '', batch: '' });
  const [stats, setStats] = useState({ bookmarks: 0, uploads: 0, downloads: 0, points: 0 });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const u = auth.currentUser;
        if (!u) return;
        const userRef = doc(db, 'users', u.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          // create minimal user doc
          await setDoc(userRef, { name: u.displayName || '', email: u.email || '', points: 0, createdAt: new Date().toISOString() });
          setUserData({ name: u.displayName || '', roll: '', batch: '' });
        } else {
          const data = snap.data();
          setUserData({ name: data.name || (u.displayName || ''), roll: data.roll || '', batch: data.batch || '' });
          setStats(s => ({ ...s, points: data.points || 0 }));
        }

        // compute uploads count from files collection where uploaderUid == uid
        const filesQ = query(collection(db, 'files'), where('uploaderUid', '==', u.uid));
        const countSnap = await getCountFromServer(filesQ);
        setStats(s => ({ ...s, uploads: countSnap.data().count }));

        // bookmarks/downloads would ideally be stored per-user; keep 0 as default unless available
      } catch (err) {
        console.error('Error loading user dashboard data', err);
      }
    };

    loadUser();
  }, []);
  return (
    <div className={`flex w-screen h-screen`}>
      <NavBar />
      <div className="main flex w-full h-full">
        <Sidepanel open={open} setOpen={setOpen}/>
        <div className={`container flex flex-col justify-center h-full md:h-full ${open? "ml-[12%] w-[95%]" : "w-[80%] ml-[18%]"} mr-16 mt-8`}>
          <div className={`Stats grid lg:grid-cols-3 gap-6 ${open? "w-full ml-4":"w-full ml-12"} mb-16 mt-20`}>
            <div className="rounded-lg bg-gray-100 h-44 w-full p-4 shadow-sm">
              <div className="text-sm font-medium text-gray-500 truncate">
                Total Bookmarks
              </div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  <Link to={`/bookmarks`} >{stats.bookmarks}</Link>
                </div>
            </div>
            <div className="rounded-lg bg-gray-100 h-44 w-full p-4 shadow-sm">
              <div className="text-sm font-medium text-gray-500 truncate">
                Total Uploads
              </div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">
                <Link to={`/uploads`} >{stats.uploads}</Link>
              </div>
            </div>
            <div className="rounded-lg bg-gray-100 h-44 w-full p-4 shadow-sm">
              <div className="text-sm font-medium text-gray-500 truncate">
                Total Downloads
              </div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">
                <Link to={`/downloads`}>{stats.downloads}</Link>
              </div>          
            </div>
          </div>
          <div className={`Userdata grid col-1 bg-gray-100 h-96 ${open? "w-full ml-4":"w-full ml-12"} p-8 shadow-sm rounded-lg`}>
            <p className={`username text-3xl font-semibold text-gray-900`}>
              Name : {userData.name || '—'}
            </p>
            <p className={`username text-3xl font-semibold text-gray-900`}>
              Roll No : {userData.roll || '—'}
            </p>
            <p className={`username text-3xl font-semibold text-gray-900`}>
              Batch : {userData.batch || '—'}
            </p>
            <p className={`username text-2xl font-semibold text-gray-700 mt-4`}>
              Points: {stats.points}
            </p>
          </div>
        </div>
      </div >
    </div>    
  );
}



export default Dashboard;