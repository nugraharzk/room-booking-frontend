import { render, screen, waitFor } from "@testing-library/react";
import UsersPage from "./UsersPage";
import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "@/lib/api";

// Mock dependencies
vi.mock("@/lib/api");

describe("Admin UsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Local ResizeObserver mock
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it('renders "Add User" button', async () => {
    // Mock API response
    (api.get as any).mockResolvedValue({
      data: [
        {
          id: "1",
          firstName: "Admin",
          lastName: "User",
          email: "admin@example.com",
          role: "Admin",
          isActive: true,
          createdAt: "2023-01-01",
        },
      ],
    });

    render(<UsersPage />);

    expect(screen.getByText(/user management/i)).toBeInTheDocument();

    // Check for "Add User" button
    expect(
      screen.getByRole("button", { name: /add user/i })
    ).toBeInTheDocument();
  });

  it("opens add user dialog on click", async () => {
    (api.get as any).mockResolvedValue({ data: [] });
    render(<UsersPage />);

    const addButton = screen.getByRole("button", { name: /add user/i });
    addButton.click();

    await waitFor(() => {
      // Look for the dialog title
      expect(
        screen.getByRole("heading", { name: /add new user/i })
      ).toBeInTheDocument();
    });
  });
});
