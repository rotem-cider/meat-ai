"use client";

interface OtherItemsProps {
  items: { name: string; items: string }[];
}

export default function OtherItems({ items }: OtherItemsProps) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900">Other Goodies</h3>
        <span className="text-2xl">🍻</span>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 rounded-lg bg-zinc-50 p-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
              {item.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-800">{item.name}</p>
              <p className="text-sm text-zinc-600">{item.items}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
