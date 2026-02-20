const express =require("express");
const cors= require("cors")
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",require("./routes/authRoutes"))
app.use("/api/analyseRoutes",require("./routes/analyseRoutes"))
app.use(cors({
  origin: "https//localhost:9090" ,
  credentials:true
  // // ya specific frontend URL
}));
app.get("/",(req,res)=>{
  res.send("API Running..");
})
module.exports=app;
