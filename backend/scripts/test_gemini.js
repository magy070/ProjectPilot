import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

console.log('Testing Gemini API key with gemini-2.0-flash...');
const key = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(key);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent('Say hello!');
    console.log('Success! Response:', result.response.text());
  } catch (error) {
    console.error('Error occurred:', error.message);
  }
}

run();
