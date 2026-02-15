import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { AuthGate } from './components/auth/AuthGate';
import { AppShell } from './components/layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import BrandsPage from './pages/BrandsPage';
import BrandDetailPage from './pages/brands/BrandDetailPage';
import MarketingPage from './pages/MarketingPage';
import CROPage from './pages/CROPage';
import ProductsPage from './pages/ProductsPage';
import OperationsPage from './pages/OperationsPage';
import TasksPage from './pages/TasksPage';
import ReportsPage from './pages/ReportsPage';
import KnowledgePage from './pages/KnowledgePage';
import SettingsPage from './pages/SettingsPage';
import AccessControlPage from './pages/settings/AccessControlPage';

const rootRoute = createRootRoute({
  component: () => (
    <AuthGate>
      <AppShell />
    </AuthGate>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const brandsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/brands',
  component: BrandsPage,
});

const brandDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/brands/$brandName',
  component: BrandDetailPage,
});

const marketingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/marketing',
  component: MarketingPage,
});

const croRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cro',
  component: CROPage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductsPage,
});

const operationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/operations',
  component: OperationsPage,
});

const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks',
  component: TasksPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ReportsPage,
});

const knowledgeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/knowledge',
  component: KnowledgePage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const accessControlRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings/access-control',
  component: AccessControlPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  brandsRoute,
  brandDetailRoute,
  marketingRoute,
  croRoute,
  productsRoute,
  operationsRoute,
  tasksRoute,
  reportsRoute,
  knowledgeRoute,
  settingsRoute,
  accessControlRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
