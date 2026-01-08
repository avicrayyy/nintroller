import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Modal } from "@/app/components/Modal";
import { CheatContent } from "@/app/components/Modal/content";

describe("CheatModal", () => {
  test("does not render when closed", () => {
    render(
      <Modal
        open={false}
        onClose={() => {}}
        title="CHEAT UNLOCKED"
        footerButtonText="Continue"
      >
        <CheatContent cheat={{ id: "abba", name: "ABBA" }} />
      </Modal>
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("renders cheat name when open and closes via button", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <Modal
        open
        onClose={onClose}
        title="CHEAT UNLOCKED"
        footerButtonText="Continue"
      >
        <CheatContent cheat={{ id: "abba", name: "ABBA" }} />
      </Modal>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("ABBA")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});


