require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const bodyParser = require('body-parser');
const cors = require('cors');
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname +'/public'));

app.set('view engine', 'ejs');
app.set('views',(__dirname +'/views'));

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/public/index.html');
});

app.post('/colors', async (req, res) => {
    const { faceColor, hairColor, eyeColor } = req.body;
    const prompt = `Generate a JSON object based on the provided colors:
    {
        "personal_color": {
            "season": "The determined seasonal color analysis",
            "description": "A general description of the person's color palette",
            "suggested_colors": "Suggest some colors based on seasonal color analysis",
            "skin_undertone": {
                "type": "The determined skin undertone",
                "description": "A general description of the skin undertone"
            },
            "hair_color": {
                "color_family": "The general hair color family",
                "dominant_hex": "The dominant hex code of the hair color"
            },
            "eye_color": {
                "color_family": "The general eye color family",
                "dominant_hex": "The dominant hex code of the eye color"
            }
        }
    }
    Use these colors: Face Color ${faceColor}, Hair Color ${hairColor}, Eye Color ${eyeColor}. The response must be valid JSON with no additional text or comments.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        console.log('Generated Text:', text);

        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}');
        const jsonResponse = JSON.parse(text.slice(jsonStart, jsonEnd + 1));

        res.json(jsonResponse);
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).send("An error occurred while processing the request.");
    }
});

app.get('/result', (req, res) => {
    res.render('result');
});

app.get('*', (req, res) => {
    if (req.originalUrl !== '/result') {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));