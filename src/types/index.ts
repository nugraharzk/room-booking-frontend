export interface Room {
  id: string;
  name: string;
  location?: string;
  capacity: number;
  isActive: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  roomId: string;
  createdByUserId: string;
  subject?: string;
  start: string;
  end: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}
