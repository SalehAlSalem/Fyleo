import { NavBar, MaterialIntro, MaterialCard, SearchBar, Footer, BackToTop } from '../../components';
import FileList from '../../components/FileList';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import cardData from '../../config/CardData.mjs';
import { useAuth } from '../../hooks/useAuth';
import { DatabaseService } from '../../config/DatabaseService';


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
          const { user } = useAuth();
          const filesResponse = await DatabaseService.getAllFiles();
          const files = filesResponse.documents || [];
          
          // Filter by category
          const catSlug = cardData[categoryid-1].urlparams;
          const filteredFiles = files.filter(f => f.category === catSlug);
          
          // Filter approved OR owned by current user
          const visible = filteredFiles.filter(r => 
            r.approved === true || (user && r.uploadedBy === user.email)
          );
          
          // Map to the MaterialCard expected shape
          const mapped = visible.map(r => ({
            id: r.id,
            title: r.name || r.title || 'Untitled',
            url: r.url || '',
            image: r.type?.startsWith('image/') 
              ? (r.url || '/bookmark.svg') 
              : r.type === 'application/pdf' 
              ? '/2.2_Scales.pdf' 
              : '/bookmark.svg',
            resource_type: r.type?.startsWith('image/') ? 'image' : 'raw',
            fields: [
              r.category || '', 
              r.type?.split('/')[1] || '',
              `${((r.size || 0) / 1024 / 1024).toFixed(1)}MB`,
              '⚡ Appwrite',
              new Date(r.uploadedAt || Date.now()).toLocaleDateString('ar-SA')
            ]
          }));
          setMaterials(mapped);
        } catch (error) {
          console.log('Error fetching materials:', error);
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