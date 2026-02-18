"use client";

import { useState, useCallback, useRef } from "react";

interface Host {
  id: number;
  name: string;
  email: string;
}

interface HostSelectorProps {
  hosts: Host[];
  meetupId: number;
}

export default function HostSelector({ hosts, meetupId }: HostSelectorProps) {
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spin = useCallback(async () => {
    if (spinning || hosts.length < 2) return;
    setSpinning(true);
    setSelectedHost(null);

    let tick = 0;
    const totalTicks = 20 + Math.floor(Math.random() * 10);
    let delay = 60;

    const animate = () => {
      intervalRef.current = setTimeout(() => {
        tick++;
        setHighlightIndex((prev) => (prev + 1) % hosts.length);

        if (tick >= totalTicks) {
          setSpinning(false);
          fetch(`/api/meetups/${meetupId}/random-host`)
            .then((r) => r.json())
            .then((data) => {
              if (data.selectedHost) {
                const idx = hosts.findIndex((h) => h.id === data.selectedHost.id);
                setHighlightIndex(idx);
                setSelectedHost(data.selectedHost);
              }
            });
          return;
        }

        delay += tick * 3;
        animate();
      }, delay);
    };

    animate();
  }, [spinning, hosts, meetupId]);

  if (hosts.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="mb-2 text-lg font-semibold text-zinc-900">Host Selector</h3>
        <p className="text-sm text-zinc-500">No one has volunteered to host yet.</p>
      </div>
    );
  }

  if (hosts.length === 1) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="mb-2 text-lg font-semibold text-zinc-900">Host Selector</h3>
        <p className="text-sm text-zinc-500">
          Only one volunteer — <span className="font-semibold text-zinc-900">{hosts[0].name}</span> is hosting!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900">Host Selector</h3>
        <span className="text-2xl">🎰</span>
      </div>

      <div className="mb-4 space-y-2">
        {hosts.map((host, idx) => (
          <div
            key={host.id}
            className={`flex items-center rounded-lg border-2 px-4 py-3 transition-all duration-150 ${
              highlightIndex === idx
                ? spinning
                  ? "border-amber-400 bg-amber-50 scale-[1.02]"
                  : selectedHost?.id === host.id
                  ? "border-green-500 bg-green-50 scale-[1.02]"
                  : "border-zinc-200 bg-white"
                : "border-zinc-200 bg-white"
            }`}
          >
            <div
              className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                selectedHost?.id === host.id
                  ? "bg-green-500 text-white"
                  : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {selectedHost?.id === host.id ? "★" : idx + 1}
            </div>
            <span className="font-medium text-zinc-800">{host.name}</span>
          </div>
        ))}
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 font-semibold text-white shadow-md transition-all hover:from-amber-600 hover:to-orange-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {spinning ? "Spinning..." : selectedHost ? "Spin Again!" : "Pick a Random Host!"}
      </button>

      {selectedHost && !spinning && (
        <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-4 text-center">
          <p className="text-sm text-green-700">The chosen host is...</p>
          <p className="mt-1 text-xl font-bold text-green-800">{selectedHost.name}! 🎉</p>
        </div>
      )}
    </div>
  );
}
