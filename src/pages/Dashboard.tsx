import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, CalendarDays } from "lucide-react";

export default function Dashboard() {
  // In a real app we'd fetch stats here
  const stats = [
    { label: "Active Bookings", value: "0" },
    { label: "Total Rooms", value: "3" }, // Mock
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link to="/rooms">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Booking
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your recent room bookings will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <CalendarDays className="h-10 w-10 mb-4 opacity-20" />
            <p>No bookings found.</p>
            <Button variant="link" asChild className="mt-2">
              <Link to="/rooms">Book a room now</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
