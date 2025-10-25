"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, SquarePen } from "lucide-react";
import { toast } from "sonner";
import AddEventTab from "./AddEventTab";
import ExistingEventsTab from "./ExistingEventsTab";

export default function EventPage() {
  const [activeTab, setActiveTab] = useState("add");
  const [events, setEvents] = useState<any[]>([]);
  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("session_token")
      : null;

  const fetchEvents = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/events?user_id=${userId}`);
      const data = await res.json();
      if (data?.data) setEvents(data.data);
    } catch {
      toast.error("Failed to fetch events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [userId]);

  return (
    <div className="min-h-screen bg-background py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Event Management
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create and manage your events with ease. Schedule dates, add
            descriptions, and track all your activities.
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 min-h-[4vh] p-2">
            <TabsTrigger value="add" className="flex items-center gap-2">
              <SquarePen className="h-4 w-4" />
              Add Event
            </TabsTrigger>
            <TabsTrigger value="existing" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Existing Events
              {events.length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 min-w-5">
                  {events.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add">
            <AddEventTab
              userId={userId}
              onCreated={() => {
                fetchEvents();
                setActiveTab("existing");
              }}
            />
          </TabsContent>

          <TabsContent value="existing">
            <ExistingEventsTab events={events} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
