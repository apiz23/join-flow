"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Trash2, CalendarIcon, Clock, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import useMobile from "@/lib/useMobile";
import { Snippet } from "@/components/snippet";
import { cn } from "@/lib/utils";
interface ExistingEventsTabProps {
  events: any[];
  onEventUpdate?: () => void;
}

export default function ExistingEventsTab({
  events,
  onEventUpdate,
}: ExistingEventsTabProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const isMobile = useMobile();

  const handleDelete = async (id: string) => {
    if (!id) return toast.error("Invalid event ID");
    if (!confirm("Are you sure you want to delete this event?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) toast.success("Event deleted successfully!");
      else toast.error(data.error || "Failed to delete event");
      onEventUpdate?.();
    } catch {
      toast.error("Error deleting event");
    } finally {
      setDeletingId(null);
    }
  };

  const getEventStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return { status: "Upcoming", color: "bg-blue-500" };
    if (now >= start && now <= end)
      return { status: "Ongoing", color: "bg-green-500" };
    return { status: "Completed", color: "bg-gray-500" };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Your Events
            </CardTitle>
            <Badge
              variant="secondary"
              className="text-sm font-medium px-3 py-1"
            >
              {events.length} event{events.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-muted/30 rounded-2xl p-8 max-w-md mx-auto border border-border/50">
                <CalendarIcon className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No events yet
                </h3>
                <p className="text-muted-foreground">
                  Create your first event to get started
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const status = getEventStatus(event.start_date, event.end_date);

                return (
                  <Drawer
                    key={event.id}
                    direction={isMobile ? "bottom" : "right"}
                  >
                    <DrawerTrigger asChild>
                      <Card className="border-border/30 hover:border-primary/40 hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden bg-gradient-to-br from-card to-card/80">
                        <div
                          className={`absolute top-4 right-4 w-3 h-3 rounded-full ${status.color} ring-2 ring-background`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <CardContent className="p-6 relative">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-foreground text-lg leading-tight line-clamp-2 mb-2">
                                  {event.name}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="text-xs font-medium"
                                >
                                  {status.status}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(event.id);
                                }}
                                disabled={deletingId === event.id}
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                              >
                                {deletingId === event.id ? (
                                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                              </Button>
                            </div>

                            {event.description && (
                              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                {event.description}
                              </p>
                            )}

                            <div className="space-y-3 pt-3 border-t border-border/30">
                              <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span className="font-medium text-foreground">
                                    Starts:
                                  </span>
                                </div>
                                <span className="text-foreground">
                                  {formatDate(event.start_date)}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span className="font-medium text-foreground">
                                    Ends:
                                  </span>
                                </div>
                                <span className="text-foreground">
                                  {formatDate(event.end_date)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-primary font-medium pt-2">
                              <span>View details</span>
                              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DrawerTrigger>

                    <DrawerContent
                      className={cn(isMobile ? "h-[80vh]" : "max-w-[40vw]")}
                    >
                      <DrawerHeader className="border-b border-border/50 pb-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <DrawerTitle className="text-xl font-bold leading-tight mb-2">
                              {event.name}
                            </DrawerTitle>
                            {event.description && (
                              <p className="text-muted-foreground leading-relaxed">
                                {event.description}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline" className="flex-shrink-0">
                            {status.status}
                          </Badge>
                        </div>
                      </DrawerHeader>

                      <div className="p-6 space-y-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-primary" />
                            Event Schedule
                          </h4>
                          <div className="grid grid-cols-1 gap-3 pl-6">
                            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-border/30">
                              <span className="text-sm font-medium text-foreground">
                                Start Date
                              </span>
                              <span className="text-sm text-foreground font-mono">
                                {new Date(
                                  event.start_date,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-border/30">
                              <span className="text-sm font-medium text-foreground">
                                End Date
                              </span>
                              <span className="text-sm text-foreground font-mono">
                                {new Date(event.end_date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            Event Information
                          </h4>
                          <div className="pl-6 space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">
                                Created
                              </span>
                              <span className="font-medium text-foreground">
                                {new Date(
                                  event.created_at,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {event.ajk_token && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">
                                  AJK Token
                                </span>
                                <span className="font-mono text-foreground bg-muted px-2 py-1 rounded text-xs">
                                  <Snippet
                                    text={event.ajk_token}
                                    onCopy={() => alert("You copied the text!")}
                                  />
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <DrawerFooter className="border-t border-border/50 pt-4">
                        <div className="flex gap-3">
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(event.id)}
                            disabled={deletingId === event.id}
                            className="flex-1 gap-2"
                          >
                            {deletingId === event.id ? (
                              <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4" />
                                Delete Event
                              </>
                            )}
                          </Button>
                          <DrawerClose asChild>
                            <Button variant="outline" className="flex-1">
                              Close
                            </Button>
                          </DrawerClose>
                        </div>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
