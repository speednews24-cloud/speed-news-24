export default function AdSlot({ placement = 'header' }) {
  return (
    <aside className="flex min-h-24 items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-100 p-4 text-center text-xs font-bold uppercase tracking-wide text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
      AdSense / Sponsor Slot: {placement}
    </aside>
  );
}
