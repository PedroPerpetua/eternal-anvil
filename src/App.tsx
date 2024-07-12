import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

import ProtectedRoutes from './components/website/ProtectedRoutes';
import WebsiteLayout from './components/website/WebsiteLayout';
import LoginPage from './pages/LoginPage';
import RealmManagerPage from './pages/RealmManagerPage';
import RootPage from './pages/RootPage';

const router = createBrowserRouter(createRoutesFromElements(
  <Route element={<WebsiteLayout />}>
    <Route path="/" element={<RootPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoutes />}>
      <Route path="/realm-manager" element={<RealmManagerPage />} />
    </Route>
  </Route>,
));

function App() {
  return (<RouterProvider router={router} />);
}

export default App;
