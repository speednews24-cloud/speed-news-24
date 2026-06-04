export default function NewsTicker({ articles = [] }) {
  const headlines = articles.length ? articles : [{ title: 'Speed News 24 brings AI-powered breaking news in Hindi and English.' }];
  return (
    <div className="overflow-hidden bg-brand-black text-white">
      <div className="container-page flex items-center gap-4">
        <strong className="shrink-0 bg-brand-red px-3 py-2 text-xs uppercase">Live</strong>
        <div className="flex min-w-0 flex-1 gap-8 whitespace-nowrap py-2 ticker">
          {[...headlines, ...headlines].map((item, index) => <span key={`${item._id || item.title}-${index}`}>{item.aiHeadline || item.title}</span>)}
        </div>
      </div>
    </div>
  );
}
