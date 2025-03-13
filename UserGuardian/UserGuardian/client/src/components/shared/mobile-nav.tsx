import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

type MobileNavItem = {
  icon: string;
  label: string;
  path: string;
};

const navItems: MobileNavItem[] = [
  { icon: "chat", label: "Assistant", path: "/" },
  { icon: "search", label: "Research", path: "/research" },
  { icon: "mic", label: "Speech", path: "/speech" },
  { icon: "menu", label: "More", path: "/more" },
];

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 z-10">
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map(item => (
          <Link key={item.path} href={item.path}>
            <a className={cn(
              "flex flex-col items-center justify-center",
              location === item.path 
                ? "text-primary-600 dark:text-primary-400" 
                : "text-gray-500 dark:text-gray-400"
            )}>
              <span className="material-icons">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
