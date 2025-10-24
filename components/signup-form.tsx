"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; // ✅ store before await
    setLoading(true);

    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      toast.success("Account created successfully!");
      form.reset(); // ✅ safe now
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border-0 shadow-none" {...props}>
      <CardHeader className="text-center space-y-2 pb-6">
        <CardTitle className="text-2xl font-bold">Join JoinFlow</CardTitle>
        <CardDescription className="text-base">
          Create your account to get started
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit}>
          <FieldGroup className="space-y-4">
            {/* Full Name Field */}
            <Field>
              <FieldLabel htmlFor="name" className="text-sm font-medium">
                Full Name
              </FieldLabel>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="pl-10 h-11"
                />
              </div>
            </Field>

            {/* Email Field */}
            <Field>
              <FieldLabel htmlFor="email" className="text-sm font-medium">
                Email
              </FieldLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  className="pl-10 h-11"
                />
              </div>
              <FieldDescription className="text-xs mt-1">
                We'll use this to contact you
              </FieldDescription>
            </Field>

            {/* Password Fields */}
            <div className="grid grid-cols-1 gap-4">
              <Field>
                <FieldLabel htmlFor="password" className="text-sm font-medium">
                  Password
                </FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="*******"
                    required
                    className="pl-10 h-11"
                  />
                </div>
              </Field>
            </div>

            {/* Action Buttons */}
            <FieldGroup className="space-y-3">
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
