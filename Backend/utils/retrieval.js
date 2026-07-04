import Chunk from "../models/Chunk.js";
import { embedText } from "./embeddings.js";

export const VECTOR_INDEX_NAME = "vector_index";

export const retrieveContext = async (threadId, query, topK = 5) => {
    const queryEmbedding = await embedText(query);

    const results = await Chunk.aggregate([
        {
            $vectorSearch: {
                index: VECTOR_INDEX_NAME,
                path: "embedding",
                queryVector: queryEmbedding,
                numCandidates: 100,
                limit: topK,
                filter: { threadId: { $eq: threadId } }
            }
        },
        {
            $project: {
                _id: 0,
                text: 1,
                documentName: 1,
                score: { $meta: "vectorSearchScore" }
            }
        }
    ]);

    return results;
};
