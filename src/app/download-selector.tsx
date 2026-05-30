"use client";

import { useState } from "react";

const models = [
  { id: "pi5", label: "Raspberry Pi 5" },
  { id: "pi4", label: "Raspberry Pi 4" },
  { id: "pi3", label: "Raspberry Pi 3" },
] as const;

export function DownloadSelector() {
  const [selected, setSelected] = useState<string>("pi4");

  return (
    <div className="flex items-center gap-3 w-full max-w-sm">
      <div className="flex flex-col py-3 px-4 rounded-xl bg-white/[0.03] border border-white/10 flex-1">
        <span className="text-[9px] uppercase font-semibold text-neutral-500 tracking-wider">
          Model
        </span>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="mt-1 bg-transparent text-white text-sm font-semibold tracking-tight outline-none cursor-pointer"
        >
          {models.map((m) => (
            <option key={m.id} value={m.id} className="bg-[#0a0a0a]">
              {m.label}
            </option>
          ))}
        </select>
      </div>
      <a
        href={`https://updates.snapdog.cc/os/images/snapdog-os-${selected}-beta.img.gz`}
        className="flex items-center gap-2 py-4 px-5 rounded-xl bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition-colors shrink-0"
      >
        ↓ Download
      </a>
    </div>
  );
}
