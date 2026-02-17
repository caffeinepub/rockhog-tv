import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import AppLayout from './components/layout/AppLayout';
import BrowseHomePage from './pages/BrowseHomePage';
import CategoryPage from './pages/CategoryPage';
import StreamDetailPage from './pages/StreamDetailPage';
import CreatorStudioPage from './pages/CreatorStudioPage';
import BuyBaconCashPage from './pages/BuyBaconCashPage';
import AdminBaconCashRequestsPage from './pages/AdminBaconCashRequestsPage';
import ContactPage from './pages/ContactPage';
import BaconOpsArenaPage from './pages/BaconOpsArenaPage';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: BrowseHomePage,
});

const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/category/$categoryName',
  component: CategoryPage,
});

const streamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stream/$streamId',
  component: StreamDetailPage,
});

const creatorStudioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/creator-studio',
  component: CreatorStudioPage,
});

const buyBaconCashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/buy-bacon-cash',
  component: BuyBaconCashPage,
});

const adminBaconCashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/bacon-cash-requests',
  component: AdminBaconCashRequestsPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const baconOpsArenaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bacon-ops-arena',
  component: BaconOpsArenaPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  categoryRoute,
  streamRoute,
  creatorStudioRoute,
  buyBaconCashRoute,
  adminBaconCashRoute,
  contactRoute,
  baconOpsArenaRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
