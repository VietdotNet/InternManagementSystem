import { Link, useLocation } from "wouter";
import { LayoutDashboard, Map, ListChecks } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { MOCK_INTERN } from "@/shared/constants/app";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roadmap", label: "Training Roadmap", icon: Map },
  { href: "/reviews", label: "My Reviews", icon: ListChecks },
];

export function InternSidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 border-r bg-sidebar flex flex-col h-full flex-shrink-0">
      <div className="p-6 flex items-center gap-3 border-b">
        <Avatar data-testid="img-avatar-user">
          <AvatarFallback>{MOCK_INTERN.initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-sm" data-testid="text-username">
            {MOCK_INTERN.name}
          </span>
          <span className="text-xs text-muted-foreground">{MOCK_INTERN.role}</span>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
