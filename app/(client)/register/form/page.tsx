"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import { useRegister } from "./useRegister";
import RegisterForm from "./RegisterForm";
import RegisteredSuccess from "./RegisteredSuccess";

export default function RegisterFormPage() {
  const { registered, groupLink, eventName, ...formProps } = useRegister();
  console.log(eventName);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
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

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold">
              Registration Form
            </CardTitle>
            <CardDescription>
              {registered
                ? "You're already registered!"
                : "Please fill in all required fields below"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!registered ? (
              <RegisterForm {...formProps} eventName={eventName} />
            ) : (
              <RegisteredSuccess groupLink={groupLink} eventName={eventName} />
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Need help? Contact the event organizers
          </p>
        </div>
      </div>
    </div>
  );
}
