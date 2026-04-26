import express from 'express';
import Thread from '../models/Thread.js';
import getOpenAiResponse from '../utils/openai.js';

const router=express.Router();
console.log("chat.js");
//read route
router.get("/thread",async(req,res)=>{
    try{
        const threads=await Thread.find({}).sort({updatedAt: -1});
        res.json(threads);
    }catch(err){
         console.log(err);
        res.status(500).json("some error occured:failed to fetch threads!");
    }
});
//show individual thread
router.get("/thread/:ThreadId",async(req,res)=>{
    const {ThreadId}=req.params;
    try{
        const thread=await Thread.findOne({ThreadId});
        if(!thread){
            res.status(500).json("no chat found");
        }
        res.json(thread.messages);
    }catch(err){
        console.log(err);
        res.status(500).json("Couldnot find chat");
    }
});
//delete a thread
router.delete("/thread/:ThreadId",async(req,res)=>{
    const {ThreadId}=req.params;
    try{
        const deleted= await Thread.findOneAndDelete({ThreadId});
        if(!deleted){
            res.status(404).json("couldn't delete thread");
        }
        res.status(200).json("Deleted sucessfully!");
    }catch(err){
        console.log(err);
        res.status(500).json("could not delete ");
    }
});
//chat route
router.post("/chat",async(req,res)=>{
    const {ThreadId,message}=req.body;
    if(!ThreadId || !message){
        res.status(404).json("required credentials not found!");
    }
    try{
        const thread=await Thread.findOne({ThreadId});
        if(!thread){
            //create new chat
           const thread=new Thread({
                ThreadId,
                title:message,
                messages:[{role:"user", content:message}]
            });
        }else{
            thread.messages.push({role:"user",content:message});
        }
        //get response from open ai
        const assisstantReply=await getOpenAiResponse(message);
        thread.messages.push({role:"assisstant",content:assisstantReply});
        thread.updatedAt=new Date();
        await thread.save();
        //send reply to front end
        res.json({reply:assisstantReply});

        }catch(err){
        console.log(err);
        res.status(500).json(err.message);
    }
});
export default router;