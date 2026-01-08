import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { IconButton } from "@/app/components/ui/IconButton";

describe("IconButton", () => {
  test("renders with default variant", () => {
    render(
      <IconButton onClick={() => {}} aria-label="Close">
        X
      </IconButton>
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("rounded-full");
  });

  test("applies fab variant styles", () => {
    render(
      <IconButton onClick={() => {}} aria-label="Open" variant="fab">
        <span>?</span>
      </IconButton>
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("rounded-xl", "font-pixel");
  });

  test("renders label when provided with fab variant", () => {
    render(
      <IconButton onClick={() => {}} aria-label="Log" variant="fab" label="LOG">
        <svg data-testid="icon" />
      </IconButton>
    );
    expect(screen.getByText("LOG")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  test("does not render label with default variant", () => {
    render(
      <IconButton onClick={() => {}} aria-label="Close" label="CLOSE">
        X
      </IconButton>
    );
    expect(screen.queryByText("CLOSE")).not.toBeInTheDocument();
  });

  test("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <IconButton onClick={handleClick} aria-label="Click me">
        X
      </IconButton>
    );
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("forwards ref correctly", () => {
    const ref = { current: null } as React.RefObject<HTMLButtonElement>;
    render(
      <IconButton ref={ref} onClick={() => {}} aria-label="Test">
        X
      </IconButton>
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  test("applies custom className", () => {
    render(
      <IconButton
        onClick={() => {}}
        aria-label="Test"
        className="custom-class"
      >
        X
      </IconButton>
    );
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  test("renders children correctly", () => {
    render(
      <IconButton onClick={() => {}} aria-label="Test">
        <span data-testid="child">Icon</span>
      </IconButton>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  test("has proper aria-label", () => {
    render(
      <IconButton onClick={() => {}} aria-label="Close dialog">
        X
      </IconButton>
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Close dialog"
    );
  });
});

