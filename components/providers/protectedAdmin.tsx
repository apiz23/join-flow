"use client";

import { useEffect, useState } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "../login-form";
import { SignupForm } from "../signup-form";
import supabase from "@/lib/supabase";
import Link from "next/link";

export default function ProtectedProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState("login");

  const checkSession = () => {
    const userId = localStorage.getItem("session_token");
    if (!userId) {
      setIsLoggedIn(false);
      return;
    }

    supabase
      .from("jf_users")
      .select("id")
      .eq("id", userId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          localStorage.removeItem("session_token");
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      });
  };

  useEffect(() => {
    checkSession();
    const handleStorageChange = () => checkSession();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (isLoggedIn === null) return <div>Checking session...</div>;
  if (!isLoggedIn) {
    return (
      <div className="grid min-h-svh lg:grid-cols-2">
        {/* Auth Forms */}
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link href="/" className="flex items-center gap-2 font-medium">
              <div className="flex items-center justify-center w-10 h-10 bg-linear-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                <span className="text-primary-foreground font-bold text-sm">
                  JF
                </span>
              </div>
              JoinFlow
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xl">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-full mb-8 min-h-[4vh] p-2">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Register
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-6 m-0">
                  <LoginForm onLogin={() => setIsLoggedIn(true)} />
                </TabsContent>

                <TabsContent value="register" className="space-y-6 m-0">
                  <SignupForm />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Right Panel Image */}
        <div className="bg-muted relative hidden lg:block">
          <img
            src="https://i.pinimg.com/1200x/7d/e1/9d/7de19d0c8738fb94a81ebc668952a017.jpg"
            alt="JoinFlow Dashboard"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex items-end p-10">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-2">JoinFlow</h2>
              <p className="text-white/80">
                Streamlining committee registrations and management
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
