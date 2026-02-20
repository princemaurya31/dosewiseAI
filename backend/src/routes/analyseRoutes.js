// const express = require("express");
// const multer = require("multer");
// const axios = require("axios");
// const protect = require("../middleware/authMiddleware");

// const router = express.Router();

// // Multer setup (VCF file upload)
// const upload = multer({ dest: "uploads/" }); // folder "uploads" exist hona chahiye

// // POST /analyze route
// router.post("/analyze", protect, upload.single("vcffile"), async (req, res) => {
//   console.log("REQ BODY:", req.body);   // Debug
//   console.log("REQ FILE:", req.file);   // Debug

//   const drugName = req.body.drugName;

//   if (!drugName || !req.file) {
//     return res.status(400).json({ message: "Drug name or VCF file missing" });
//   }

//   try {
//     const aiResponse = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-4o-mini",
//         messages: [
//           {
//             role: "user",
//             content: `Provide pharmacogenomic risk assessment and recommendation for drug ${drugName}`
//           }
//         ]
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//       }
//     );

//     // Response user ko return karna
//     res.json({
//       drug: drugName,
//       recommendation: aiResponse.data.choices[0].message.content,
//     });
//   } catch (error) {
//     console.log(error.response?.data || error.message);
//     res.status(500).json({ message: "AI Error" });
//   }
// });

// module.exports = router;

const express = require("express");
const multer = require("multer");
const axios = require("axios");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // For VCF file upload

router.post("/analyze", protect, upload.single("vcffile"), async (req, res) => {
  console.log("REQ BODY:", req.body);    // Debug
  console.log("REQ FILE:", req.file);    // Debug

  const drugName = req.body.drugName;

  try {
    const aiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Provide pharmacogenomic risk assessment and recommendation for drug ${drugName}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    res.json({
      drug: drugName,
      recommendation: aiResponse.data.choices?.[0]?.message?.content || "No recommendation"
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "AI Error" });
  }
});

module.exports = router;