const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.interpret = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Convert buffer to base64
        const filePart = {
            inlineData: {
                data: req.file.buffer.toString('base64'),
                mimeType: req.file.mimetype,
            },
        };

        // Use Gemini 1.5 Pro for multimodal capabilities
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

        // Fetch user profile
        const User = require('../models/User');
        const user = await User.findById(req.user.id);

        const userContext = user ? `
Patient Profile:
- Name: ${user.name}
- Age: ${user.age}
- Sex: ${user.sex}
Analyze the report specifically for this patient profile. Adjust flags and reference ranges if the report doesn't specify them, based on standard medical norms for this age and sex.
` : '';

        const prompt = `
You are an expert clinical data interpreter.
${userContext}
Analyze the attached medical lab report (image or PDF) and extract the test results.

Your tasks:

Task 1 — Extract and Interpret
For each test result found in the document:
1. Identify the **canonical lab test name** (e.g., "Hemoglobin", "TSH").
2. Extract the **value** (number).
3. Extract the **unit** (e.g., "g/dL", "mg/L").
4. Extract the **reference range** (low and high values).
5. Determine the **flag** based on the value and range: "low", "high", "normal", or "unknown".
6. Assign a **confidence** score (0.0-1.0) based on clarity.

Task 2 — Summaries
Provide two summaries:
1. **Patient Summary**: Simple, friendly, non-jargon explanation of the results for the patient.
2. **Clinician Summary**: Concise, technical summary for a doctor, highlighting abnormalities.

Task 3 — Output Format
Return ONLY a JSON object with this exact structure:
{
  "interpretation": [
    {
      "canonicalName": "Test Name",
      "aliases": ["Alias1"],
      "value": 10.5,
      "unit": "unit",
      "referenceRange": { "low": 10, "high": 20 },
      "flag": "normal",
      "confidence": 0.95,
      "notes": "Optional notes"
    }
  ],
  "summaries": {
    "patient": "...",
    "clinician": "..."
  }
}

IMPORTANT:
- Do not include markdown formatting (like \`\`\`json).
- Return only valid JSON.
- If a value or range is missing, use null.
`;

        const result = await model.generateContent([prompt, filePart]);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(cleanText);
        } catch (e) {
            console.error('Failed to parse Gemini response:', text);
            return res.status(500).json({ message: 'Failed to parse interpretation results', raw: text });
        }

        res.json({
            interpretation: jsonResponse.interpretation,
            summaries: jsonResponse.summaries,
            modelMeta: {
                modelName: 'gemini-1.5-flash',
                timestamp: new Date(),
            }
        });

    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({
            message: 'Error processing interpretation',
            error: error.message,
            stack: error.stack
        });
    }
};
