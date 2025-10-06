"use client";

import {
  addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format,
  isSameMonth, isToday, startOfMonth, startOfWeek, subMonths
} from "date-fns";
import { useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import RangeBadge from "@/components/RangeBadge";
import { indicatorsById, levelForValue } from "@/lib/indicators";

type Batch = {
  id: string;
  code: string;
  line: string;
  product: string;
  status: "Open" | "In Progress" | "Awaiting QA" | "Ready to Dispatch" | "Closed" | "Hold";
};

const demoBatches: Record<string, Batch[]> = {
  "2025-10-03": [
    { id: "b1", code: "SM240903-01", line: "Feta-G1", product: "Feta", status: "Awaiting QA" },
    { id: "b2", code: "MOZ-20251003-01", line: "Mozz-02", product: "Mozzarella", status: "In Progress" },
  ],
};

// === KPI demo values shown at top of the day drawer ===
type DayKpi = { indicatorId: string; value: number };
const dayKpis: Record<string, DayKpi[]> = {
  "2025-10-03": [
    { indicatorId: "htst_outlet_temp", value: 72.1 },
    { indicatorId: "feta_cut_ph", value: 6.35 },
  ],
};

export default function CalendarPage() {
  // Month grid
  const [month, setMonth] = useState(new Date());
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const days = useMemo(() => eachDayOfInterval({ start, end }), [start, end]);

  // Day drawer + selection
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const batches = selectedDate ? (demoBatches[selectedDate] ?? []) : [];

  const onDayClick = (d: Date) => {
    const key = format(d, "yyyy-MM-dd");
    setSelectedDate(key);
    setSelectedBatch((demoBatches[key] ?? [])[0] ?? null); // preselect first batch
    setOpen(true);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xl font-semibold">Production • Calendar</div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setMonth((m) => subMonths(m, 1))}>← Prev</Button>
          <span className="inline-block w-40 text-center font-medium">{format(month, "MMMM yyyy")}</span>
          <Button variant="outline" onClick={() => setMonth((m) => addMonths(m, 1))}>Next →</Button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <div key={d} className="px-2 py-1">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-px rounded-md overflow-hidden bg-gray-200">
        {days.map((d) => {
          const key = format(d, "yyyy-MM-dd");
          const has = (demoBatches[key]?.length ?? 0) > 0;
          return (
            <button
              key={key}
              onClick={() => onDayClick(d)}
              className={[
                "h-28 bg-white p-2 text-left hover:bg-gray-50 focus:outline-none",
                !isSameMonth(d, month) ? "bg-gray-50 text-gray-400" : "",
                isToday(d) ? "ring-2 ring-teal-400" : "",
              ].join(" ")}
            >
              <div className="text-sm font-medium">{format(d, "d")}</div>
              {has && (
                <div className="mt-2 space-y-1">
                  {demoBatches[key]!.slice(0, 3).map((b) => (
                    <div key={b.id} className="text-[11px] truncate rounded bg-teal-50 px-2 py-1 text-teal-700 border border-teal-200">
                      {b.code} • {b.line}
                    </div>
                  ))}
                  {(demoBatches[key]!.length ?? 0) > 3 && <div className="text-[11px] text-gray-500">+ more…</div>}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{/* controlled by state */}</SheetTrigger>
        <SheetContent side="right" className="w-[900px] sm:w-[90vw]">
          <SheetHeader><SheetTitle>Day view • {selectedDate ?? ""}</SheetTitle></SheetHeader>

          {/* KPI chips */}
          {selectedDate && (dayKpis[selectedDate]?.length ?? 0) > 0 && (
            <div className="mt-3 mb-3 flex flex-wrap gap-2">
              {dayKpis[selectedDate]!.map((k) => {
                const ind = indicatorsById[k.indicatorId];
                if (!ind) return null;
                const lvl = levelForValue(ind, k.value);
                return (
                  <div key={ind.id} className="rounded-md border bg-white px-3 py-2 text-xs">
                    <div className="font-medium">{ind.name}</div>
                    <div className="flex items-center gap-2">
                      <span>{k.value} {ind.unit ?? ""}</span>
                      <RangeBadge level={lvl}>{lvl}</RangeBadge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-12 gap-4">
            {/* Left: batches */}
            <div className="col-span-5 border rounded-md bg-white">
              <div className="px-3 py-2 border-b font-medium">Batches</div>
              <div className="p-3 space-y-2">
                {batches.length === 0 && <div className="text-sm text-gray-500">No batches.</div>}
                {batches.map((b) => {
                  const selected = selectedBatch?.id === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBatch(b)}
                      className={[
                        "w-full text-left rounded-md border p-2 hover:bg-gray-50",
                        selected ? "ring-2 ring-teal-400" : "",
                      ].join(" ")}
                    >
                      <div className="text-sm font-medium">{b.code}</div>
                      <div className="text-xs text-gray-500">{b.product} • {b.line}</div>
                      <span className="mt-1 inline-block text-[10px] rounded bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5">
                        {b.status}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: selected batch tabs */}
            <div className="col-span-7 border rounded-md bg-white">
              <div className="px-3 py-2 border-b font-medium">Selected Batch</div>
              <div className="p-3">
                <Tabs defaultValue="details">
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="docs">Related Documents</TabsTrigger>
                    <TabsTrigger value="items">Items</TabsTrigger>
                    <TabsTrigger value="refs">References</TabsTrigger>
                    <TabsTrigger value="sign">Sign-Off</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="text-sm mt-3">
                    {!selectedBatch ? (
                      <div className="text-gray-500">Pick a batch on the left.</div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <div><div className="text-gray-500">Batch Code</div><div>{selectedBatch.code}</div></div>
                        <div><div className="text-gray-500">Line</div><div>{selectedBatch.line}</div></div>
                        <div><div className="text-gray-500">Product</div><div>{selectedBatch.product}</div></div>
                        <div><div className="text-gray-500">Status</div><div>{selectedBatch.status}</div></div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="docs" className="text-sm mt-3">
                    {!selectedBatch ? "—" : (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Production Sheet — {selectedBatch.code}.pdf</li>
                        <li>Lab Result — {selectedBatch.code}_ph.pdf</li>
                        <li>COA — {selectedBatch.code}.pdf</li>
                      </ul>
                    )}
                  </TabsContent>

                  <TabsContent value="items" className="text-sm mt-3">
                    {!selectedBatch ? "—" : "Curd cuts, salting, brining… (placeholder)"}
                  </TabsContent>

                  <TabsContent value="refs" className="text-sm mt-3">
                    {!selectedBatch ? "—" : "Upstream pasteurizer run, milk receiving… (placeholder)"}
                  </TabsContent>

                  <TabsContent value="sign" className="text-sm mt-3">
                    {!selectedBatch ? "—" : "E-sign & comments (placeholder)"}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
