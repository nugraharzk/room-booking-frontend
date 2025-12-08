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
import { Button } from "@/components/ui/button";
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
      const res = await api.get<Booking[]>("/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this booking?")) return;
    try {
      await api.post(`/bookings/${id}/confirm`);
      // Optimistic update or refetch
      setBookings(
        bookings.map((b) => (b.id === id ? { ...b, status: "Confirmed" } : b))
      );
    } catch (err) {
      console.error("Failed to approve booking", err);
      alert("Failed to approve booking");
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "success";
      case "Cancelled":
        return "destructive";
      case "Completed":
        return "secondary";
      default:
        return "default"; // Pending
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.subject || "No Subject"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(booking.start), "PPP p")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(booking.end), "PPP p")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(booking.createdAt), "PPP")}
                  </TableCell>
                  <TableCell className="text-right">
                    {booking.status === "Pending" && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApprove(booking.id)}
                      >
                        Approve
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
