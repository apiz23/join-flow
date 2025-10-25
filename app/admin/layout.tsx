import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AdminNavbar from "@/components/admin-navbar";
import ProtectedProvider from "@/components/providers/protectedAdmin";
import { Toaster } from "sonner";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "JoinFlow Admin Dashboard",
  description: "Manage events, committees, and registrations efficiently.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors />
          <ProtectedProvider>
            <AdminNavbar />
            {children}
          </ProtectedProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
