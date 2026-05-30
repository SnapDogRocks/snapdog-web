import Image from "next/image";
import { DownloadSelector } from "./download-selector";

async function getLatestVersion(): Promise<string> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/SnapDogRocks/snapdog-os/releases/latest",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return "v0.2.0";
    const data = await res.json();
    return data.tag_name ?? "v0.2.0";
  } catch {
    return "v0.2.0";
  }
}

export default async function Home() {
  const version = await getLatestVersion();
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]" />

      {/* Content */}
      <main className="relative z-10 flex flex-col items-center gap-8 max-w-2xl text-center">
        {/* Logo */}
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-amber-400/15 rounded-full scale-110" />
          <Image src="/logo.svg" alt="SnapDog" width={240} height={240} priority className="relative" />
        </div>

        {/* Tagline */}
        <p className="text-lg sm:text-xl text-neutral-400 max-w-lg leading-relaxed">
          Multi-zone audio controller with AirPlay, Spotify, Subsonic, MQTT, and KNX integration.
        </p>

        {/* Audio wave icon */}
        <div className="flex items-center gap-[3px] h-8">
          {[3, 5, 7, 5, 8, 5, 7, 5, 3].map((h, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full bg-amber-400/80 animate-pulse"
              style={{ height: `${h * 3}px`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-[2fr_1fr] gap-3 w-full max-w-sm font-mono text-left text-xs mt-4">
          <DownloadSelector />
          <div className="flex flex-col py-3 px-4 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="text-[9px] uppercase font-semibold text-neutral-500 tracking-wider">Version</span>
            <span className="font-semibold text-white mt-1 tabular-nums tracking-tight text-sm">{version}</span>
          </div>
          <a
            href="https://github.com/SnapDogRocks/snapdog-os"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col py-3 px-4 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all group"
          >
            <span className="text-[9px] uppercase font-semibold text-neutral-500 tracking-wider">Source</span>
            <span className="font-semibold text-amber-400 mt-1 group-hover:underline tracking-tight text-sm">
              SnapDogRocks/snapdog-os ↗
            </span>
          </a>
          <a
            href="https://www.gnu.org/licenses/gpl-3.0.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col py-3 px-4 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all group"
          >
            <span className="text-[9px] uppercase font-semibold text-neutral-500 tracking-wider">License</span>
            <span className="font-semibold text-amber-400 mt-1 group-hover:underline tracking-tight text-sm">
              GPL-3.0 ↗
            </span>
          </a>
        </div>

        {/* Footer */}
        <p className="text-xs text-neutral-600 mt-12">
          © 2026 Fabian Schmieder
        </p>
      </main>
    </div>
  );
}
