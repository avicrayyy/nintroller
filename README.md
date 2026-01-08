# Nintroller 🎮

A retro-themed Nintendo (NES) controller simulator with real-time input logging and cheat code detection. Built with Next.js, TypeScript, and a terminal/CRT aesthetic.

![Nintroller](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)
![Jest](https://img.shields.io/badge/Jest-30.2-C21325?style=flat-square&logo=jest)

## Features

- 🎮 **Interactive NES Controller** - Click/tap buttons or use keyboard controls
- 📊 **Real-time Input Logging** - Track all button presses with timestamps and input sources
- 🎯 **Cheat Code Detection** - Automatically detects classic cheat codes (Konami Code, ABBA, etc.)
- 🎨 **Retro Terminal Theme** - CRT scanlines, emerald terminal aesthetic, pixel fonts
- 📱 **Mobile Responsive** - Emulator-style layout on mobile, classic layout on desktop
- 🧪 **TDD Setup** - Full Jest + Testing Library infrastructure with style guards
- ♿ **Accessible** - ARIA labels, keyboard navigation, focus management

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/avicrayyy/nintroller.git
cd nintroller

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Controller Controls

**Keyboard Mapping**:
- Arrow Keys - D-pad (Up, Down, Left, Right)
- `Z` - B button
- `X` - A button
- `Shift` - Select
- `Enter` - Start

**Mouse/Touch**: Click or tap any button on the controller.

### Cheat Codes

Try entering these sequences:

- **Konami Code**: `↑ ↑ ↓ ↓ ← → ← → B A Start`
- **ABBA**: `A B B A`
- **Select + Start**: `Select Start`

When a cheat is detected, a modal will appear celebrating your discovery! 🎉

### Input Log

- **Desktop**: Input log appears as a fixed right sidebar
- **Mobile**: Tap the "LOG" FAB button in the top-right to open the log drawer

The log shows:
- Timestamp of each event
- Button pressed
- Press state (down/up)
- Input source (keyboard/pointer)

## Development

### Available Scripts

```bash
# Development
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server

# Testing
pnpm test         # Run tests once
pnpm test:watch   # Run tests in watch mode
pnpm test:ci      # Run tests in CI mode

# Code Quality
pnpm lint         # Run ESLint
```

### Project Structure

```
app/
├── api/
│   └── cheats/          # Cheat detection API
├── components/
│   ├── CheatModal/      # Cheat detection modal
│   ├── InputLog/        # Input log component + provider
│   ├── NESController/    # Controller component
│   └── ...
├── libs/
│   └── cheats.ts        # Cheat definitions + detection
└── layout.tsx           # Root layout

__tests__/               # Test files
```

### Code Style

This project enforces:
- **No `React.*` namespace usage** - Use direct imports (`useState`, `useEffect`, etc.)
- **Component folder structure** - Components live at folder entrypoints
- **TypeScript strict mode** - Full type safety
- **TDD approach** - Tests written alongside features

See `SESSION_NOTES.mdx` for detailed development notes and architecture decisions.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Testing**: Jest + Testing Library
- **Fonts**: Press Start 2P (Google Fonts)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`pnpm test`)
5. Ensure linting passes (`pnpm lint`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

This project is private and not licensed for public use.

## Acknowledgments

- Inspired by classic NES controllers and retro gaming aesthetics
- Built with modern web technologies for a nostalgic experience

---

Made with ❤️ and lots of button presses
