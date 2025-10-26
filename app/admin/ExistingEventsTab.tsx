"use client";

import { useEffect, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, CalendarIcon, Clock, ArrowUpRight, Users } from "lucide-react";
import { toast } from "sonner";
import { Snippet } from "@/components/snippet";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import useMobile from "@/lib/useMobile";

interface ExistingEventsTabProps {
  events: any[];
  onEventUpdate?: () => void;
}

export default function ExistingEventsTab({
  events,
  onEventUpdate,
}: ExistingEventsTabProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [ajkLists, setAjkLists] = useState<Record<string, any[]>>({});
  const isMobile = useMobile();

  const fetchAjkList = async (eventToken: string, eventId: string) => {
    try {
      const res = await fetch(`/api/ajk?token=${eventToken}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to fetch AJK list");
        return;
      }
      setAjkLists((prev) => ({ ...prev, [eventId]: data.data }));
    } catch {
      toast.error("Error fetching AJK list");
    }
  };

  useEffect(() => {
    events.forEach((event) => {
      if (event.token) fetchAjkList(event.token, event.id);
    });
  }, [events]);

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

  const getTotalRegistrations = (ajkList: any[]) => {
    return ajkList.reduce((total, ajk) => total + ajk.registrations.length, 0);
  };

  const handleExportCSV = (event: any, ajkList: any[]) => {
    if (!ajkList || ajkList.length === 0) {
      toast.error("No data to export for this event");
      return;
    }

    try {
      const rows: any[] = [];

      ajkList.forEach((ajk: any) => {
        if (ajk.registrations.length > 0) {
          ajk.registrations.forEach((reg: any) => {
            let registeredAt = "-";

            // ✅ Safely format created_at for MY timezone
            if (reg.created_at) {
              try {
                const dateValue =
                  typeof reg.created_at === "string"
                    ? reg.created_at
                    : reg.created_at?.toString();

                const date = new Date(dateValue);

                if (!isNaN(date.getTime())) {
                  registeredAt = date.toLocaleString("en-MY", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                    timeZone: "Asia/Kuala_Lumpur", // ✅ ensure MY time
                  });
                } else {
                  console.warn("Invalid created_at:", reg.created_at);
                }
              } catch (err) {
                console.error("Error formatting created_at:", err);
              }
            }

            rows.push({
              "Event Name": event.name || "-",
              "AJK Name": ajk.name || "-",
              "Member Name": reg.name || "-",
              "Matric No": reg.matric_no || "-",
              Phone: reg.phone || "-",
              Email: reg.email || "-",
              "Registered At": registeredAt,
            });
          });
        } else {
          // Empty AJK (no members)
          rows.push({
            "Event Name": event.name || "-",
            "AJK Name": ajk.name || "-",
            "Member Name": "-",
            "Matric No": "-",
            Phone: "-",
            Email: "-",
            "Registered At": "-",
          });
        }
      });

      // ✅ Generate CSV with quotes, header & correct newline
      const csv = Papa.unparse(rows, {
        quotes: true,
        header: true,
        newline: "\r\n",
      });

      // ✅ Add BOM for Excel UTF-8 compatibility
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });

      // ✅ Filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `${event.name
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_registrations_${timestamp}.csv`;

      saveAs(blob, filename);
      toast.success(`CSV exported successfully! (${rows.length} rows)`);
    } catch (error) {
      console.error("CSV Export Error:", error);
      toast.error("Failed to export CSV");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4 flex items-center justify-between">
          <CardTitle className="text-2xl font-bold bg-Linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Your Events
          </CardTitle>
          <Badge variant="secondary" className="text-sm font-medium px-3 py-1">
            {events.length} event{events.length !== 1 ? "s" : ""}
          </Badge>
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
                const ajkList = ajkLists[event.id] || [];
                const totalRegistrations = getTotalRegistrations(ajkList);

                return (
                  <Drawer
                    key={event.id}
                    direction={isMobile ? "bottom" : "right"}
                  >
                    <DrawerTrigger asChild>
                      <Card className="border-border/30 hover:border-primary/40 hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden bg-Linear-to-br from-card to-card/80">
                        <div
                          className={`absolute top-4 right-4 w-3 h-3 rounded-full ${status.color} ring-2 ring-background`}
                        />
                        <CardContent className="p-6 relative">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-foreground text-lg leading-tight line-clamp-2 mb-2">
                                  {event.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-medium"
                                  >
                                    {status.status}
                                  </Badge>
                                  {totalRegistrations > 0 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      <Users className="h-3 w-3 mr-1" />
                                      {totalRegistrations}
                                    </Badge>
                                  )}
                                </div>
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

                            <div className="flex items-center gap-2 text-xs text-primary font-medium pt-2">
                              <span>View details</span>
                              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DrawerTrigger>

                    <DrawerContent className="w-full md:min-w-fit min-h-[60vh] sm:max-w-none mx-auto">
                      <DrawerHeader className="border-b border-border/50 pb-4">
                        <div className="flex items-start justify-between gap-4 px-5">
                          <DrawerTitle className="text-2xl font-bold leading-tight mb-2">
                            {event.name}
                          </DrawerTitle>
                          {event.description && (
                            <p className="text-muted-foreground leading-relaxed text-base">
                              {event.description}
                            </p>
                          )}
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <Badge variant="outline" className="text-sm">
                              {status.status}
                            </Badge>
                            {totalRegistrations > 0 && (
                              <Badge variant="secondary" className="text-sm">
                                <Users className="h-3 w-3 mr-1" />
                                {totalRegistrations} registrations
                              </Badge>
                            )}
                          </div>
                        </div>
                      </DrawerHeader>

                      <div className="flex-1 overflow-y-auto">
                        <div className="p-6 space-y-8">
                          {/* Event Schedule */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                              <CalendarIcon className="h-5 w-5 text-primary" />
                              Event Schedule
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg border border-border/30">
                                <div className="space-y-1">
                                  <span className="text-sm font-medium text-foreground">
                                    Start Date
                                  </span>
                                  <span className="text-sm text-muted-foreground block">
                                    {new Date(
                                      event.start_date,
                                    ).toLocaleDateString("en-US", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg border border-border/30">
                                <div className="space-y-1">
                                  <span className="text-sm font-medium text-foreground">
                                    End Date
                                  </span>
                                  <span className="text-sm text-muted-foreground block">
                                    {new Date(
                                      event.end_date,
                                    ).toLocaleDateString("en-US", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Event Information */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                              <Clock className="h-5 w-5 text-primary" />
                              Event Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg border border-border/30">
                                <span className="text-sm font-medium text-foreground">
                                  Created Date
                                </span>
                                <span className="text-sm text-foreground">
                                  {new Date(
                                    event.created_at,
                                  ).toLocaleDateString()}
                                </span>
                              </div>

                              {event.token && (
                                <div className="flex justify-between items-center gap-6 p-4 bg-muted/30 rounded-lg border border-border/30">
                                  <span className="text-sm font-medium text-foreground">
                                    Event Token
                                  </span>
                                  <div className="flex justify-end">
                                    <Snippet
                                      text={event.token}
                                      type="success"
                                      onCopy={() =>
                                        toast.success("Copied successfully!")
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* AJK Committees & Registrations */}
                          {ajkList.length > 0 && (
                            <div className="space-y-4">
                              <h4 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                                <Users className="h-5 w-5 text-primary" />
                                Committees & Registrations
                              </h4>
                              <div className="space-y-4 pl-6">
                                {ajkList.map((ajk: any) => (
                                  <Card
                                    key={ajk.id}
                                    className="border-border/30"
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start mb-3">
                                        <div>
                                          <h5 className="font-semibold text-foreground">
                                            {ajk.name}
                                          </h5>
                                          <p className="text-sm text-muted-foreground">
                                            {ajk.registrations.length} of{" "}
                                            {ajk.max_members} members registered
                                            {ajk.available_members > 0 && (
                                              <span className="text-green-500 ml-2">
                                                ({ajk.available_members}{" "}
                                                available)
                                              </span>
                                            )}
                                          </p>
                                        </div>
                                        <Badge
                                          variant={
                                            ajk.available_members === 0
                                              ? "destructive"
                                              : "outline"
                                          }
                                          className="text-xs"
                                        >
                                          {ajk.available_members === 0
                                            ? "Full"
                                            : "Open"}
                                        </Badge>
                                      </div>

                                      {ajk.registrations.length > 0 ? (
                                        <div className="overflow-x-auto">
                                          <Table>
                                            <TableCaption>
                                              A list of members registered under{" "}
                                              {ajk.name}.
                                            </TableCaption>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead className="w-[50px]">
                                                  No
                                                </TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Matric No</TableHead>
                                                <TableHead>Phone</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead className="text-right">
                                                  Registered At
                                                </TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {ajk.registrations.map(
                                                (
                                                  registration: any,
                                                  index: number,
                                                ) => (
                                                  <TableRow
                                                    key={registration.id}
                                                  >
                                                    <TableCell className="font-medium">
                                                      {index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                      {registration.name}
                                                    </TableCell>
                                                    <TableCell>
                                                      {registration.matric_no}
                                                    </TableCell>
                                                    <TableCell>
                                                      {registration.phone}
                                                    </TableCell>
                                                    <TableCell>
                                                      {registration.email ||
                                                        "-"}
                                                    </TableCell>
                                                    <TableCell className="text-right text-muted-foreground">
                                                      {registration.created_at
                                                        ? new Date(
                                                            registration.created_at,
                                                          ).toLocaleString(
                                                            "en-MY",
                                                            {
                                                              year: "numeric",
                                                              month: "2-digit",
                                                              day: "2-digit",
                                                              hour: "2-digit",
                                                              minute: "2-digit",
                                                              hour12: true,
                                                              timeZone:
                                                                "Asia/Kuala_Lumpur",
                                                            },
                                                          )
                                                        : "-"}
                                                    </TableCell>
                                                  </TableRow>
                                                ),
                                              )}
                                            </TableBody>
                                          </Table>
                                        </div>
                                      ) : (
                                        <div className="text-center py-8 px-4">
                                          <div className="bg-muted/20 rounded-2xl p-6 border border-dashed border-border/50">
                                            <Users className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                                            <h4 className="font-medium text-foreground mb-1">
                                              No Registrations Yet
                                            </h4>
                                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                              Participants will appear here once
                                              they register for this committee
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <DrawerFooter className="border-t border-border/50 pt-4">
                        <div className="flex flex-wrap gap-3">
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
                          <Button
                            variant="secondary"
                            onClick={() => handleExportCSV(event, ajkList)}
                            className="flex-1 gap-2"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                            Export as CSV
                          </Button>
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
