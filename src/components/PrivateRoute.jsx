import { useUser } from 'context/userContext';
import React from 'react';

const PrivateRoute = ({ roleList, children }) => {
  const { userData } = useUser();

  if (roleList.includes(userData.rol)) {
    return children;
  }

  return <div className='text-6xl text-red-500 text-center'>Acceso Restringido</div>;
};

export default PrivateRoute;
