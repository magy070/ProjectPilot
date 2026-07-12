import dotenv from 'dotenv';

dotenv.config();

console.log('Testing Groq API key...');
const key = process.env.GROQ_API_KEY;
console.log('Key:', key ? `${key.slice(0, 10)}...` : 'Not set');

if (!key) {
  console.log('Error: GROQ_API_KEY is not defined in backend/.env');
  process.exit(1);
}

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function run() {
  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: 'Say hello!' }]
      })
    });
    
    if (!res.ok) {
      console.error('Error status:', res.status);
      console.error(await res.text());
      return;
    }
    const data = await res.json();
    console.log('Success! Response:', data.choices[0].message.content);
  } catch (error) {
    console.error('Error occurred:', error.message);
  }
}

run();
