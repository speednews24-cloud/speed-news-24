export const formatDate = (value) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export const shareUrls = (article) => {
  const url = encodeURIComponent(`${import.meta.env.VITE_SITE_URL || window.location.origin}/article/${article.slug}`);
  const text = encodeURIComponent(article.aiHeadline || article.title);
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    whatsapp: `https://wa.me/?text=${text}%20${url}`,
    x: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
  };
};
