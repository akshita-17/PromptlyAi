import { pipeline } from "@xenova/transformers";

const MODEL_NAME = "Xenova/all-MiniLM-L6-v2";
export const EMBEDDING_DIMENSIONS = 384;

let embedderPromise = null;

const getEmbedder = () => {
    if (!embedderPromise) {
        embedderPromise = pipeline("feature-extraction", MODEL_NAME);
    }
    return embedderPromise;
};

export const embedText = async (text) => {
    const embedder = await getEmbedder();
    const output = await embedder(text, { pooling: "mean", normalize: true });
    return Array.from(output.data);
};

export const embedBatch = async (texts) => {
    const embedder = await getEmbedder();
    const embeddings = [];

    for (const text of texts) {
        const output = await embedder(text, { pooling: "mean", normalize: true });
        embeddings.push(Array.from(output.data));
    }

    return embeddings;
};
