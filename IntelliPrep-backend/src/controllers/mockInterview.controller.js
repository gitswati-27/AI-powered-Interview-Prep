const pool = require("../config/db");

/**
 * 🎙️ Start a new interview
 */
exports.startInterview = async (req, res) => {
  try {

    const { role } = req.body;

    const result = await pool.query(
      `INSERT INTO interviews (user_id, role)
       VALUES ($1, $2)
       RETURNING id`,
      [
        req.userId,
        role || "General"
      ]
    );

    res.status(200).json({
      interviewId: result.rows[0].id,
      message: "Interview started successfully"
    });

  } catch (error) {

    console.error(
      "Start interview error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to start interview"
    });
  }
};

/**
 * 📤 Submit answer + AI evaluation
 */
exports.submitAnswer = async (req, res) => {
  try {

    const {
      interviewId,
      question,
      answer
    } = req.body;

    if (
      !interviewId ||
      !question ||
      !answer
    ) {
      return res.status(400).json({
        message:
          "interviewId, question, and answer are required"
      });
    }

    const prompt = `
You are an interview evaluator.

Evaluate the ANSWER to the QUESTION based on:
- Correctness (0-10)
- Clarity (0-10)
- Confidence (0-10)

IMPORTANT RULES:
- Respond with ONLY raw JSON
- No markdown
- No explanations
- No text outside JSON

Required JSON format:
{
  "correctness": number,
  "clarity": number,
  "confidence": number,
  "feedback": string
}

QUESTION:
${question}

ANSWER:
${answer}
`;

    // 🤖 Groq API
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
          temperature: 0.2
        })
      }
    );

    const data = await response.json();

    console.log(
      "Mock interview raw response:",
      JSON.stringify(data, null, 2)
    );

    // 🛡️ Defensive checks
    if (
      !data.choices ||
      !Array.isArray(data.choices) ||
      data.choices.length === 0
    ) {
      throw new Error(
        "AI returned no choices"
      );
    }

    const rawText =
      data.choices[0]?.message?.content;

    if (!rawText) {
      throw new Error(
        "AI returned empty message"
      );
    }

    // 🧠 Extract JSON safely
    const jsonMatch =
      rawText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error(
        "No JSON found in AI response"
      );
    }

    const evaluation =
      JSON.parse(jsonMatch[0]);

    // ✅ Safe normalization
    const correctness = Math.max(
      0,
      Math.min(
        10,
        Number(evaluation.correctness)
      )
    );

    const clarity = Math.max(
      0,
      Math.min(
        10,
        Number(evaluation.clarity)
      )
    );

    const confidence = Math.max(
      0,
      Math.min(
        10,
        Number(evaluation.confidence)
      )
    );

    // 💾 Save to DB
    await pool.query(
      `INSERT INTO interview_answers
       (
         interview_id,
         question,
         answer,
         correctness_score,
         clarity_score,
         confidence_score,
         feedback
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,

      [
        interviewId,
        question,
        answer,
        correctness,
        clarity,
        confidence,
        evaluation.feedback
      ]
    );

    // 📤 Return evaluation
    res.status(200).json({
      correctness,
      clarity,
      confidence,
      feedback: evaluation.feedback
    });

  } catch (error) {

    console.error(
      "Submit answer error:",
      error.message
    );

    res.status(500).json({
      message:
        "Answer evaluation failed",
      error: error.message
    });
  }
};

/**
 * 📊 Fetch latest interview results
 */
exports.getInterviewResults = async (req, res) => {
  try {

    // 🧠 Get latest interview
    const latestInterview = await pool.query(
      `SELECT id
       FROM interviews
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [req.userId]
    );

    // ❌ No interviews
    if (latestInterview.rows.length === 0) {
      return res.status(404).json({
        message: "No interviews found"
      });
    }

    const interviewId =
      latestInterview.rows[0].id;

    // 📊 Fetch answers
    const result = await pool.query(
      `SELECT
          question,
          answer,
          correctness_score,
          clarity_score,
          confidence_score,
          feedback
       FROM interview_answers
       WHERE interview_id = $1`,
      [interviewId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message:
          "No answers found for this interview"
      });
    }

    const answers = result.rows;

    // 🧠 Calculate averages
    const total = answers.length;

    const avgCorrectness = Math.round(
      answers.reduce(
        (sum, a) =>
          sum + Number(a.correctness_score),
        0
      ) / total
    );

    const avgClarity = Math.round(
      answers.reduce(
        (sum, a) =>
          sum + Number(a.clarity_score),
        0
      ) / total
    );

    const avgConfidence = Math.round(
      answers.reduce(
        (sum, a) =>
          sum + Number(a.confidence_score),
        0
      ) / total
    );

    // 🎯 Readiness score
    const readinessScore = Math.round(
      (avgCorrectness * 10 * 0.4) +
      (avgClarity * 10 * 0.3) +
      (avgConfidence * 10 * 0.3)
    );

    // 🟢 Readiness label
    let readinessLevel =
      "Needs Practice";

    if (readinessScore >= 80) {
      readinessLevel = "Ready";
    }
    else if (readinessScore >= 60) {
      readinessLevel = "Almost Ready";
    }

    // 📤 Final response
    res.json({

      summary: {
        totalQuestions: total,
        avgCorrectness,
        avgClarity,
        avgConfidence,
        readinessScore,
        readinessLevel
      },

      answers: answers.map(a => ({
        question: a.question,
        answer: a.answer,

        correctness:
          a.correctness_score,

        clarity:
          a.clarity_score,

        confidence:
          a.confidence_score,

        feedback: a.feedback
      }))
    });

  } catch (error) {

    console.error(
      "Fetch interview results error:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to fetch interview results"
    });
  }
};