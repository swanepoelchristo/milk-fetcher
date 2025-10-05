"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type NavItem = { href: string; label: string };
type NavGroup = { label: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    label: "Main",
    items: [
      { href: "/production/calendar", label: "Production • Calendar" },
      { href: "/production/batches", label: "Production • Batches" },
    ],
  },
  {
    label: "HSE & Standards",
    items: [
      { href: "#", label: "Libraries (soon)" },
      { href: "#", label: "PPE Register (soon)" },
    ],
  },
  {
    label: "Maintenance",
    items: [
      { href: "#", label: "Jobs (soon)" },
      { href: "#", label: "PM Plans (soon)" },
    ],
  },
  {
    label: "Fleet & Logistics",
    items: [
      { href: "#", label: "Vehicles (soon)" },
      { href: "#", label: "Fuel (soon)" },
    ],
  },
  {
    label: "Lab & QA",
    items: [
      { href: "#", label: "Daily Tests (soon)" },
      { href: "#", label: "COAs (soon)" },
    ],
  },
  {
    label: "Utilities",
    items: [
      { href: "#", label: "Boiler Logs (soon)" },
      { href: "#", label: "Water Plant (soon)" },
    ],
  },
  {
    label: "Monitoring & Admin",
    items: [
      { href: "#", label: "Indicators (soon)" },
      { href: "#", label: "Thresholds (soon)" },
    ],
  },
  {
    label: "Setup",
    items: [{ href: "/setup/server-shares", label: "Server Shares" }],
  },
];

export default function Sidebar() {
  const pathname = usePathname() ?? "";

  return (
    <aside className="h-screen w-72 shrink-0 border-r bg-white/70 backdrop-blur-sm sticky top-0">
      <div className="px-4 py-4 text-xl font-semibold tracking-tight">Milk Fetcher</div>
      <nav className="px-2 pb-8 overflow-y-auto h-[calc(100vh-64px)]">
        {groups.map((g) => (
          <div key={g.label} className="mb-5">
            <div className="px-2 text-xs uppercase text-gray-500 mb-2">{g.label}</div>
            <ul className="space-y-1">
              {g.items.map((it) => {
                const isPlaceholder = it.href === "#";
                const active = !isPlaceholder && pathname.startsWith(it.href);
                const key = `${g.label}:${it.label}`; // unique key

                return (
                  <li key={key}>
                    {isPlaceholder ? (
                      <span
                        className={clsx(
                          "block rounded-md px-3 py-2 text-sm cursor-not-allowed",
                          "text-gray-400"
                        )}
                        aria-disabled="true"
                        title="Coming soon"
                      >
                        {it.label}
                      </span>
                    ) : (
                      <Link
                        href={it.href}
                        className={clsx(
                          "block rounded-md px-3 py-2 text-sm",
                          active
                            ? "bg-teal-50 text-teal-700 border border-teal-200"
                            : "hover:bg-gray-50 text-gray-700"
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        {it.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
