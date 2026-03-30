const pool = require("../config/db");
const pdfParse = require("pdf-parse");

exports.checkATS = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    // ✅ Check file exists
    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required"
      });
    }

    if (!jobDescription) {
      return res.status(400).json({
        message: "Job description is required"
      });
    }

    // 🧠 Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    console.log("Extracted resume length:", resumeText.length);

    const prompt = `
You are an ATS engine.

IMPORTANT RULES:
- Respond with ONLY raw JSON
- Do NOT include explanations
- Do NOT include markdown
- Do NOT include any text outside JSON
- If input is valid, ALWAYS return JSON

Required JSON format:
{
  "atsScore": number,
  "matchedKeywords": [string],
  "missingKeywords": [string],
  "feedback": string
}

RESUME TEXT:
${resumeText.slice(0, 6000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 4000)}
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2
        })
      }
    );

    const data = await response.json();

    console.log("Groq raw response:", JSON.stringify(data, null, 2));

    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      throw new Error("Groq returned no choices");
    }

    const message = data.choices[0]?.message?.content;

    if (!message) {
      throw new Error("Groq returned empty message");
    }

    const jsonMatch = message.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON object found in LLM response");
    }

    const atsResult = JSON.parse(jsonMatch[0]);

    // ✅ Normalize ATS score
    let atsScore = atsResult.atsScore;

    if (typeof atsScore === "number" && atsScore <= 1) {
      atsScore = Math.round(atsScore * 100);
    }

    atsScore = Math.max(0, Math.min(100, atsScore));

    // 💾 Save to DB
    await pool.query(
      `INSERT INTO ats_results
       (user_id, resume_url, ats_score, matched_keywords, missing_keywords, feedback)
       VALUES ($1, $2, $3, $4, $5, $6)`,

      [
        req.userId,
        "", // resumeUrl optional for now
        atsScore,
        atsResult.matchedKeywords,
        atsResult.missingKeywords,
        atsResult.feedback
      ]
    );

    res.json({
      atsScore,
      matchedKeywords: atsResult.matchedKeywords,
      missingKeywords: atsResult.missingKeywords,
      feedback: atsResult.feedback
    });

  } catch (error) {
    console.error("ATS Groq error:", error.message);
    res.status(500).json({
      message: "ATS evaluation failed",
      error: error.message
    });
  }
};