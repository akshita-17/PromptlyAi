import pdfParse from "pdf-parse";

export const extractText = async (file) => {
    if (file.mimetype === "application/pdf") {
        const data = await pdfParse(file.buffer);
        return data.text;
    }

    if (file.mimetype === "text/plain") {
        return file.buffer.toString("utf-8");
    }

    throw new Error("Unsupported file type. Upload a PDF or TXT file.");
};
