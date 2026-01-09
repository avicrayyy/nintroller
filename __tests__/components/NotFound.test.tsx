import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotFound from "@/app/not-found";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    target,
    rel,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    target?: string;
    rel?: string;
    className?: string;
  }) {
    return (
      <a href={href} target={target} rel={rel} className={className}>
        {children}
      </a>
    );
  };
});

describe("NotFound", () => {
  test("renders 404 heading", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  test("renders page not found message", () => {
    render(<NotFound />);
    expect(screen.getByText("PAGE NOT FOUND")).toBeInTheDocument();
  });

  test("renders easter egg message with clickable 'here' button", () => {
    render(<NotFound />);
    expect(
      screen.getByText(/I don't know what you're trying to do/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/but you won't find easter eggs/)
    ).toBeInTheDocument();

    const hereButton = screen.getByRole("button", { name: /here/i });
    expect(hereButton).toBeInTheDocument();
    expect(hereButton).toHaveClass("underline", "cursor-pointer");
  });

  test("renders return to controller link", () => {
    render(<NotFound />);
    const returnLink = screen.getByRole("link", {
      name: /return to controller/i,
    });
    expect(returnLink).toBeInTheDocument();
    expect(returnLink).toHaveAttribute("href", "/");
  });

  test("renders error code", () => {
    render(<NotFound />);
    expect(screen.getByText("ERROR CODE: 0x404")).toBeInTheDocument();
  });

  test("opens author modal when 'here' button is clicked", async () => {
    const user = userEvent.setup();
    render(<NotFound />);

    const hereButton = screen.getByRole("button", { name: /here/i });
    await user.click(hereButton);

    // Modal should be visible
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("ABOUT")).toBeInTheDocument();
  });

  test("displays author content in modal", async () => {
    const user = userEvent.setup();
    render(<NotFound />);

    const hereButton = screen.getByRole("button", { name: /here/i });
    await user.click(hereButton);

    expect(screen.getByText("Built and maintained by")).toBeInTheDocument();
    expect(screen.getByText("@avicrayyy")).toBeInTheDocument();
    expect(screen.getByAltText("David Domingo")).toBeInTheDocument();
  });

  test("displays GitHub link in modal", async () => {
    const user = userEvent.setup();
    render(<NotFound />);

    const hereButton = screen.getByRole("button", { name: /here/i });
    await user.click(hereButton);

    const githubLink = screen.getByRole("link", { name: "@avicrayyy" });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute("href", "https://github.com/avicrayyy");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("displays personal website link in modal", async () => {
    const user = userEvent.setup();
    render(<NotFound />);

    const hereButton = screen.getByRole("button", { name: /here/i });
    await user.click(hereButton);

    const websiteLink = screen.getByRole("link", { name: "daviddomingo.dev" });
    expect(websiteLink).toBeInTheDocument();
    expect(websiteLink).toHaveAttribute("href", "https://daviddomingo.dev");
    expect(websiteLink).toHaveAttribute("target", "_blank");
    expect(websiteLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("closes modal when close icon button is clicked", async () => {
    const user = userEvent.setup();
    render(<NotFound />);

    // Open modal
    const hereButton = screen.getByRole("button", { name: /here/i });
    await user.click(hereButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Close modal using icon button (aria-label="Close")
    // There are two "Close" buttons, get the first one (icon button)
    const closeButtons = screen.getAllByRole("button", { name: "Close" });
    await user.click(closeButtons[0]);

    // Modal should be closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("closes modal when footer button is clicked", async () => {
    const user = userEvent.setup();
    render(<NotFound />);

    // Open modal
    const hereButton = screen.getByRole("button", { name: /here/i });
    await user.click(hereButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Close modal using footer button (text "Close")
    // There are two "Close" buttons, get the last one (footer button)
    const closeButtons = screen.getAllByRole("button", { name: "Close" });
    await user.click(closeButtons[closeButtons.length - 1]);

    // Modal should be closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("closes modal when Escape key is pressed", async () => {
    const user = userEvent.setup();
    render(<NotFound />);

    // Open modal
    const hereButton = screen.getByRole("button", { name: /here/i });
    await user.click(hereButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Press Escape
    await user.keyboard("{Escape}");

    // Modal should be closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("'here' button has pointer cursor style", () => {
    render(<NotFound />);
    const hereButton = screen.getByRole("button", { name: /here/i });
    expect(hereButton).toHaveClass("cursor-pointer");
  });
});

