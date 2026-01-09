"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "./components/ui/Modal";
import { AuthorContent } from "./components/ui/Modal/content";
import { cx, SHADOWS } from "./utils";

export default function NotFound() {
  const [showAuthorModal, setShowAuthorModal] = useState(false);

  return (
    <>
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1
          className={cx(
            "font-pixel text-6xl text-emerald-400 sm:text-8xl",
            SHADOWS.titleGlow
          )}
        >
          404
        </h1>
        <p className="mt-6 font-mono text-lg text-emerald-100/80 sm:text-xl">
          PAGE NOT FOUND
        </p>
        <p className="mt-4 font-mono text-sm text-emerald-200/60 sm:text-base">
          I don&apos;t know what you&apos;re trying to do,
          <br />
          but you won&apos;t find easter eggs{" "}
          <button
            onClick={() => setShowAuthorModal(true)}
            className="underline cursor-pointer hover:text-emerald-300 transition-colors"
          >
            here
          </button>
          .
          <span
            className="inline-block ml-1 animate-blink align-middle text-emerald-100/80"
            aria-hidden="true"
          >
            |
          </span>
        </p>
        <div className="mt-10">
          <Link
            href="/"
            className={cx(
              "inline-block cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200",
              "font-pixel bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/40"
            )}
          >
            RETURN TO CONTROLLER
          </Link>
        </div>
        <div className="mt-8 font-mono text-xs text-emerald-300/40">
          ERROR CODE: 0x404
        </div>
      </div>

      <Modal
        open={showAuthorModal}
        onClose={() => setShowAuthorModal(false)}
        title="ABOUT"
        footerButtonText="Close"
      >
        <AuthorContent />
      </Modal>
    </>
  );
}
