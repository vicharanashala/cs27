import api from './axios';

export async function searchFAQs(query) {
  const { data } = await api.post('/search', { query });
  return data;
}

export async function getSuggestions(query) {
  const { data } = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
  return data;
}

export async function askFAQ(query, history = []) {
  const { data } = await api.post('/faqs/ask', { query, history });
  return data;
}

export async function sendFeedback(faqId, helpful) {
  const { data } = await api.post('/faqs/feedback', { faqId, helpful });
  return data;
}
