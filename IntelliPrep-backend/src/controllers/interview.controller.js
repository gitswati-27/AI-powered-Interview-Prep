const pool = require("../config/db");

exports.generateATSQuestions = async (req, res) => {
  try {
    const { missingKeywords, role } = req.body;

    if (!missingKeywords || !Array.isArray(missingKeywords) || missingKeywords.length === 0) {
      return res.status(400).json({
        message: "Missing keywords are required"
      });
    }

    const skillsList = missingKeywords.join(", ");

    const prompt = `
You are an interview question generator.

Generate interview questions to assess the following weak skills:
${skillsList}

Rules:
- Generate 2–3 questions per skill
- Questions should be clear and interview-style
- Do NOT include explanations
- Return ONLY valid JSON
- No extra text

Required JSON format:
{
  "questions": [
    {
      "skill": "string",
      "question": "string"
    }
  ]
}

Optional role context: ${role || "General software role"}
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
          temperature: 0.3
        })
      }
    );

    const data = await response.json();

    const rawText = data.choices?.[0]?.message?.content;
    if (!rawText) {
      throw new Error("No questions returned from LLM");
    }

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON in LLM response");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const questions = parsed.questions;

    //save qosins to db
    for (const q of questions) {
      await pool.query(
        `INSERT INTO interview_questions (user_id, skill, question)
         VALUES ($1, $2, $3)`,
        [req.userId, q.skill, q.question]
      );
    }

    res.json({
      generatedFor: missingKeywords,
      questions
    });

  } catch (error) {
    console.error("ATS question generation error:", error.message);
    res.status(500).json({
      message: "Failed to generate interview questions",
      error: error.message
    });
  }
};
