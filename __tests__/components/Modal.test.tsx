import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Modal } from "@/app/components/ui/Modal";
import {
  AuthorContent,
  CheatContent,
  ResetProgressContent,
  WelcomeContent,
} from "@/app/components/ui/Modal/content";

describe("Modal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("does not render when closed", () => {
      render(
        <Modal open={false} onClose={() => {}} title="Test Modal">
          <p>Test content</p>
        </Modal>
      );
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    test("renders when open", async () => {
      render(
        <Modal open onClose={() => {}} title="Test Modal">
          <p>Test content</p>
        </Modal>
      );

      // Wait for animation to complete
      await waitFor(
        () => {
          expect(screen.getByRole("dialog")).toBeInTheDocument();
        },
        { timeout: 300 }
      );
    });

    test("displays title", async () => {
      render(
        <Modal open onClose={() => {}} title="TEST TITLE">
          <p>Test content</p>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByText("TEST TITLE")).toBeInTheDocument();
      });
    });

    test("displays children content", async () => {
      render(
        <Modal open onClose={() => {}} title="Test Modal">
          <p>Test content</p>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByText("Test content")).toBeInTheDocument();
      });
    });

    test("uses ariaLabel when provided", async () => {
      render(
        <Modal
          open
          onClose={() => {}}
          title="Test Modal"
          ariaLabel="Custom aria label"
        >
          <p>Test content</p>
        </Modal>
      );

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("aria-label", "Custom aria label");
      });
    });

    test("falls back to title for aria-label when ariaLabel not provided", async () => {
      render(
        <Modal open onClose={() => {}} title="Test Modal">
          <p>Test content</p>
        </Modal>
      );

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("aria-label", "Test Modal");
      });
    });
  });

  describe("Content Types", () => {
    test("renders WelcomeContent", async () => {
      render(
        <Modal open onClose={() => {}} title="WELCOME">
          <WelcomeContent />
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByText(/CONTROLS:/i)).toBeInTheDocument();
        expect(screen.getByText(/TRY THESE CHEATS:/i)).toBeInTheDocument();
      });
    });

    test("renders CheatContent", async () => {
      render(
        <Modal open onClose={() => {}} title="CHEAT UNLOCKED">
          <CheatContent cheat={{ id: "konami", name: "Konami Code" }} />
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByText("Konami Code")).toBeInTheDocument();
        expect(screen.getByText(/Nice. Keep playing/i)).toBeInTheDocument();
      });
    });

    test("renders ResetProgressContent", async () => {
      render(
        <Modal open onClose={() => {}} title="RESET PROGRESS">
          <ResetProgressContent />
        </Modal>
      );

      await waitFor(() => {
        expect(
          screen.getByText(/Are you sure you want to reset/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/Your input log will remain/i)).toBeInTheDocument();
      });
    });

    test("renders AuthorContent", async () => {
      render(
        <Modal open onClose={() => {}} title="ABOUT">
          <AuthorContent />
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByText(/Built and maintained by/i)).toBeInTheDocument();
        expect(screen.getByText("@avicrayyy")).toBeInTheDocument();
        expect(screen.getByText("daviddomingo.dev")).toBeInTheDocument();
      });
    });
  });

  describe("Closing Methods", () => {
    test("closes when close icon button is clicked", async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();

      render(
        <Modal open onClose={onClose} title="Test Modal">
          <p>Test content</p>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      const closeButtons = screen.getAllByRole("button", { name: "Close" });
      await user.click(closeButtons[0]);

      await waitFor(
        () => {
          expect(onClose).toHaveBeenCalledTimes(1);
        },
        { timeout: 400 }
      );
    });

    test("closes when footer button is clicked", async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();

      render(
        <Modal
          open
          onClose={onClose}
          title="Test Modal"
          footerButtonText="Close"
        >
          <p>Test content</p>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Get all buttons with "Close" and click the footer button (last one)
      const closeButtons = screen.getAllByRole("button", { name: /close/i });
      const footerButton = closeButtons[closeButtons.length - 1];
      await user.click(footerButton);

      await waitFor(
        () => {
          expect(onClose).toHaveBeenCalledTimes(1);
        },
        { timeout: 400 }
      );
    });

    test("closes when Escape key is pressed", async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();

      render(
        <Modal open onClose={onClose} title="Test Modal">
          <p>Test content</p>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      await user.keyboard("{Escape}");

      await waitFor(
        () => {
          expect(onClose).toHaveBeenCalledTimes(1);
        },
        { timeout: 400 }
      );
    });

    test("closes when backdrop is clicked", async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();

      render(
        <Modal open onClose={onClose} title="Test Modal">
          <p>Test content</p>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Click on the backdrop (the outer div with role="dialog")
      const dialog = screen.getByRole("dialog");
      await user.click(dialog);

      await waitFor(
        () => {
          expect(onClose).toHaveBeenCalledTimes(1);
        },
        { timeout: 400 }
      );
    });

    test("does not close when modal content is clicked", async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();

      render(
        <Modal open onClose={onClose} title="Test Modal">
          <p>Test content</p>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Click on the modal content (not the backdrop)
      const content = screen.getByText("Test content");
      await user.click(content);

      // onClose should not be called
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("Footer Button", () => {
    test("displays default footer button text", async () => {
      render(
        <Modal open onClose={() => {}} title="Test Modal">
          <p>Test content</p>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByText("Lez Ge Tit")).toBeInTheDocument();
      });
    });

    test("displays custom footer button text", async () => {
      render(
        <Modal
          open
          onClose={() => {}}
          title="Test Modal"
          footerButtonText="Custom Text"
        >
          <p>Test content</p>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByText("Custom Text")).toBeInTheDocument();
      });
    });

    test("calls onConfirm when footer button is clicked", async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      const onConfirm = jest.fn();

      render(
        <Modal
          open
          onClose={onClose}
          onConfirm={onConfirm}
          title="Test Modal"
          footerButtonText="Confirm"
        >
          <p>Test content</p>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole("button", { name: "Confirm" });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });

    test("does not call onConfirm when footer button is clicked without onConfirm prop", async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();

      render(
        <Modal
          open
          onClose={onClose}
          title="Test Modal"
          footerButtonText="Close Modal"
        >
          <p>Test content</p>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      const footerButton = screen.getByRole("button", { name: "Close Modal" });
      await user.click(footerButton);

      await waitFor(() => {
        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Focus Management", () => {
    test("focuses close button when modal opens", async () => {
      render(
        <Modal open onClose={() => {}} title="Test Modal">
          <p>Test content</p>
        </Modal>
      );

      await waitFor(
        () => {
          const closeButtons = screen.getAllByRole("button", { name: "Close" });
          expect(closeButtons[0]).toHaveFocus();
        },
        { timeout: 300 }
      );
    });
  });

  describe("Accessibility", () => {
    test("has role='dialog'", async () => {
      render(
        <Modal open onClose={() => {}} title="Test Modal">
          <p>Test content</p>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    test("has aria-modal='true'", async () => {
      render(
        <Modal open onClose={() => {}} title="Test Modal">
          <p>Test content</p>
        </Modal>
      );

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("aria-modal", "true");
      });
    });

    test("close button has aria-label", async () => {
      render(
        <Modal open onClose={() => {}} title="Test Modal">
          <p>Test content</p>
        </Modal>
      );

      await waitFor(() => {
        const closeButtons = screen.getAllByRole("button", { name: "Close" });
        expect(closeButtons[0]).toHaveAttribute("aria-label", "Close");
      });
    });
  });

  describe("Animations", () => {
    test("removes from DOM after close animation", async () => {
      const { rerender } = render(
        <Modal open onClose={() => {}} title="Test Modal">
          <p>Test content</p>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Close the modal
      rerender(
        <Modal open={false} onClose={() => {}} title="Test Modal">
          <p>Test content</p>
        </Modal>
      );

      // Wait for animation to complete (200ms)
      await waitFor(
        () => {
          expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        },
        { timeout: 400 }
      );
    });
  });
});

