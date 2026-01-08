import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "@/app/components/ui/Button";

describe("Button", () => {
  test("renders with primary variant by default", () => {
    render(<Button onClick={() => {}}>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-white");
  });

  test("applies emerald variant styles", () => {
    render(<Button onClick={() => {}} variant="emerald">Execute</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-emerald-500", "font-pixel");
  });

  test("applies secondary variant styles", () => {
    render(<Button onClick={() => {}} variant="secondary">Secondary</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("border", "bg-white/5");
  });

  test("applies fullWidth class when fullWidth is true", () => {
    render(<Button onClick={() => {}} fullWidth>Click</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  test("does not apply fullWidth class when fullWidth is false", () => {
    render(<Button onClick={() => {}}>Click</Button>);
    expect(screen.getByRole("button")).not.toHaveClass("w-full");
  });

  test("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("forwards ref correctly", () => {
    const ref = { current: null } as React.RefObject<HTMLButtonElement>;
    render(<Button ref={ref} onClick={() => {}}>Click</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  test("applies custom className", () => {
    render(
      <Button onClick={() => {}} className="custom-class">
        Click
      </Button>
    );
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  test("renders children correctly", () => {
    render(<Button onClick={() => {}}>Test Button</Button>);
    expect(screen.getByText("Test Button")).toBeInTheDocument();
  });
});

