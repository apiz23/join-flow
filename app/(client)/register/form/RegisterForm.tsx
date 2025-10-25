"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { User, IdCard, Phone, Users, ArrowRight } from "lucide-react";

export default function RegisterForm({
  formData,
  setFormData,
  ajkList,
  loading,
  inputRef,
  handleSubmit,
  eventName,
}: any) {
  const isFormIncomplete =
    !formData.name ||
    !formData.matric_no ||
    !formData.email ||
    !formData.phone ||
    !formData.committee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {eventName && (
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-primary">{eventName}</h2>
        </div>
      )}

      {/* Name */}
      <FormField
        id="name"
        label="Full Name"
        icon={<User className="h-4 w-4 text-primary" />}
        placeholder="Enter your full name"
        value={formData.name}
        onChange={handleChange}
        ref={inputRef}
      />

      {/* Matric Number */}
      <FormField
        id="matric_no"
        label="Matric Number"
        icon={<IdCard className="h-4 w-4 text-primary" />}
        placeholder="e.g., A123456"
        value={formData.matric_no}
        onChange={handleChange}
      />

      {/* Email */}
      <FormField
        id="email"
        label="Email Address"
        icon={<IdCard className="h-4 w-4 text-primary" />}
        placeholder="e.g., example@domain.com"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />

      {/* Phone */}
      <FormField
        id="phone"
        label="Phone Number"
        icon={<Phone className="h-4 w-4 text-primary" />}
        placeholder="e.g., 0123456789"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
      />

      {/* Committee */}
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
            setFormData((prev: any) => ({ ...prev, committee: value }))
          }
        >
          <SelectTrigger className="w-full h-11">
            <SelectValue placeholder="Select a committee" />
          </SelectTrigger>
          <SelectContent>
            {ajkList.map((ajk: any) => (
              <SelectItem
                key={ajk.id}
                value={ajk.id}
                disabled={ajk.available_members === 0}
                className="text-sm"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{ajk.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {ajk.available_members ?? 0} of {ajk.max_members} spots
                    available
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Submit */}
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

      {isFormIncomplete && !loading && (
        <p className="text-xs text-muted-foreground text-center pt-2">
          Please fill in all fields to continue
        </p>
      )}
    </form>
  );
}

const FormField = ({ id, label, icon, ...props }: any) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium flex items-center gap-2">
      {icon}
      {label}
    </Label>
    <Input id={id} name={id} className="h-11" {...props} />
  </div>
);
