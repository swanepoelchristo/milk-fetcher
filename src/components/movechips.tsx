'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

type Chip = {
  label: string;
  category: 'orders' | 'coas' | 'notes';
  /** subfolder can be a string or a function that derives a subfolder from the file name */
  subfolder?: string | ((name: string) => string);
};

export default function MoveChips({ name, chips }: { name: string; chips?: Chip[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // sensible defaults; you can override by passing `chips` prop if you want custom targets
  const defaults: Chip[] = [
    {
      label: '→ orders / today',
      category: 'orders',
      subfolder: () => new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    },
    {
      label: '→ coas / feta / today',
      category: 'coas',
      subfolder: () => `feta/${new Date().toISOString().slice(0, 10)}`,
    },
    {
      label: '→ notes',
      category: 'notes',
    },
  ];

  const items = chips?.length ? chips : defaults;

  async function doMove(c: Chip) {
    const sub =
      typeof c.subfolder === 'function' ? c.subfolder(name) : (c.subfolder ?? '');

    const res = await fetch('/api/inbox/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category: c.category, subfolder: sub }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => null);
      alert(j?.error ?? 'Move failed');
      return;
    }

    // refresh the table so the row disappears
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((c, i) => (
        <button
          key={i}
          type="button"
          disabled={pending}
          onClick={() => doMove(c)}
          className="rounded-full border px-3 py-0.5 text-xs hover:bg-gray-50"
          aria-label={`Move ${name} to ${c.category}`}
        >
          {pending ? '…' : c.label}
        </button>
      ))}
    </div>
  );
}
