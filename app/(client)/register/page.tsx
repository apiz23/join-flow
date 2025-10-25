"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Key, ArrowRight, Shield, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function TokenPage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (value: string) => {
    setToken(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        toast.error("❌ Invalid token. Please check again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error occurred while validating the token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-linear-to-br from-background via-primary/5 to-accent/5">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="bg-linear-to-br from-primary to-primary/80 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Key className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full p-1 shadow-lg">
              <Lock className="h-3 w-3" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Event Access
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter your event token to continue
          </p>
        </div>

        {/* Token Form Card */}
        <Card className="border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <Shield className="h-5 w-5 text-primary" />
              Enter Event Token
            </CardTitle>
            <CardDescription className="text-base">
              Provide the 6-character token from your event organizer
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup className="space-y-6">
                <Field>
                  <FieldLabel htmlFor="token" className="sr-only">
                    Event Token
                  </FieldLabel>
                  <div className="flex justify-center">
                    <InputOTP
                      id="token"
                      maxLength={6}
                      value={token}
                      onChange={handleChange}
                      required
                      containerClassName="gap-4"
                    >
                      {/* All 6 characters in one group */}
                      <InputOTPGroup className="gap-3 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-xl *:data-[slot=input-otp-slot]:border-2 *:data-[slot=input-otp-slot]:text-xl *:data-[slot=input-otp-slot]:font-semibold *:data-[slot=input-otp-slot]:transition-all *:data-[slot=input-otp-slot]:shadow-sm hover:*:data-[slot=input-otp-slot]:border-primary/50">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </Field>

                <Field>
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium gap-2 relative overflow-hidden group"
                    disabled={loading || token.length !== 6}
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                    {loading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent relative z-10" />
                        <span className="relative z-10">
                          Validating Token...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">
                          Continue to Registration
                        </span>
                        <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="mt-8 border-primary/20 bg-primary/5 backdrop-blur-sm my-5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Secure Event Access
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your token ensures secure, authorized access to the event
                  registration portal. Keep this token confidential and only
                  share with intended participants.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
