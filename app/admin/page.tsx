import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  FileText,
  Settings,
  ArrowUpRight,
  TrendingUp,
  Eye,
  Download,
} from "lucide-react";

export default function AdminPage() {
  const stats = [
    {
      title: "Total Registrations",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Users,
      description: "From last month",
    },
    {
      title: "Active Events",
      value: "8",
      change: "+2",
      trend: "up",
      icon: Calendar,
      description: "Currently running",
    },
    {
      title: "Pending Approvals",
      value: "23",
      change: "-5",
      trend: "down",
      icon: FileText,
      description: "Awaiting review",
    },
    {
      title: "Completion Rate",
      value: "94%",
      change: "+3%",
      trend: "up",
      icon: TrendingUp,
      description: "Registration success",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "New committee registration",
      user: "Ahmad bin Ismail",
      time: "2 minutes ago",
      status: "pending",
    },
    {
      id: 2,
      action: "Event status updated",
      user: "Digital Innovathon",
      time: "1 hour ago",
      status: "completed",
    },
    {
      id: 3,
      action: "User account created",
      user: "siti_rahim@email.com",
      time: "3 hours ago",
      status: "completed",
    },
    {
      id: 4,
      action: "Payment received",
      user: "Nurul Huda",
      time: "5 hours ago",
      status: "completed",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage events, committees, and registrations
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="relative overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge
                      variant={stat.trend === "up" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {stat.change}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </CardContent>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <Card className="lg:col-span-2 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Recent Activities
              </CardTitle>
              <CardDescription>
                Latest actions and updates in the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:bg-accent/50 transition-colors duration-200"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.user}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        activity.status === "completed"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {activity.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Frequently used admin functions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-12"
              >
                <Users className="h-4 w-4" />
                Manage Committees
                <ArrowUpRight className="h-4 w-4 ml-auto" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-12"
              >
                <Calendar className="h-4 w-4" />
                Create Event
                <ArrowUpRight className="h-4 w-4 ml-auto" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-12"
              >
                <FileText className="h-4 w-4" />
                View Reports
                <ArrowUpRight className="h-4 w-4 ml-auto" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-12"
              >
                <Settings className="h-4 w-4" />
                System Settings
                <ArrowUpRight className="h-4 w-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
