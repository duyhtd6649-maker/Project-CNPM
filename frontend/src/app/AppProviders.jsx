import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

const AppProviders = () => {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};

export default AppProviders;