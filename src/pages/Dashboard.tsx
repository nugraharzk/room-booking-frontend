import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, CalendarDays } from "lucide-react";
import type { Booking } from "@/types";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint =
          user?.role === "Admin" || user?.role === "Manager"
            ? "/bookings"
            : "/bookings/my";
        const res = await api.get<Booking[]>(endpoint);
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  const activeBookingsCount = bookings.filter(
    (b) => b.status === "Pending" || b.status === "Confirmed"
  ).length;

  const stats = [
    {
      label:
        user?.role === "Admin" || user?.role === "Manager"
          ? "Global Active Bookings"
          : "My Active Bookings",
      value: activeBookingsCount.toString(),
    },
    // For Total Rooms we might need another endpoint or just keep mock/remove
    // { label: "Total Rooms", value: "3" },
  ];

  if (loading) return <div>Loading...</div>;

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
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <CalendarDays className="h-10 w-10 mb-4 opacity-20" />
              <p>No bookings found.</p>
              <Button variant="link" asChild className="mt-2">
                <Link to="/rooms">Book a room now</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {booking.subject || "No Subject"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(booking.start), "PPP p")} -{" "}
                      {booking.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
