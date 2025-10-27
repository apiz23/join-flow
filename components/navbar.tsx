"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Users,
  Search,
  Settings,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/register", label: "Register Events", icon: Users },
    { href: "/admin", label: "Admin", icon: Settings },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full bg-background/95 backdrop-blur-md border-b transition-all duration-300 z-50",
        isScrolled
          ? "shadow-lg border-border/80 bg-background/90"
          : "shadow-sm border-border/40",
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 bg-linear-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                <span className="text-primary-foreground font-bold text-sm">
                  JF
                </span>
              </div>
              <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                JoinFlow
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                    isActive(link.href)
                      ? "text-primary bg-primary/10 dark:text-white shadow-inner"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>

                  {/* Active indicator */}
                  {isActive(link.href) && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
                  )}

                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-xl bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              );
            })}
            <ModeToggle />
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(true)}
              className="h-10 w-10 rounded-xl border border-border/50 hover:border-border hover:bg-accent/50 transition-all duration-300"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="h-[85vh] max-h-[85vh] rounded-t-3xl border-t-2 border-border/50">
          {/* Header */}
          <DrawerHeader className="flex flex-row items-center justify-between px-6 py-5 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-linear-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                <span className="text-primary-foreground font-bold text-sm">
                  JF
                </span>
              </div>
              <div className="flex">
                <DrawerTitle className="text-lg font-bold text-sidebar-foreground">
                  JoinFlow
                </DrawerTitle>
              </div>
            </div>
            <ModeToggle />
          </DrawerHeader>

          {/* Navigation Links */}
          <div className="flex-1 px-4 py-6 space-y-3 bg-sidebar">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "group relative flex items-center justify-between px-4 py-4 rounded-2xl border transition-all duration-300",
                    isActive(link.href)
                      ? "bg-sidebar-primary border-sidebar-primary/30 shadow-lg shadow-primary/10"
                      : "bg-sidebar/50 border-sidebar-border/50 hover:bg-sidebar-accent hover:border-sidebar-accent/30",
                  )}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300",
                        isActive(link.href)
                          ? "bg-sidebar-primary-foreground/20 shadow-inner"
                          : "bg-sidebar-border/30 group-hover:bg-sidebar-accent/50",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 transition-colors duration-300",
                          isActive(link.href)
                            ? "text-sidebar-primary-foreground"
                            : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground",
                        )}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          "font-semibold transition-colors duration-300",
                          isActive(link.href)
                            ? "text-sidebar-primary-foreground"
                            : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground",
                        )}
                      >
                        {link.label}
                      </span>
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {link.href === "/" && "Home page"}
                        {link.href === "/register" && "Committee registration"}
                        {link.href === "/status" && "Check application status"}
                        {link.href === "/admin" && "Administrator panel"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isActive(link.href) && (
                      <div className="w-2 h-2 bg-sidebar-primary-foreground rounded-full animate-pulse" />
                    )}
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        isActive(link.href)
                          ? "text-sidebar-primary-foreground"
                          : "text-muted-foreground group-hover:text-sidebar-accent-foreground group-hover:translate-x-0.5",
                      )}
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-sidebar-border bg-sidebar">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Streamlining committee registrations
              </p>
              <div className="flex justify-center items-center space-x-4 text-xs text-muted-foreground/60">
                <span>JoinFlow v1.0</span>
                <span>•</span>
                <span>Committee Portal</span>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </nav>
  );
}
