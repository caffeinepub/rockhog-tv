import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import AppLayout from "./components/layout/AppLayout";
import AdminBaconCashRequestsPage from "./pages/AdminBaconCashRequestsPage";
import AdminWithdrawalRequestsPage from "./pages/AdminWithdrawalRequestsPage";
import BrowseHomePage from "./pages/BrowseHomePage";
import BuyBaconCashPage from "./pages/BuyBaconCashPage";
import CategoryPage from "./pages/CategoryPage";
import ContactPage from "./pages/ContactPage";
import CreatorStudioPage from "./pages/CreatorStudioPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import SignUpPage from "./pages/SignUpPage";
import StreamDetailPage from "./pages/StreamDetailPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: BrowseHomePage,
});

const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/category/$categoryId",
  component: CategoryPage,
});

const streamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stream/$streamId",
  component: StreamDetailPage,
});

const creatorStudioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/creator-studio",
  component: CreatorStudioPage,
});

const buyBaconCashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/buy-bacon-cash",
  component: BuyBaconCashPage,
});

const adminBaconCashRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/bacon-cash-requests",
  component: AdminBaconCashRequestsPage,
});

const adminWithdrawalRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/withdrawals",
  component: AdminWithdrawalRequestsPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-up",
  component: SignUpPage,
});

const paymentHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/earnings",
  component: PaymentHistoryPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  categoryRoute,
  streamRoute,
  creatorStudioRoute,
  buyBaconCashRoute,
  adminBaconCashRequestsRoute,
  adminWithdrawalRequestsRoute,
  contactRoute,
  signUpRoute,
  paymentHistoryRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
