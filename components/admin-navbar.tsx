"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, LayoutDashboard, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminNavbar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("session_token");
    window.location.href = "/admin";
  };

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/events",
      label: "Events",
      icon: Calendar,
    },
  ];

  return (
    <nav className="fixed top-0 left-0  w-full bg-background/95 backdrop-blur-md border-b border-border z-50 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2 group">
              <div className="bg-primary text-primary-foreground w-8 h-8 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                Admin Panel
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground border-border hover:border-primary/50 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex-1 ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}