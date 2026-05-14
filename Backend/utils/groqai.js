import "dotenv/config";
import Groq from "groq-sdk";

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const getGrokAPIResponse = async (messages) => {
    try {
        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",  // free & very capable
            messages: messages,
            stream: false
        });

        return response.choices[0].message.content;
    } catch (err) {
        console.error("Groq API Error:", err.message);
        throw err;
    }
};

export default getGrokAPIResponse;