// Exemple de page
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setBreadcrumb } from '@/redux/slices/breadcrumbSlice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBreadcrumb({
      segments: ['Accueil'],
      links: ['/office/dashboard'],
    }));
  }, [dispatch]);

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;
