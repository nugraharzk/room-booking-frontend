import { render, screen, waitFor } from "@testing-library/react";
import RoomsPage from "./RoomsPage";
import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "@/lib/api";

// Mock dependencies
vi.mock("@/lib/api");

describe("RoomsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders rooms list", async () => {
    // Mock API response
    (api.get as any).mockResolvedValue({
      data: [{ id: "1", name: "Room A", capacity: 10, location: "Floor 1" }],
    });

    render(<RoomsPage />);

    expect(screen.getByText(/available rooms/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Room A")).toBeInTheDocument();
      expect(screen.getByText(/capacity: 10/i)).toBeInTheDocument();
    });
  });

  it("handles empty state", async () => {
    (api.get as any).mockResolvedValue({ data: [] });

    render(<RoomsPage />);

    await waitFor(() => {
      expect(screen.queryByText("Room A")).not.toBeInTheDocument();
    });
  });
});
