const express=require("express")
const multer=require("multer")
const axios= require("axios")
const protect =require("../middleware/authMiddleware");

const router =express.Router();

const upload=multer({dest:"uploads/"});

router.post("/analyze",protect,upload.single("vcffile"),async (req,res)=>{
  const drugName =req.body.drugName;
  try{
    const aiResponse= await axios.post("https://api.openai.com/v1/chat/completions",
      {
        model:"gpt-4o-mini",
        message:[
          {
            role:"User",
            content:`Provide phermacogenomic risk assessment and recommondation for drug ${drugName}`
          },
        ],
      },
      {
        headers:{
          Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,

        },
      }

    );
    res.json({
      drug:drugName,
      recommendation:
      aiResponse.data.choices[0].message.content,
    })
  }catch(error){
    res.status(500).json({message:"AI Error"})
  }
})

module.exports=router