import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { SIDEBAR_ITEMS, SAVED_ITEMS, APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex md:flex-col h-screen">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 text-white rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <h1 className="ml-3 text-xl font-bold text-primary-600 dark:text-primary-400">{APP_NAME}</h1>
          </div>
        </div>
        
        <nav className="p-4 flex-1 space-y-1 overflow-y-auto">
          {SIDEBAR_ITEMS.map(item => (
            <Link key={item.path} href={item.path}>
              <div
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg",
                  location === item.path 
                    ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400" 
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                )}
              >
                <span className="material-icons mr-3">{item.icon}</span>
                {item.name}
              </div>
            </Link>
          ))}
          
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Saved Items</h3>
          </div>
          
          {SAVED_ITEMS.map(item => (
            <Link key={item.path} href={item.path}>
              <div className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700">
                <span className="material-icons mr-3">{item.icon}</span>
                {item.name}
              </div>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                  {user?.name?.charAt(0) || user?.username?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                  {user?.name || user?.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <ThemeToggle />
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                title="Logout"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
