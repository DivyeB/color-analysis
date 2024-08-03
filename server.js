require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const bodyParser = require('body-parser');
const cors = require('cors');
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve the index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle POST request for colors
app.post('/colors', async (req, res) => {
    const { faceColor, hairColor, eyeColor } = req.body;
    const colors = {
        faceColor,
        hairColor,
        eyeColor
    };
    const prompt = `Provide a JSON object containing the following information, derived from the provided image:

"personal_color": An object with keys:
"season": The determined seasonal color analysis (e.g., "Winter", "Summer", "Autumn", "Spring").
"description": A general description of the person's color palette (e.g., "Cool and contrasting colors").
"skin_undertone": An object with keys:
"type": The determined skin undertone (e.g., "warm", "cool", "neutral").
"description": A general description of the skin undertone (e.g., "Warm with golden undertones").
"hair_color": An object with keys:
"color_family": The general hair color family (e.g., "blonde", "brown", "red", "black").
"dominant_hex": The dominant hex code of the hair color.
"eye_color": An object with keys:
"color_family": The general eye color family (e.g., "blue", "green", "brown", "hazel").
"dominant_hex": The dominant hex code of the eye color.
Ensure the JSON is well-formatted and concise. Avoid unnecessary text.
                    now generate for colors: Face Color ${colors.faceColor}, Hair Color ${colors.hairColor}, Eye Color ${colors.eyeColor}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        res.send(text);
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).send("An error occurred while processing the request.");
    }
});

// Serve the result page
app.get('/result', (req, res) => {
    res.render('result'); // Render the result.ejs template
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));