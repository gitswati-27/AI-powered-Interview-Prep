const pool = require("../config/db");

/**
 * Start a new mock interview session
 */
exports.startInterview = async (req, res) => {
  try {
    const { role } = req.body;

    const result = await pool.query(
      `INSERT INTO interviews (user_id, role)
       VALUES ($1, $2)
       RETURNING id`,
      [req.userId, role || "General"]
    );

    res.status(200).json({
      interviewId: result.rows[0].id,
      message: "Interview started successfully"
    });

  } catch (error) {
    console.error("Start interview error:", error.message);
    res.status(500).json({
      message: "Failed to start interview"
    });
  }
};

/**
 * Submit an answer and evaluate it using AI
 */
exports.submitAnswer = async (req, res) => {
  try {
    const { interviewId, question, answer } = req.body;

    if (!interviewId || !question || !answer) {
      return res.status(400).json({
        message: "interviewId, question, and answer are required"
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
- No explanations
- No markdown
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

    // 🔍 Debug log (keep for now, remove later)
    console.log("Mock interview raw response:", JSON.stringify(data, null, 2));

    if (!data.choices || data.choices.length === 0) {
      throw new Error("AI returned no choices");
    }

    const rawText = data.choices[0]?.message?.content;
    if (!rawText) {
      throw new Error("AI returned empty message");
    }

    // 🧠 Extract JSON safely
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in AI response");
    }

    const evaluation = JSON.parse(jsonMatch[0]);

    // 🛡️ Clamp scores to 0–10 just to be safe
    const correctness = Math.max(0, Math.min(10, evaluation.correctness));
    const clarity = Math.max(0, Math.min(10, evaluation.clarity));
    const confidence = Math.max(0, Math.min(10, evaluation.confidence));

    // 💾 Save answer + evaluation
    await pool.query(
      `INSERT INTO interview_answers
       (interview_id, question, answer,
        correctness_score, clarity_score, confidence_score, feedback)
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

    // 📤 Send evaluation back
    res.status(200).json({
      correctness,
      clarity,
      confidence,
      feedback: evaluation.feedback
    });

  } catch (error) {
    console.error("Submit answer error:", error.message);
    res.status(500).json({
      message: "Answer evaluation failed",
      error: error.message
    });
  }
};

exports.getInterviewResults = async (req, res) => {
  try {
    const { interviewId } = req.params;

    // 1️⃣ Fetch all answers for the interview
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
        message: "No answers found for this interview"
      });
    }

    const answers = result.rows;

    // 2️⃣ Calculate averages
    const total = answers.length;

    const avgCorrectness = Math.round(
      answers.reduce((sum, a) => sum + a.correctness_score, 0) / total
    );

    const avgClarity = Math.round(
      answers.reduce((sum, a) => sum + a.clarity_score, 0) / total
    );

    const avgConfidence = Math.round(
      answers.reduce((sum, a) => sum + a.confidence_score, 0) / total
    );

    const readinessScore = Math.round(
        (avgCorrectness * 10 * 0.4) +
        (avgClarity * 10 * 0.3) +
        (avgConfidence * 10 * 0.3)
    );

    let readinessLevel = "Needs Practice";
    if (readinessScore >= 80) {
        readinessLevel = "Ready";
    } else if (readinessScore >= 60) {
        readinessLevel = "Almost Ready";
    }

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
        correctness: a.correctness_score,
        clarity: a.clarity_score,
        confidence: a.confidence_score,
        feedback: a.feedback
    }))
    });

  } catch (error) {
    console.error("Fetch interview results error:", error.message);
    res.status(500).json({
      message: "Failed to fetch interview results"
    });
  }
};
