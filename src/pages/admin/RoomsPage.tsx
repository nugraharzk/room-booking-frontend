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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import type { Room } from "@/types";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await api.get<Room[]>("/rooms/all");
      setRooms(res.data);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (room: Room) => {
    try {
      await api.patch(`/rooms/${room.id}/active`, { isActive: !room.isActive });
      setRooms(rooms.map(r => r.id === room.id ? { ...r, isActive: !r.isActive } : r));
    } catch (err) {
      console.error("Failed to toggle room active status", err);
    }
  };

  const openCreate = () => {
    setName("");
    setCapacity(1);
    setLocation("");
    setIsCreateOpen(true);
  };

  const openEdit = (room: Room) => {
    setEditingRoom(room);
    setName(room.name);
    setCapacity(room.capacity);
    setLocation(room.location || "");
  };

  const handleCreate = async () => {
    try {
      const res = await api.post<Room>("/rooms", { name, capacity, location });
      setRooms([...rooms, res.data]);
      setIsCreateOpen(false);
    } catch (err) {
      console.error("Failed to create room", err);
    }
  };

  const handleUpdate = async () => {
    if (!editingRoom) return;
    try {
      const res = await api.put<Room>(`/rooms/${editingRoom.id}`, { name, capacity, location });
      setRooms(rooms.map(r => r.id === editingRoom.id ? res.data : r));
      setEditingRoom(null);
    } catch (err) {
      console.error("Failed to update room", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Room
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.location || "-"}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>
                    <Badge variant={room.isActive ? "success" : "destructive"}>
                      {room.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(room)}>
                      Edit
                    </Button>
                    <Button
                      variant={room.isActive ? "destructive" : "default"}
                      size="sm"
                      onClick={() => toggleActive(room)}
                    >
                      {room.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" type="number" min="1" value={capacity} onChange={e => setCapacity(parseInt(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreate}>Create Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingRoom} onOpenChange={(open) => !open && setEditingRoom(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-capacity">Capacity</Label>
              <Input id="edit-capacity" type="number" min="1" value={capacity} onChange={e => setCapacity(parseInt(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input id="edit-location" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
