type Cheat = { id: string; name: string };

type Props = {
  cheat: Cheat;
};

export function CheatContent({ cheat }: Props) {
  return (
    <div>
      <div className="text-2xl font-semibold tracking-tight">{cheat.name}</div>
      <div className="mt-2 text-sm text-emerald-300">
        Nice. Keep playing or try another code.
      </div>
    </div>
  );
}

