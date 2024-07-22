import { Navigate, Outlet } from 'react-router-dom';

import { useUsersProfileRetrieve } from '../../api/queries/users';

function ProtectedRoutes() {
  const { data: userInfo, isLoading } = useUsersProfileRetrieve();
  if (isLoading) return null;
  if (!userInfo) return (<Navigate to="/" replace />);
  return (<Outlet />);
}

export default ProtectedRoutes;
