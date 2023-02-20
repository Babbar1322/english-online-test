import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import TestResultPage from './pages/TestResultPage';
import Page404 from './pages/Page404';
import TotalTestPage from './pages/TotalTestPage';
import PendingTestPage from './pages/PendingTestPage';
import CompletedTestPage from './pages/CompletedTestPage';
import DashboardAppPage from './pages/DashboardAppPage';

//
import TestDashboardLayout from './layouts/testDashboard';
import TestDashboard from './pages/TestDashboard';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'total-test', element: <TotalTestPage /> },
        { path: 'pending-test', element: <PendingTestPage /> },
        { path: 'completed-test', element: <CompletedTestPage /> },
        { path: 'test-result', element: <TestResultPage /> },
        { path: 'settings', element: <SettingsPage /> },
        // { path: 'test', element: <TestDashboard /> },
      ],
    },
    {
      path: '/test',
      element: <TestDashboardLayout />,
      children: [
        {
          element: <Navigate to="/test/dashboard" />,
          index: true,
        },
        { path: 'dashboard', element: <TestDashboard /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '/',
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        // { path: '404', element: <Page404 /> },
        { path: '*', element: <Page404 /> },
      ],
    },
    {
      path: '*',
      element: <Page404 />,
    },
  ]);

  return routes;
}
