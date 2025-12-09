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
import Swal from "sweetalert2";

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
    const result = await Swal.fire({
      title: "Approve Booking?",
      text: "Are you sure you want to approve this booking?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    });

    if (!result.isConfirmed) return;

    try {
      await api.post(`/bookings/${id}/confirm`);
      // Optimistic update
      setBookings(
        bookings.map((b) => (b.id === id ? { ...b, status: "Confirmed" } : b))
      );
      Swal.fire({
        title: "Approved!",
        text: "Booking has been approved successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Failed to approve booking", err);
      Swal.fire("Error", "Failed to approve booking", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the booking.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/bookings/${id}`);
      setBookings(bookings.filter((b) => b.id !== id));
      Swal.fire("Deleted!", "Booking has been deleted.", "success");
    } catch (err) {
      console.error("Failed to delete booking", err);
      Swal.fire("Error!", "Failed to delete booking.", "error");
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
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {booking.status === "Pending" && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(booking.id)}
                        >
                          Approve
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(booking.id)}
                      >
                        Delete
                      </Button>
                    </div>
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
