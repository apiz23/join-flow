// app/profile/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Mail,
  Key,
  User as UserIcon,
  Lock,
  Edit,
  Save,
  X,
  Shield,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  password: string;
  created_at?: string;
  updated_at?: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    if (!token) {
      toast.error("No session token found. Please log in.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile?token=${token}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch profile");

        setUser(data.user);
        setEditForm({ email: data.user.email, password: "" });
      } catch (err: any) {
        toast.error(err.message || "Unable to load profile.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEditing = () => {
    if (user) {
      setEditForm({ email: user.email, password: "" });
    }
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!editForm.email) {
      toast.error("Email cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("session_token");

    const updateData = {
      email: editForm.email,
      ...(editForm.password && { password: editForm.password }),
    };

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to update profile.");

      setUser((prev) => (prev ? { ...prev, ...data.user } : null));

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Error updating profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground font-medium">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">
              Profile Unavailable
            </CardTitle>
            <CardDescription>
              Please check your session or login again
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => (window.location.href = "/login")}
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-background md:pt-0 pt-48 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3">
            Profile Settings
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview Card */}
          <Card className="lg:col-span-1 border-border/50 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserIcon className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold">
                Account Overview
              </CardTitle>
              <CardDescription>Your profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge variant="secondary" className="text-sm mb-2">
                  {user.role.toUpperCase()}
                </Badge>
                <p className="text-foreground font-medium text-sm break-all">
                  {user.email}
                </p>
              </div>

              {/* Account Stats */}
              <div className="space-y-3 pt-4 border-t border-border/30">
                {user.created_at && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Joined {formatDate(user.created_at)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Account verified</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Card */}
          <Card className="lg:col-span-2 border-border/50 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Edit Profile
                </CardTitle>
                <CardDescription>
                  Update your account information
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button
                  variant="outline"
                  onClick={startEditing}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    form="profile-form"
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={cancelEditing}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent>
              <form
                id="profile-form"
                onSubmit={handleUpdate}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email Field */}
                  <div className="space-y-3 md:col-span-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4 text-primary" />
                      Email Address
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="h-11"
                        required
                      />
                    ) : (
                      <div className="p-3 bg-muted/50 rounded-lg border border-border">
                        <p className="text-foreground font-medium">
                          {user.email}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-3 md:col-span-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4 text-primary" />
                      {isEditing ? "New Password" : "Password"}
                    </Label>
                    {isEditing ? (
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={editForm.password}
                        onChange={handleEditChange}
                        placeholder="Enter new password to change"
                        className="h-11"
                      />
                    ) : (
                      <div className="p-3 bg-muted/50 rounded-lg border border-border">
                        <p className="text-muted-foreground font-mono text-sm">
                          ••••••••••••••••••••••••••••••••
                        </p>
                      </div>
                    )}
                    {isEditing && (
                      <p className="text-xs text-muted-foreground">
                        Leave blank to keep your current password
                      </p>
                    )}
                  </div>

                  {/* Read-only Fields */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      User ID
                    </Label>
                    <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                      <p className="text-muted-foreground font-mono text-xs break-all">
                        {user.id}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      Account Role
                    </Label>
                    <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                  </div>
                </div>

                {/* Edit Mode Action Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-6 border-t border-border/30">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Updating Profile...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEditing}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      Discard Changes
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
