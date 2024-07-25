const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
async function run() {
    const prompt = "Provide a JSON object containing the following information, derived from the provided image:
 "face_color": An object with keys "name" (common color name) and "hex" (hex code).
 "hair_color": An object with keys "name" (common color name) and "hex" (hex code).
 "eye_color": An object with keys "name" (common color name) and "hex" (hex code).
 "clothing_palette": An array of objects, each with keys "name" (common color name) and "hex" (hex code) for suggested clothing colors.
 "makeup_palette": An array of objects, each with keys "name" (common color name) and "hex" (hex code) for suggested makeup colors.
Ensure the JSON is well-formatted and concise. Avoid unnecessary text.
Example JSON Output:
{
  "face_color": {"name": "light beige", "hex": "#F2E8CD"},
  "hair_color": {"name": "dark brown", "hex": "#332211"},
  "eye_color": {"name": "blue", "hex": "#007FFF"},
  "clothing_palette": [
    {"name": "navy", "hex": "#000080"},
    {"name": "white", "hex": "#FFFFFF"},
    {"name": "red", "hex": "#FF0000"}
  ],
  "makeup_palette": [
    {"name": "pink", "hex": "#FFC0CB"},
    {"name": "brown", "hex": "#A52A2A"}
  ]
}"
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  }
  
  run();
