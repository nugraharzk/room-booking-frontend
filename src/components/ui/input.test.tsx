import { render, screen } from "@testing-library/react";
import { Input } from "./input";
import { describe, it, expect } from "vitest";

describe("Input", () => {
  it("renders correctly", () => {
    render(<Input type="text" placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("applies custom classes", () => {
    render(<Input data-testid="input" className="custom-class" />);
    expect(screen.getByTestId("input")).toHaveClass("custom-class");
    expect(screen.getByTestId("input")).toHaveClass("flex"); // Base class
  });

  it("handles disabled state", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
