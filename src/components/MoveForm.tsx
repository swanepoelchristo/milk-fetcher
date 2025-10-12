'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function MoveForm({ name }: { name: string }) {
  const [category, setCategory] = useState<'orders' | 'coas' | 'notes'>('orders');
  const [sub, setSub] = useState('');
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/inbox/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, subfolder: sub.trim() })
    });
    const j = await res.json().catch(() => null);
    if (!res.ok) {
      alert(j?.error ?? 'Move failed');
      return;
    }
    // Refresh the table so the moved file disappears from Inbox
    startTransition(() => router.refresh());
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2 items-center">
      <select
        className="border rounded px-2 py-1"
        value={category}
        onChange={(e) => setCategory(e.target.value as any)}
        aria-label="Category"
      >
        <option value="orders">orders</option>
        <option value="coas">coas</option>
        <option value="notes">notes</option>
      </select>

      <input
        className="border rounded px-2 py-1 text-sm"
        placeholder="subfolder (optional)"
        value={sub}
        onChange={(e) => setSub(e.target.value)}
        aria-label="Subfolder"
      />

      <button type="submit" disabled={pending} className="border rounded px-3 py-1">
        {pending ? 'Moving…' : 'Move'}
      </button>
    </form>
  );
}
