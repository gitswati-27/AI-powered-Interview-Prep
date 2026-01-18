const cloudinary = require("../config/cloudinary");
const pdfParse = require("pdf-parse");

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume uploaded" });
    }

    const uploadResult = await cloudinary.uploader.upload(
      `data:application/pdf;base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "intelliprep/resumes",
        resource_type: "raw"
      }
    );

    const data = await pdfParse(req.file.buffer);
    const resumeText = data.text;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ message: "Could not extract text from resume" });
    }

    res.status(200).json({
      message: "Resume uploaded, stored & parsed successfully",
      resumeUrl: uploadResult.secure_url,
      extractedTextPreview: resumeText.substring(0, 500)
    });

  } catch (error) {
    console.error("Resume upload error:", error);
    res.status(500).json({ message: "Resume upload failed" });
  }
};
