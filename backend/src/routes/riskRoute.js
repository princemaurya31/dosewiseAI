const express = require("express");
const fetch = require("node-fetch"); // npm install node-fetch@2
const router = express.Router();
const multer = require("multer");

// Multer config for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/analyze", upload.single("file"), async (req, res) => {
    try {
        const file = req.file; // VCF file buffer
        const drug = req.body.drug;

        // Dummy: extract gene/diplotype from file here
        const gene = "CYP2C19";       // Example, you can parse VCF
        const diplotype = "*1/*2";    // Example

        // Call Python service
        const pyResponse = await fetch("http://127.0.0.1:8000/evaluate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                patient_id: "123",
                drug,
                gene,
                diplotype
            })
        });

        const data = await pyResponse.json();
        res.json(data);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;