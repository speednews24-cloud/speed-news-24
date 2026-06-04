import axios from 'axios';
import { env } from '../config/env.js';

async function callOpenAI(messages, responseFormat = 'json_object') {
  if (!env.OPENAI_API_KEY) {
    return {
      summary: '',
      headline: '',
      tags: [],
      seoTitle: '',
      seoDescription: '',
      seoKeywords: []
    };
  }
  const { data } = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-mini',
      messages,
      response_format: { type: responseFormat },
      temperature: 0.3
    },
    { headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` }, timeout: 30000 }
  );
  return JSON.parse(data.choices[0].message.content);
}

export async function enrichArticleWithAI(article) {
  const prompt = `Create production news metadata for this article. Return JSON with summary, headline, tags, seoTitle, seoDescription, seoKeywords. Article: ${article.title}\n${article.content}`;
  return callOpenAI([
    { role: 'system', content: 'You are an expert bilingual news editor for a Hindi-English Indian news portal.' },
    { role: 'user', content: prompt }
  ]);
}

export async function formatArticleContent(content) {
  const result = await callOpenAI([
    { role: 'system', content: 'Format raw news copy into clean HTML paragraphs without inventing facts.' },
    { role: 'user', content: content }
  ]);
  return result.content || content;
}
