import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAccessToken } from '../api/auth.api';  
import { getAdminData } from '../api/admin.api';  
import { AppDispatch } from '../redux/store';
import Layout from '@/pages/features/layout';

const PrivateRoute: React.FC = () => {
  const [loading, setLoading] = useState(true); 
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  const dispatch = useDispatch<AppDispatch>();  

  useEffect(() => {
    const fetchAccessToken = async () => {
      const response = await getAccessToken();
      
      if (response.accessToken) {
        setIsAuthenticated(true);
        
        dispatch(getAdminData()) 
          .then(() => {
            setLoading(false);
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération des données de l'admin:", error);
            setLoading(false);  
          });
      } else {
        setIsAuthenticated(false);
        setLoading(false);  
      }
    };

    fetchAccessToken();
  }, [dispatch]); 

  if (loading) {
    return <div></div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default PrivateRoute;
