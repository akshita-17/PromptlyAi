import 'dotenv/config';

const getOpenAiResponse = async (message, threadId) => {
    const body = {
        model: "gpt-4o-mini",
        input: [{ role: "user", content: message }],
    };

    // If threadId exists, link to previous response for conversation continuity
    if (threadId) {
        body.previous_response_id = threadId;
    }

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify(body)
    };

    try {
        const response = await fetch("https://api.openai.com/v1/responses", options);
        const data = await response.json();
        console.log(data);

        const reply = data.output?.[0]?.content?.[0]?.text || "No response";
        const responseId = data.id; // Use this as the next threadId

        return { reply, responseId };
    } catch (err) {
        console.log(err);
        throw new Error("Failed to get response from OpenAI");
    }
};

export default getOpenAiResponse;