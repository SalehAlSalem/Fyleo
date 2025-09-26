import { NavBar, MaterialIntro, MaterialCard, SearchBar, Footer, BackToTop } from '../../components';
import FileList from '../../components/FileList';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import cardData from '../../config/CardData.mjs';
import { db, auth } from '../../../Firebase/ClientApp.js';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';


const MaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const {category} = useParams();
  let categoryid = -1;
  cardData.map((value) => {
    if (value.urlparams == category)
    {
      categoryid=value.id;
    }
  });
  if (categoryid != -1)
  {
      const categoryimage = cardData[categoryid-1].background;

      const fetchmaterials = async () => {
        try {
          // Query Firestore for files with matching categorySlug that are approved,
          // but also include user's own uploads so they appear immediately after upload
          const catSlug = cardData[categoryid-1].urlparams;
          const filesRef = collection(db, 'files');
          let q = query(filesRef, where('categorySlug', '==', catSlug), orderBy('createdAt', 'desc'));
          const snap = await getDocs(q);
          const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));

          // Filter approved OR owned by current user
          const uid = auth && auth.currentUser ? auth.currentUser.uid : null;
          const visible = results.filter(r => r.approved === true || (uid && r.uploadedBy === uid));
          // Map to the MaterialCard expected shape - دعم النظام الهجين
          const mapped = visible.map(r => ({
            id: r.id,
            title: r.name || r.title || r.originalName || 'Untitled',
            // النظام الهجين: GitHub أو Supabase أو Firebase Storage القديم
            url: r.downloadURL || r.secure_url || r.image || '',
            image: r.type?.startsWith('image/') 
              ? (r.downloadURL || r.secure_url || '/bookmark.svg') 
              : r.type === 'application/pdf' 
              ? '/2.2_Scales.pdf' 
              : '/bookmark.svg',
            resource_type: r.type?.startsWith('image/') ? 'image' : 'raw',
            fields: [
              r.category || '', 
              r.format || r.type?.split('/')[1] || '',
              `${((r.size || r.fileSize || 0) / 1024 / 1024).toFixed(1)}MB`, // حجم الملف
              r.provider === 'github' ? '🐙 GitHub' : r.provider === 'supabase' ? '⚡ Supabase' : '🔥 Firebase', // مصدر التخزين 
              (r.createdAt && r.createdAt.toDate) ? r.createdAt.toDate().toLocaleDateString('ar-SA') : ''
            ]
          }));
          setMaterials(mapped);
        } catch (error) {
          console.log('Error fetching materials from Firestore', error);
        }
      };

      useEffect(() => {
        fetchmaterials();
        // re-run when auth state changes (so user's own uploads show)
      }, []);

      return (
        <>
          <div className="h-[15vh]" />
          <NavBar />
          <MaterialIntro image={categoryimage} length={materials.length} category={cardData[categoryid-1].domain}/>
          <SearchBar />
          {/* قائمة مباشرة من الملفات الحية من Firestore مع فلترة حسب الفئة */}
          <FileList max={100} categorySlug={cardData[categoryid-1].urlparams} />
          {materials.slice(0,5).map((material) =>
          (
            <MaterialCard material={material} key={material.id} id={material.id} />
          ))}
          <Footer />
          <BackToTop />
        </>
      );
  };
  return (
    <>
    <div>
      <h1>404 Not Found</h1>
    </div>

    </>
  )
};

export default MaterialsPage;