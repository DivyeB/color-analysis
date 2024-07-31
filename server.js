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

app.use(express.static(__dirname+'/public'));

app.post('/colors', async (req, res) => {
    const { faceColor, hairColor, eyeColor } = req.body;
    const colors = {
        faceColor,
        hairColor,
        eyeColor
    };
    const prompt = `Analyze the provided hex color codes for skin, hair, and eyes to determine the individual's color season according to seasonal color analysis principles. Output the results in JSON format with the following keys:
                    colorSeason: The determined color season (e.g., "Deep Autumn").
                    colorPalette: A concise description of the individual's color palette, emphasizing undertones, chroma, and value.
                    seasonDescription: A brief overview of the color season, focusing on key characteristics and suitable/unsuitable colors.
                    Example input:

                    Skin: #F2E8D9, Hair: #604A2B, Eyes: #324C64
                    Expected output:
                    JSON
                    {
                    "colorSeason": "Deep Autumn",
                    "colorPalette": "Warm, deep, golden undertones, high chroma, medium-deep value.",
                    "seasonDescription": "Rich, warm colors. Best: deep reds, oranges, golds, browns. Avoid: bright, cool, light shades."
                    }
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

app.get('/', (req, res) => {
    res.sendFile(__dirname+ '/public/index.html');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
