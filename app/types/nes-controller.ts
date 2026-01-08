export type NESButton =
  | "up"
  | "down"
  | "left"
  | "right"
  | "select"
  | "start"
  | "b"
  | "a";

export type InputSource = "pointer" | "keyboard";

export type ButtonChangeEvent = {
  button: NESButton;
  pressed: boolean;
  source: InputSource;
};

