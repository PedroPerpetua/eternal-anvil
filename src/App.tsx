import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

import ProtectedRoutes from './components/website/ProtectedRoutes';
import WebsiteLayout from './components/website/WebsiteLayout';
import LoginCallbackPage from './pages/LoginCallbackPage';
import RealmManagerPage from './pages/realm-manager/RealmManagerPage';
import RootPage from './pages/RootPage';

const router = createBrowserRouter(createRoutesFromElements(
  <Route element={<WebsiteLayout />}>
    <Route path="/" element={<RootPage />} />
    <Route path="/login-callback" element={<LoginCallbackPage />} />
    <Route element={<ProtectedRoutes />}>
      <Route path="/realm-manager">
        <Route path="" element={<RealmManagerPage />} />
      </Route>
    </Route>
  </Route>,
));

function App() {
  return (<RouterProvider router={router} />);
}

export default App;
