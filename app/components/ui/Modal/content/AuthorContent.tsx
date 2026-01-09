import Image from "next/image";
import Link from "next/link";
import { GitHubIcon, GlobeIcon } from "@/app/components/icons";

export function AuthorContent() {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Link
          href="https://daviddomingo.dev"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit daviddomingo.dev - David Domingo's website"
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
          <GitHubIcon className="h-5 w-5 text-emerald-400" aria-hidden="true" />
          <Link
            href="https://github.com/avicrayyy"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View @avicrayyy on GitHub"
            className="font-pixel text-emerald-400 underline hover:text-emerald-300 transition-colors"
          >
            @avicrayyy
          </Link>
        </p>
        <p className="flex items-center justify-center gap-2">
          <GlobeIcon className="h-5 w-5 text-emerald-400" aria-hidden="true" />
          <Link
            href="https://daviddomingo.dev"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit daviddomingo.dev"
            className="font-pixel text-emerald-400 underline hover:text-emerald-300 transition-colors"
          >
            daviddomingo.dev
          </Link>
        </p>
      </div>
    </div>
  );
}

