const pool = require("../config/db");

exports.generateQuestions = async (req, res) => {
  try {

    // 🧠 Fetch latest ATS result for user
    const atsResult = await pool.query(
      `SELECT *
       FROM ats_results
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [req.userId]
    );

    // ❌ No ATS results
    if (atsResult.rows.length === 0) {
      return res.status(400).json({
        message:
          "No ATS results found. Please run ATS check first."
      });
    }

    const latestATS = atsResult.rows[0];

    const matchedKeywords =
      latestATS.matched_keywords || [];

    const missingKeywords =
      latestATS.missing_keywords || [];

    const feedback =
      latestATS.feedback || "";

    const atsScore =
      latestATS.ats_score || 0;

    // 🎯 REAL AI prompt
    const prompt = `
You are an AI interview coach.

Generate 5 realistic interview questions.

The questions should:
- test the candidate deeply
- focus on weak areas
- include technical + behavioral questions
- align with the ATS analysis

Candidate ATS Score:
${atsScore}

Matched Skills:
${matchedKeywords.join(", ")}

Missing Skills:
${missingKeywords.join(", ")}

ATS Feedback:
${feedback}

IMPORTANT RULES:
- Return ONLY raw JSON
- No markdown
- No explanations

Required format:
{
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3"
  ]
}
`;

    // 🤖 Groq API call
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization":
            `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7
        })
      }
    );

    const data = await response.json();

    console.log(
      "Question generation raw response:",
      JSON.stringify(data, null, 2)
    );

    // 🛡️ Defensive checks
    if (
      !data.choices ||
      !Array.isArray(data.choices) ||
      data.choices.length === 0
    ) {
      throw new Error(
        "Groq returned no question choices"
      );
    }

    const message =
      data.choices[0]?.message?.content;

    if (!message) {
      throw new Error("Groq returned empty response");
    }

    // 🧠 Extract JSON safely
    const jsonMatch =
      message.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error(
        "No JSON object found in AI response"
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // ✅ Final response
    res.json({
      questions: parsed.questions || []
    });

  } catch (error) {

    console.error(
      "Question generation error:",
      error.message
    );

    res.status(500).json({
      message: "Question generation failed",
      error: error.message
    });
  }
};