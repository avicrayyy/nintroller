import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CheatModal } from "@/app/components/CheatModal";

describe("CheatModal", () => {
  test("does not render when closed", () => {
    render(
      <CheatModal open={false} cheat={{ id: "abba", name: "ABBA" }} onClose={() => {}} />
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("renders cheat name when open and closes via button", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(<CheatModal open cheat={{ id: "abba", name: "ABBA" }} onClose={onClose} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("ABBA")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});


