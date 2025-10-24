"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TokenPage() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/events/validate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (data.valid) {
        localStorage.setItem("ajk_token", token);
        toast.success("✅ Token valid! Redirecting...");
        router.push("/register/form");
      } else {
        setError("❌ Invalid token. Please check again.");
      }
    } catch (err) {
      console.error(err);
      setError("❌ Error occurred while validating the token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-3 text-foreground">
          AJK Registration Access
        </h1>
        <p className="text-muted-foreground mb-6">
          Enter the event token to proceed to the registration form.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter event token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition-colors"
            disabled={loading}
          >
            {loading ? "Checking..." : "Validate Token"}
          </Button>
        </form>

        {error && (
          <div className="mt-4 bg-destructive/10 text-destructive p-3 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
