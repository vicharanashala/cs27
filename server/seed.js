require('dotenv').config();
const mongoose = require('mongoose');
const Faq = require('./models/Faq');
const { INTERNSHIP_FAQS } = require('./services/internshipFaqs');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  await Faq.deleteMany({});
  console.log('Cleared existing FAQs');
  await Faq.insertMany(INTERNSHIP_FAQS);
  console.log(`Inserted ${INTERNSHIP_FAQS.length} FAQs successfully!`);
  await mongoose.disconnect();
}

seed().catch(console.error);
