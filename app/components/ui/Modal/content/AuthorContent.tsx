import Image from "next/image";
import Link from "next/link";

export function AuthorContent() {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Link
          href="https://daviddomingo.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="relative h-24 w-24 perspective-1000 coin-flip-container cursor-pointer"
        >
          <div className="relative h-full w-full preserve-3d transition-transform duration-700 coin-flip-inner">
            {/* Front side - Profile image */}
            <div className="absolute inset-0 backface-hidden">
              <Image
                src="https://daviddomingo.dev/_next/image?url=%2Favatar-david.jpg&w=96&q=75"
                alt="David Domingo"
                width={96}
                height={96}
                className="h-full w-full rounded-full border-2 border-emerald-400/30 object-cover"
                unoptimized
              />
            </div>
            {/* Back side - GIF */}
            <div className="absolute inset-0 backface-hidden rotate-y-180">
              <Image
                src="https://daviddomingo.dev/avi-1.gif"
                alt="David Domingo animated"
                width={96}
                height={96}
                className="h-full w-full rounded-full border-2 border-emerald-400/30 object-cover"
                unoptimized
              />
            </div>
          </div>
        </Link>
      </div>
      <p className="text-center">Built and maintained by</p>
      <div className="space-y-2">
        <p className="flex items-center justify-center gap-2">
          <svg
            className="h-5 w-5 text-emerald-400"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.425 22 12.017 22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          <Link
            href="https://github.com/avicrayyy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-pixel text-emerald-400 underline hover:text-emerald-300 transition-colors"
          >
            @avicrayyy
          </Link>
        </p>
        <p className="flex items-center justify-center gap-2">
          <svg
            className="h-5 w-5 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
          <Link
            href="https://daviddomingo.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-pixel text-emerald-400 underline hover:text-emerald-300 transition-colors"
          >
            daviddomingo.dev
          </Link>
        </p>
      </div>
    </div>
  );
}

