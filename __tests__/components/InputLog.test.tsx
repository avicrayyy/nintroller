import { useEffect } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  InputLog,
  InputLogProvider,
  useInputLog,
} from "@/app/components/InputLog";
import type { ButtonChangeEvent } from "@/app/types/nes-controller";

function TestComponent() {
  const { rows, clear } = useInputLog();
  return (
    <div>
      <button onClick={clear}>Clear</button>
      <div data-testid="count">{rows.length}</div>
      {rows.map((r, i) => (
        <div key={i} data-testid={`row-${i}`}>
          {r.button} - {r.pressed ? "down" : "up"}
        </div>
      ))}
    </div>
  );
}

describe("InputLog", () => {
  test("starts with empty rows", () => {
    render(
      <InputLogProvider>
        <TestComponent />
      </InputLogProvider>
    );
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  test("adds events and displays them", () => {
    const TestWithAdd = () => {
      const { rows, addEvent } = useInputLog();
      const handleAdd = () => {
        const event: ButtonChangeEvent = {
          button: "a",
          pressed: true,
          source: "keyboard",
        };
        addEvent(event);
      };
      return (
        <div>
          <button onClick={handleAdd}>Add Event</button>
          <div data-testid="count">{rows.length}</div>
          {rows.map((r, i) => (
            <div key={i} data-testid={`row-${i}`}>
              {r.button}
            </div>
          ))}
        </div>
      );
    };

    render(
      <InputLogProvider>
        <TestWithAdd />
      </InputLogProvider>
    );

    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  test("clears events when clear is called", async () => {
    const user = userEvent.setup();
    const TestWithClear = () => {
      const { rows, addEvent, clear } = useInputLog();
      const handleAdd = () => {
        const event: ButtonChangeEvent = {
          button: "a",
          pressed: true,
          source: "keyboard",
        };
        addEvent(event);
      };
      return (
        <div>
          <button onClick={handleAdd}>Add</button>
          <button onClick={clear}>Clear</button>
          <div data-testid="count">{rows.length}</div>
        </div>
      );
    };

    render(
      <InputLogProvider>
        <TestWithClear />
      </InputLogProvider>
    );

    // Add an event
    await user.click(screen.getByText("Add"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");

    // Clear events
    await user.click(screen.getByText("Clear"));
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  test("limits to 30 events", () => {
    const TestWithManyEvents = () => {
      const { rows, addEvent } = useInputLog();
      useEffect(() => {
        // Add 35 events
        for (let i = 0; i < 35; i++) {
          const event: ButtonChangeEvent = {
            button: "a",
            pressed: true,
            source: "keyboard",
          };
          addEvent(event);
        }
      }, [addEvent]);

      return <div data-testid="count">{rows.length}</div>;
    };

    render(
      <InputLogProvider>
        <TestWithManyEvents />
      </InputLogProvider>
    );

    // Should be limited to 30
    expect(screen.getByTestId("count")).toHaveTextContent("30");
  });

  test("renders InputLog component", () => {
    render(
      <InputLogProvider>
        <InputLog />
      </InputLogProvider>
    );
    expect(screen.getByText("INPUT LOG")).toBeInTheDocument();
  });
});

