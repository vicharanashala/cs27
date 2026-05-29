const axios = require('axios');
const cheerio = require('cheerio');

const SOURCE_URL = 'https://samagama.in/internship/faq';

const SECTION_NAMES = {
  '1': 'about-internship',
  '2': 'timing-dates',
  '3': 'noc',
  '4': 'selection-offer',
  '5': 'work-mentorship',
  '6': 'code-of-conduct',
  '7': 'interviews',
  '8': 'certificate',
  '9': 'rosetta',
  '10': 'coursework-vibe',
  '11': 'yaksha-chat',
  '12': 'vibe-platform',
  '13': 'team-formation',
};

async function fetchFAQs() {
  try {
    const { data } = await axios.get(SOURCE_URL, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'text/html,application/json',
      },
    });

    return parseFAQs(data);
  } catch {
    return null;
  }
}

function parseFAQs(html) {
  const $ = cheerio.load(html);
  const faqs = [];

  $('details[id^="q-"]').each((_, el) => {
    const id = $(el).attr('id') || '';
    const summary = $(el).find('summary').first().text().trim();

    const question = summary
      .replace(/^\d+\.\d+\s+/, '')
      .replace(/§/g, '')
      .trim();

    $(el).find('summary').remove();
    const answer = $(el).text().trim().replace(/\s+/g, ' ');

    const parts = id.replace('q-', '').split('-');
    const sectionNum = parts[0];
    const category = SECTION_NAMES[sectionNum] || 'general';

    if (question && answer && answer.length > 10) {
      faqs.push({ question, answer, category, tags: [] });
    }
  });

  return faqs;
}

module.exports = { fetchFAQs, parseFAQs };