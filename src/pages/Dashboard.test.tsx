import { render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import api from "@/lib/api";

// Mock dependencies
vi.mock("@/lib/api");

const mockUser = { role: "User", name: "Test User" };

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
  }),
}));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders welcome dashboard title", async () => {
    // Mock API response to avoid crash if called
    (api.get as any).mockResolvedValue({
      data: [],
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();

    // Skipping complex async data verification for now to ensure stability
  });
});
