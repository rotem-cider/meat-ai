"use client";

interface MeatMeterProps {
  totalLbs: number;
  recommendedLbs: number;
  attendeeCount: number;
}

export default function MeatMeter({ totalLbs, recommendedLbs, attendeeCount }: MeatMeterProps) {
  const percentage = recommendedLbs > 0 ? Math.min((totalLbs / recommendedLbs) * 100, 150) : 0;
  const diff = totalLbs - recommendedLbs;
  const isOver = diff >= 0;
  const displayPercentage = Math.min(percentage, 100);

  let barColor = "bg-red-500";
  if (percentage >= 80 && percentage <= 120) barColor = "bg-green-500";
  else if (percentage >= 50) barColor = "bg-yellow-500";
  if (percentage > 120) barColor = "bg-blue-500";

  let statusText = "";
  let statusColor = "";
  if (attendeeCount === 0) {
    statusText = "No attendees yet";
    statusColor = "text-zinc-400";
  } else if (Math.abs(diff) < 0.1) {
    statusText = "Perfect amount!";
    statusColor = "text-green-600";
  } else if (isOver) {
    statusText = `${diff.toFixed(1)} lbs over — feast mode!`;
    statusColor = "text-blue-600";
  } else {
    statusText = `${Math.abs(diff).toFixed(1)} lbs short — need more meat!`;
    statusColor = "text-red-600";
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900">Meat Meter</h3>
        <span className="text-2xl">🥩</span>
      </div>

      <div className="mb-3 flex items-end justify-between">
        <div>
          <span className="text-3xl font-bold text-zinc-900">{totalLbs.toFixed(1)}</span>
          <span className="ml-1 text-zinc-500">lbs</span>
        </div>
        <div className="text-right text-sm text-zinc-500">
          Target: {recommendedLbs.toFixed(1)} lbs
          <br />
          <span className="text-xs">(0.5 lbs × {attendeeCount} people)</span>
        </div>
      </div>

      <div className="relative mb-2 h-6 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${Math.max(displayPercentage, 2)}%` }}
        />
        {recommendedLbs > 0 && (
          <div
            className="absolute top-0 h-full w-0.5 bg-zinc-800"
            style={{ left: `${Math.min((100 / Math.max(percentage, 100)) * 100, 100)}%` }}
            title="Recommended amount"
          />
        )}
      </div>

      <p className={`text-sm font-medium ${statusColor}`}>{statusText}</p>
    </div>
  );
}
