import { render, screen } from "@testing-library/react";
import MyBookingsPage from "./MyBookingsPage";
import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "@/lib/api";

// Mock dependencies
vi.mock("@/lib/api");

describe("MyBookingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page title", async () => {
    // Mock API response
    (api.get as any).mockResolvedValue({ data: [] });

    render(<MyBookingsPage />);

    expect(
      screen.getByRole("heading", { name: /my bookings/i })
    ).toBeInTheDocument();
  });
});
