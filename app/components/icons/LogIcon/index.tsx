import type { SVGProps } from "react";
import { cx } from "@/app/utils";

type Props = SVGProps<SVGSVGElement> & {
  className?: string;
};

export function LogIcon({ className, ...props }: Props) {
  return (
    <svg
      className={cx("h-5 w-5", className)}
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
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

