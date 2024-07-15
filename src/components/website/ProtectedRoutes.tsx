import { Navigate, Outlet } from 'react-router-dom';

import { useAuthContext } from '../../api/AuthContext';

function ProtectedRoutes() {
  const { userInfo, isLoading } = useAuthContext();
  if (isLoading) return null;
  if (!userInfo) return (<Navigate to="/" replace />);
  return (<Outlet />);
}

export default ProtectedRoutes;
