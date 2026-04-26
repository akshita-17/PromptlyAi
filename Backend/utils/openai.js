import 'dotenv/config';


const getOpenAiResponse=async(message)=>{
   
     const options={
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`
        },
        body:JSON.stringify({
            model:"gpt-4o-mini",
            input:[{role:"user", content:message}]
        })
    };
    try{
        const response=await fetch("https://api.openai.com/v1/responses",options);
        const data=await response.json();
        console.log(data);
        const reply = data.output?.[0]?.content?.[0]?.text || "No response";//reply
        return reply;
    }
    catch(err){
        console.log(err);
        resizeBy.status(500).json("this is a mock response");
       
    }
}

export default getOpenAiResponse;