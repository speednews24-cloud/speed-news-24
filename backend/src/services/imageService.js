import axios from 'axios';
import { env } from '../config/env.js';

export async function resolveArticleImage(article) {
  if (article.image?.url) return article.image;
  const query = encodeURIComponent(article.tags?.[0] || article.title || 'news');

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

  return { url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80', alt: article.title, provider: 'default' };
}
