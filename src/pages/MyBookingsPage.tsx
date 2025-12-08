import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/types";
import { format } from "date-fns";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get<Booking[]>("/bookings/my");
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch my bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel?")) return;
    try {
      await api.post(`/bookings/${id}/cancel`);
      setBookings(bookings.map(b => b.id === id ? { ...b, status: "Cancelled" } : b));
    } catch (err) {
      console.error("Failed to cancel booking", err);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Confirmed": return "success";
      case "Cancelled": return "destructive";
      case "Completed": return "secondary";
      default: return "default"; // Pending
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.subject || "No Subject"}</TableCell>
                  <TableCell>{format(new Date(booking.start), "PPP p")}</TableCell>
                  <TableCell>{format(new Date(booking.end), "PPP p")}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {booking.status !== "Cancelled" && booking.status !== "Completed" && (
                      <Button variant="destructive" size="sm" onClick={() => cancelBooking(booking.id)}>
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
