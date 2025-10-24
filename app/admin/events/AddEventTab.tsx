"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  FieldSet,
} from "@/components/ui/field";
import { Calendar } from "@/components/ui/calendar";
import { Plus, CalendarIcon, CalendarDays, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface AddEventTabProps {
  userId: string | null;
  onCreated: () => void;
}

export default function AddEventTab({ userId, onCreated }: AddEventTabProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [ajkList, setAjkList] = useState([{ name: "", max_members: "" }]);

  const handleAjkChange = (index: number, field: string, value: string) => {
    const updated = [...ajkList];
    (updated[index] as any)[field] = value;
    setAjkList(updated);
  };

  const addAjkRow = () => {
    setAjkList([...ajkList, { name: "", max_members: "" }]);
  };

  const removeAjkRow = (index: number) => {
    setAjkList(ajkList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    if (ajkList.some((ajk) => !ajk.name || !ajk.max_members)) {
      toast.error("Please fill in all AJK fields");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        created_by: userId,
        ajk_list: ajkList, // 👈 send AJK list together
      }),
    });

    const result = await res.json();
    if (result.error) toast.error(result.error);
    else {
      toast.success("Event and AJK roles added successfully!");
      setForm({ name: "", description: "" });
      setStartDate(new Date());
      setEndDate(new Date());
      setAjkList([{ name: "", max_members: "" }]);
      onCreated();
    }

    setLoading(false);
  };

  return (
    <Card className="border-border/50 shadow-lg max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Plus className="h-6 w-6 text-primary" />
          Create New Event
        </CardTitle>
        <CardDescription>
          Fill in the details below to create a new event
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldGroup className="space-y-6">
              <Field>
                <FieldLabel>Event Name</FieldLabel>
                <Input
                  placeholder="Enter event name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Event Description</FieldLabel>
                <Textarea
                  placeholder="Describe your event details"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    Start Date
                  </FieldLabel>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                  />
                </Field>

                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    End Date
                  </FieldLabel>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                  />
                </Field>
              </div>

              {/* 🧾 AJK List Section */}
              <Field>
                <FieldLabel>AJK Roles</FieldLabel>
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-2 bg-muted text-sm font-semibold text-muted-foreground border-b">
                    <div className="p-2 text-center">AJK Name</div>
                    <div className="p-2 text-center">Max Members</div>
                  </div>
                  {ajkList.map((ajk, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 border-b last:border-none items-center"
                    >
                      <Input
                        value={ajk.name}
                        placeholder="e.g. AJK Program"
                        onChange={(e) =>
                          handleAjkChange(index, "name", e.target.value)
                        }
                        className="m-2"
                        required
                      />
                      <div className="flex items-center gap-2 m-2">
                        <Input
                          type="number"
                          value={ajk.max_members}
                          placeholder="e.g. 5"
                          onChange={(e) =>
                            handleAjkChange(
                              index,
                              "max_members",
                              e.target.value,
                            )
                          }
                          required
                        />
                        {ajkList.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeAjkRow(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={addAjkRow}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add AJK Row
                </Button>
              </Field>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-medium gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                    Creating Event...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    Create Event
                  </>
                )}
              </Button>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}
