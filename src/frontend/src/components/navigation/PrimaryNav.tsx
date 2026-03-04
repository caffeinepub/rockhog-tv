import { Link } from "@tanstack/react-router";
import { useIsAdmin } from "../../hooks/useAuthz";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { CATEGORIES } from "../../utils/category";

export default function PrimaryNav() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();

  const isAuthenticated = !!identity;

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-6 overflow-x-auto py-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category.value}
              to="/category/$categoryId"
              params={{ categoryId: category.value }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors"
              activeProps={{
                className: "text-foreground",
              }}
            >
              {category.label}
            </Link>
          ))}
          {isAuthenticated && (
            <>
              <Link
                to="/creator-studio"
                className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors"
                activeProps={{
                  className: "text-foreground",
                }}
              >
                Creator Studio
              </Link>
              <Link
                to="/earnings"
                className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors"
                activeProps={{
                  className: "text-foreground",
                }}
              >
                Earnings
              </Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link
                to="/admin/bacon-cash-requests"
                className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 whitespace-nowrap transition-colors"
                activeProps={{
                  className: "text-amber-700 dark:text-amber-300",
                }}
              >
                Bacon Cash Requests
              </Link>
              <Link
                to="/admin/withdrawals"
                className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 whitespace-nowrap transition-colors"
                activeProps={{
                  className: "text-amber-700 dark:text-amber-300",
                }}
              >
                Withdrawal Requests
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
