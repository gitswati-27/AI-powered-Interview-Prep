const pool = require("../config/db");

exports.getATSAnalytics = async (req, res) => {
  try {
    const userId = req.userId;

    //Latest ats score
    const latestResult = await pool.query(
      `SELECT ats_score
       FROM ats_results
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );

    const latestScore = latestResult.rows[0]?.ats_score || null;

    //total ats checks
    const totalChecksResult = await pool.query(
      `SELECT COUNT(*) FROM ats_results WHERE user_id = $1`,
      [userId]
    );

    const totalChecks = parseInt(totalChecksResult.rows[0].count);

    //ats score trends
    const trendResult = await pool.query(
      `SELECT
         DATE(created_at) as date,
         ats_score as score
       FROM ats_results
       WHERE user_id = $1
       ORDER BY created_at ASC`,
      [userId]
    );

    const scoreTrend = trendResult.rows;

    //Top weak skills essentially missing from ats check
    const weakSkillsResult = await pool.query(
      `
      SELECT skill, COUNT(*) as count FROM (
        SELECT UNNEST(missing_keywords) as skill
        FROM ats_results
        WHERE user_id = $1
      ) as skills
      GROUP BY skill
      ORDER BY count DESC
      LIMIT 5
      `,
      [userId]
    );

    const topWeakSkills = weakSkillsResult.rows;

    res.json({
      latestScore,
      totalChecks,
      scoreTrend,
      topWeakSkills
    });

  } catch (error) {
    console.error("ATS analytics error:", error);
    res.status(500).json({ message: "Failed to fetch ATS analytics" });
  }
};
