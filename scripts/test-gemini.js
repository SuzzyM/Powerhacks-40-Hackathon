const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Manually read .env or .env.local
const envPathLocal = path.join(__dirname, '..', '.env.local');
const envPath = path.join(__dirname, '..', '.env');
let apiKey = '';

function parseEnv(content) {
    const lines = content.split('\n');
    for (const line of lines) {
        if (line.trim().startsWith('GEMINI_API_KEY=')) {
            const val = line.split('=')[1].trim();
            if (val) apiKey = val;
        }
        if (line.trim().startsWith('OPENAI_API_KEY=') && !apiKey) {
            const val = line.split('=')[1].trim();
            if (val) apiKey = val;
        }
    }
}

try {
    if (fs.existsSync(envPathLocal)) {
        console.log('Reading .env.local...');
        const envContent = fs.readFileSync(envPathLocal, 'utf8');
        parseEnv(envContent);
    }

    if (!apiKey && fs.existsSync(envPath)) {
        console.log('Reading .env...');
        const envContent = fs.readFileSync(envPath, 'utf8');
        parseEnv(envContent);
    }
} catch (error) {
    console.error('Error reading env files:', error.message);
    process.exit(1);
}

if (!apiKey) {
    console.error('No API Key found in .env or .env.local (checked GEMINI_API_KEY and OPENAI_API_KEY)');
    process.exit(1);
}

console.log('Found API Key (starts with):', apiKey.substring(0, 5) + '...');

async function listModels() {
    try {
        console.log('Fetching available models from API...');
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log('Available Models:');
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${m.name} (${m.displayName})`);
                }
            });
        } else {
            console.log('No models found or error in response:', JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error('Error listing models:', error.message);
    }
}

listModels();
