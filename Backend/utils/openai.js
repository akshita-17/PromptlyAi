import "dotenv/config";

const getGrokAPIResponse = async(messages) => {
    if (!messages || messages.length === 0) {
        throw new Error("No messages provided");
    }

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROK_API_KEY}`
        },
        body: JSON.stringify({
            model: "grok-4.20",
            messages: messages,
            stream: false
        })
    };

    try {
        const response = await fetch("https://api.x.ai/v1/chat/completions", options);
        const data = await response.json();

        // Error handling for API response
        if (!response.ok) {
            console.error("Grok API Error:", data);
            throw new Error(`Grok API Error: ${data.error?.message || "Unknown error"}`);
        }

        // Validate response structure
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error("Unexpected Grok response structure:", data);
            throw new Error("Invalid response structure from Grok API");
        }

        const reply = data.choices[0].message.content;
        if (!reply) {
            throw new Error("Empty response from Grok API");
        }

        return reply;
    } catch(err) {
        console.error("Error calling Grok API:", err);
        throw err;
    }
}

export default getGrokAPIResponse;
