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

    // =========================================
    // 📄 Extract resume text
    // =========================================

    const pdfData =
      await pdfParse(req.file.buffer);

    const resumeText =
      pdfData.text;

    console.log(
      "Extracted resume length:",
      resumeText.length
    );

    // =========================================
    // 🧠 STEP 1:
    // Extract technical keywords
    // =========================================

    const keywordPrompt = `
Extract ONLY technical skills,
frameworks,
programming languages,
databases,
cloud tools,
platforms,
libraries,
and technologies
from this job description.

IMPORTANT:
- Ignore normal English words
- Ignore soft skills
- Ignore filler words
- Return ONLY technical keywords

Return ONLY raw JSON:

{
  "keywords": [string]
}

JOB DESCRIPTION:
${jobDescription.slice(0, 4000)}
`;

    const keywordResponse =
      await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",

          headers: {
            "Authorization":
              `Bearer ${process.env.GROQ_API_KEY}`,

            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            model:
              "llama-3.1-8b-instant",

            messages: [
              {
                role: "user",
                content: keywordPrompt
              }
            ],

            temperature: 0.1
          })
        }
      );

    const keywordData =
      await keywordResponse.json();

    const keywordMessage =
      keywordData.choices?.[0]
        ?.message?.content;

    if (!keywordMessage) {

      throw new Error(
        "Keyword extraction failed"
      );
    }

    const keywordMatch =
      keywordMessage.match(/\{[\s\S]*\}/);

    if (!keywordMatch) {

      throw new Error(
        "No keyword JSON found"
      );
    }

    const parsedKeywords =
      JSON.parse(keywordMatch[0]);

    const extractedKeywords =
      parsedKeywords.keywords || [];

    console.log(
      "Extracted Keywords:",
      extractedKeywords
    );

    // =========================================
    // ✅ STEP 2:
    // Deterministic ATS scoring
    // =========================================

    const cleanResume =
      resumeText.toLowerCase();

    const uniqueKeywords =
      [...new Set(extractedKeywords)]
        .map(skill =>
          skill.toLowerCase()
        );

    // Matched
    const matchedKeywords =
      uniqueKeywords.filter(skill =>
        cleanResume.includes(skill)
      );

    // Missing
    const missingKeywords =
      uniqueKeywords.filter(skill =>
        !cleanResume.includes(skill)
      );

    // Real ATS score
    let atsScore = Math.round(
      (
        matchedKeywords.length /
        uniqueKeywords.length
      ) * 100
    );

    if (isNaN(atsScore)) {
      atsScore = 0;
    }

    atsScore = Math.max(
      0,
      Math.min(100, atsScore)
    );

    console.log(
      "FINAL SCORE:",
      atsScore
    );

    // =========================================
    // 🧠 STEP 3:
    // AI Feedback
    // =========================================

    const feedbackPrompt = `
You are an ATS evaluator.

Provide professional ATS feedback
for this resume based on:

- matched skills
- missing skills
- overall alignment

Keep feedback concise,
helpful,
and realistic.

Return ONLY raw JSON:

{
  "feedback": string
}

MATCHED KEYWORDS:
${matchedKeywords.join(", ")}

MISSING KEYWORDS:
${missingKeywords.join(", ")}

ATS SCORE:
${atsScore}
`;

    const feedbackResponse =
      await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",

          headers: {
            "Authorization":
              `Bearer ${process.env.GROQ_API_KEY}`,

            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            model:
              "llama-3.1-8b-instant",

            messages: [
              {
                role: "user",
                content: feedbackPrompt
              }
            ],

            temperature: 0.3
          })
        }
      );

    const feedbackData =
      await feedbackResponse.json();

    const feedbackMessage =
      feedbackData.choices?.[0]
        ?.message?.content;

    if (!feedbackMessage) {

      throw new Error(
        "Feedback generation failed"
      );
    }

    const feedbackMatch =
      feedbackMessage.match(/\{[\s\S]*\}/);

    if (!feedbackMatch) {

      throw new Error(
        "No feedback JSON found"
      );
    }

    const feedbackResult =
      JSON.parse(feedbackMatch[0]);

    // =========================================
    // 💾 Save to DB
    // =========================================

    await pool.query(
      `INSERT INTO ats_results
      (
        user_id,
        resume_url,
        ats_score,
        matched_keywords,
        missing_keywords,
        feedback
      )
      VALUES ($1, $2, $3, $4, $5, $6)`,

      [
        req.userId,

        "",

        atsScore,

        matchedKeywords,

        missingKeywords,

        feedbackResult.feedback
      ]
    );

    // =========================================
    // 📤 Response
    // =========================================

    res.json({

      atsScore,

      matchedKeywords,

      missingKeywords,

      feedback:
        feedbackResult.feedback
    });

  } catch (error) {

    console.error(
      "ATS Groq error:",
      error.message
    );

    res.status(500).json({

      message:
        "ATS evaluation failed",

      error:
        error.message
    });
  }
};