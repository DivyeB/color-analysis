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

app.use(express.static(path.join(__dirname, 'public')));

app.post('/colors', async (req, res) => {
    const { faceColor, hairColor, eyeColor } = req.body;
    const colors = {
        faceColor,
        hairColor,
        eyeColor
    };
    const prompt = `describe these colors: Face Color ${colors.faceColor}, Hair Color ${colors.hairColor}, Eye Color ${colors.eyeColor}`;

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
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
