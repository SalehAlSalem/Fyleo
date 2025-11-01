/**
 * LegacyRedirect Component
 * Redirects old /materials routes to new /library routes
 */

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const LegacyRedirect = () => {
  const navigate = useNavigate();
  const params = useParams();
  
  useEffect(() => {
    // Build new path
    let newPath = '/library';
    
    if (params.categoryId) {
      newPath += `/${params.categoryId}`;
    }
    
    if (params.subjectId) {
      newPath += `/${params.subjectId}`;
    }
    
    // Permanent redirect
    navigate(newPath, { replace: true });
  }, [navigate, params]);
  
  return null;
};

export default LegacyRedirect;
