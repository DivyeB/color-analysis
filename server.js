require('dotenv').config();
const express = require('express');
const app = express();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const bodyParser = require('body-parser');
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


app.use(bodyParser.json());

async function run(res) { 
  const prompt = "generate all colors included in different types of seasonal color palette";

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

  
    res.send(text); 
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).send("An error occurred while processing the request.");
  }
}

app.get('/', async (req, res) => {
  await run(res); 
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
