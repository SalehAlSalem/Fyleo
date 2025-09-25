import { NavBar, MaterialIntro, MaterialCard, SearchBar, Footer, BackToTop } from '../../components';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import cardData from '../../config/CardData.mjs';
import { db, auth } from '../../../Firebase/ClientApp.mjs';
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
          // Map to the MaterialCard expected shape
          const mapped = visible.map(r => ({
            id: r.id,
            title: r.originalName || r.name || r.title || 'Untitled',
            // Firebase Storage uses downloadURL
            url: r.downloadURL || r.secure_url || r.image || '',
            image: r.type?.startsWith('image/') 
              ? (r.downloadURL || r.secure_url || '/bookmark.svg') 
              : r.type === 'application/pdf' 
              ? '/file-icon.svg' 
              : '/bookmark.svg',
            resource_type: r.type?.startsWith('image/') ? 'image' : 'raw',
            fields: [
              r.category || '', 
              r.format || r.type?.split('/')[1] || '', 
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