"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminNavbar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("session_token");
    window.location.href = "/admin";
  };

  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3  shadow-sm">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="text-lg font-semibold text-gray-800 dark:text-gray-100"
          >
            Admin Panel
          </Link>
        </div>

        <div className="hidden md:flex gap-6 text-sm">
          <Link
            href="/admin"
            className={`${
              pathname === "/admin"
                ? "text-blue-600 font-medium"
                : "text-gray-600 dark:text-gray-300"
            } hover:text-blue-500 transition`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/events"
            className={`${
              pathname === "/admin/events"
                ? "text-blue-600 font-medium"
                : "text-gray-600 dark:text-gray-300"
            } hover:text-blue-500 transition`}
          >
            Events
          </Link>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-gray-700 dark:text-gray-200"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </nav>
  );
}
