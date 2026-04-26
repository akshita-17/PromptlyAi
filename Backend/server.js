import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT=5000;
//middleware
app.use(express.json());
app.use(cors());

app.use("/api",chatRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});

const connectDB=async()=>{
   try{ 
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to URI");
    }catch(err){
        console.log("connection to DB failed!",err);
    }
}

// app.post("/test",async(req,res)=>{
//     const options={
//         method:"POST",
//         headers:{
//             "Content-Type":"application/json",
//             "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body:JSON.stringify({
//             model:"gpt-4o-mini",
//             input:[{role:"user", content:"Hello"}]
//         })
//     };
//     try{
//         const response=await fetch("https://api.openai.com/v1/responses",options);
//         const data=await response.json();
//         console.log(data);
//         res.send(data)
//     }
//     catch(err){
//         console.log(err);
//     }
// });

