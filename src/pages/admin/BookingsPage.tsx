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
import type { Booking } from "@/types";
import { format } from "date-fns";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get<Booking[]>("/bookings/all");
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
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
      <h1 className="text-3xl font-bold tracking-tight">All Bookings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Global Booking History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Booked On</TableHead>
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
                  <TableCell>{format(new Date(booking.createdAt), "PPP")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
