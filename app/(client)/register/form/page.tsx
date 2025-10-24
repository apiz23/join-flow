"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { User, IdCard, Phone, Users, ArrowRight } from "lucide-react";

export default function RegisterFormPage() {
  const [formData, setFormData] = useState({
    name: "",
    matric_no: "",
    phone: "",
    committee: "",
  });
  const [ajkList, setAjkList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    const token = localStorage.getItem("ajk_token");
    if (!token) {
      router.push("/register");
      return;
    }

    const fetchAjkList = async () => {
      try {
        const res = await fetch(`/api/ajk?token=${token}`);
        const result = await res.json();

        if (res.ok) {
          setAjkList(result.data || []);
        } else {
          toast.error(result.error || "Failed to fetch AJK list.");
        }
      } catch {
        toast.error("Server connection error.");
      }
    };

    fetchAjkList();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/ajk/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-event-token": localStorage.getItem("ajk_token") || "",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          "✅ Registration successful! Thank you for participating.",
        );
        setFormData({ name: "", matric_no: "", phone: "", committee: "" });
      } else {
        toast.error(`❌ ${result.error}`);
      }
    } catch {
      toast.error("❌ System error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isFormIncomplete =
    !formData.name ||
    !formData.matric_no ||
    !formData.phone ||
    !formData.committee;

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Committee Registration
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Join our team and help make this event a success
          </p>
        </div>

        {/* Form Card */}
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold">
              Registration Form
            </CardTitle>
            <CardDescription>
              Please fill in all required fields below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-primary" />
                  Full Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  ref={inputRef}
                  className="h-11"
                />
              </div>

              {/* Matric Number Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="matric_no"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <IdCard className="h-4 w-4 text-primary" />
                  Matric Number
                </Label>
                <Input
                  type="text"
                  id="matric_no"
                  name="matric_no"
                  required
                  value={formData.matric_no}
                  onChange={handleChange}
                  placeholder="e.g., A123456"
                  className="h-11"
                />
              </div>

              {/* Phone Number Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., 0123456789"
                  className="h-11"
                />
              </div>

              {/* Committee Selection */}
              <div className="space-y-2">
                <Label
                  htmlFor="committee"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Users className="h-4 w-4 text-primary" />
                  Committee Choice
                </Label>
                <Select
                  value={formData.committee}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, committee: value }))
                  }
                >
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder="Select a committee" />
                  </SelectTrigger>
                  <SelectContent>
                    {ajkList.map((ajk) => (
                      <SelectItem
                        key={ajk.id}
                        value={ajk.id}
                        disabled={ajk.available_members === 0}
                        className="text-sm"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{ajk.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {ajk.available_members ?? 0} of {ajk.max_members}{" "}
                            spots available
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || isFormIncomplete}
                className="w-full h-11 text-base font-medium gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    Submit Registration
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Form Status */}
              {isFormIncomplete && !loading && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  Please fill in all fields to continue
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Need help? Contact the event organizers
          </p>
        </div>
      </div>
    </div>
  );
}
