import "dotenv/config";

const getGrokAPIResponse = async(message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROK_API_KEY}`
        },
        body: JSON.stringify({
            model: "grok-2",
            messages: [{
                role: "user",
                content: message
            }],
            stream: false
        })
    };

    try {
        const response = await fetch("https://api.x.ai/v1/chat/completions", options);
        const data = await response.json();
        return data.choices[0].message.content; //reply
    } catch(err) {
        console.log(err);
    }
}

export default getGrokAPIResponse;
