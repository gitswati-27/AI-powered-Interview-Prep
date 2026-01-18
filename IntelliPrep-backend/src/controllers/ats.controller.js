const pool = require("../config/db");

exports.checkATS = async (req, res) => {
  try {
    const { resumeText, jobDescription, resumeUrl } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        message: "Resume text and job description are required"
      });
    }

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

    // 🔍 Debug log (you can remove later)
    console.log("Groq raw response:", JSON.stringify(data, null, 2));

    // 🛡️ Defensive checks
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      throw new Error("Groq returned no choices");
    }

    const message = data.choices[0]?.message?.content;

    if (!message) {
      throw new Error("Groq returned empty message");
    }

    // 🧠 Extract JSON safely
    const jsonMatch = message.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON object found in LLM response");
    }

    const atsResult = JSON.parse(jsonMatch[0]);

    // ✅ ATS SCORE NORMALIZATION (IMPORTANT PART)
    let atsScore = atsResult.atsScore;

    // If model returns 0–1 scale, convert to 0–100
    if (typeof atsScore === "number" && atsScore <= 1) {
      atsScore = Math.round(atsScore * 100);
    }

    // Clamp score just to be safe
    atsScore = Math.max(0, Math.min(100, atsScore));

    // 💾 Save to DB
    await pool.query(
      `INSERT INTO ats_results
       (user_id, resume_url, ats_score, matched_keywords, missing_keywords, feedback)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        req.userId,
        resumeUrl || "",
        atsScore,
        atsResult.matchedKeywords,
        atsResult.missingKeywords,
        atsResult.feedback
      ]
    );

    // 📤 Return normalized result to frontend
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
