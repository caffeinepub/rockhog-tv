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
import SignUpPage from './pages/SignUpPage';
import AIChatPage from './pages/AIChatPage';
import ChatRoomPage from './pages/ChatRoomPage';
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

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign-up',
  component: SignUpPage,
});

const aiChatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ai-chat',
  component: AIChatPage,
});

const chatRoomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat-room',
  component: ChatRoomPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  categoryRoute,
  streamRoute,
  creatorStudioRoute,
  buyBaconCashRoute,
  adminBaconCashRoute,
  contactRoute,
  signUpRoute,
  aiChatRoute,
  chatRoomRoute,
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
