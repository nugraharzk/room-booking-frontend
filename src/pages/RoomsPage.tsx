import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Room } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, MapPin, CalendarPlus } from "lucide-react";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const { user } = useAuth(); // Unused for now

  // Booking State
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [subject, setSubject] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await api.get<Room[]>("/rooms");
      setRooms(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load rooms. Please make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedRoom || !date || !startTime || !endTime) return;

    setBookingLoading(true);
    try {
      // Construct ISO strings
      // Note: simplistic approach, assumes local time
      const start = new Date(`${date}T${startTime}:00`).toISOString();
      const end = new Date(`${date}T${endTime}:00`).toISOString();

      await api.post("/bookings", {
        roomId: selectedRoom.id,
        start,
        end,
        subject,
      });

      setOpen(false);
      alert("Booking created successfully!");
    } catch (err: any) {
      console.error(err);
      alert("Failed to create booking: " + (err.response?.data || err.message));
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Available Rooms</h1>
      </div>

      {loading && <div>Loading rooms...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room.id} className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {room.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                {room.location || "No location info"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Capacity: {room.capacity}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog open={open && selectedRoom?.id === room.id} onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (isOpen) setSelectedRoom(room);
              }}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Book Room
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Book {room.name}</DialogTitle>
                    <DialogDescription>
                      Select specific time range to book this room.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        className="col-span-3"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="start" className="text-right">
                        Start
                      </Label>
                      <Input
                        id="start"
                        type="time"
                        className="col-span-3"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="end" className="text-right">
                        End
                      </Label>
                      <Input
                        id="end"
                        type="time"
                        className="col-span-3"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="subject" className="text-right">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        placeholder="Meeting title..."
                        className="col-span-3"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" onClick={handleBook} disabled={bookingLoading}>
                      {bookingLoading ? "Booking..." : "Confirm Booking"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
