export default function VideoSection({ videos = [] }) {
  const fallback = ['https://www.youtube.com/embed/dQw4w9WgXcQ'];
  const list = videos.length ? videos : fallback;
  return (
    <section className="container-page py-8">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-2xl font-black">Video News</h2>
        <span className="text-sm font-bold text-brand-red">YouTube / Shorts Ready</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {list.slice(0, 3).map((url) => (
          <iframe key={url} className="aspect-video w-full rounded-md" src={url} title="Speed News 24 video" loading="lazy" allowFullScreen />
        ))}
      </div>
    </section>
  );
}
