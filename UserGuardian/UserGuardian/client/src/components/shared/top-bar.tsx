import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

interface TopBarProps {
  toggleSidebar?: () => void;
}

export default function TopBar({ toggleSidebar }: TopBarProps) {
  const { user, loginMutation, logoutMutation } = useAuth();

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 py-4 px-6 flex items-center justify-between md:justify-end">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Menu</span>
      </Button>
      
      <div className="flex items-center space-x-4">
        {user ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="px-3 py-1.5 text-sm font-medium"
          >
            Sign Out
          </Button>
        ) : (
          <>
            <Link href="/auth">
              <Button
                variant="ghost"
                size="sm"
                className="px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth?register=true">
              <Button
                size="sm"
                className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition"
              >
                Register
              </Button>
            </Link>
          </>
        )}
        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
