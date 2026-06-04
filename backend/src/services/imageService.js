import axios from 'axios';
import { env } from '../config/env.js';

const fallbackImages = {
  'Breaking News': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80',
  India: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=80',
  World: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
  Politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1400&q=80',
  Technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
  Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=80',
  Entertainment: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80',
  Education: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80',
  Business: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80'
};

export async function resolveArticleImage(article) {
  if (article.image?.url) return article.image;
  const categoryName = article.category?.name || article.categoryName || article.tags?.[0] || 'Breaking News';
  const query = encodeURIComponent(`${categoryName} ${article.language === 'hi' ? 'India Hindi news' : article.title || 'news'}`);

  if (env.UNSPLASH_ACCESS_KEY) {
    const { data } = await axios.get(`https://api.unsplash.com/search/photos?query=${query}&per_page=1`, {
      headers: { Authorization: `Client-ID ${env.UNSPLASH_ACCESS_KEY}` },
      timeout: 10000
    });
    const photo = data.results?.[0];
    if (photo) return { url: photo.urls.regular, alt: photo.alt_description || article.title, provider: 'unsplash' };
  }

  if (env.PEXELS_API_KEY) {
    const { data } = await axios.get(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
      headers: { Authorization: env.PEXELS_API_KEY },
      timeout: 10000
    });
    const photo = data.photos?.[0];
    if (photo) return { url: photo.src.large, alt: photo.alt || article.title, provider: 'pexels' };
  }

  if (env.OPENAI_API_KEY) {
    const { data } = await axios.post(
      'https://api.openai.com/v1/images/generations',
      { model: 'gpt-image-1', prompt: `Editorial news image for: ${article.title}`, size: '1024x1024' },
      { headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` }, timeout: 60000 }
    );
    if (data.data?.[0]?.url) return { url: data.data[0].url, alt: article.title, provider: 'openai' };
  }

  return { url: fallbackImages[categoryName] || fallbackImages['Breaking News'], alt: article.title, provider: 'default' };
}
