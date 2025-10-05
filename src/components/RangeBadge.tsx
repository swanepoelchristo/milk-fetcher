// src/components/RangeBadge.tsx
type Level = "R" | "O" | "Y" | "G";

const map: Record<Level, string> = {
  R: "bg-red-50 text-red-700 border-red-200",
  O: "bg-orange-50 text-orange-700 border-orange-200",
  Y: "bg-yellow-50 text-yellow-700 border-yellow-200",
  G: "bg-teal-50 text-teal-700 border-teal-200",
};

export default function RangeBadge({ level, children }: { level: Level; children?: React.ReactNode }) {
  return (
    <span className={`inline-block text-[10px] rounded px-2 py-0.5 border ${map[level]}`}>
      {children ?? level}
    </span>
  );
}
