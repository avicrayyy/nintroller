import type { SVGProps } from "react";
import { cx } from "@/app/utils";

type Props = SVGProps<SVGSVGElement> & {
  className?: string;
};

export function CloseIcon({ className, ...props }: Props) {
  return (
    <svg
      className={cx("h-4 w-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

