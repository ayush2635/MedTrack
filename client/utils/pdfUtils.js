import * as pdfjsLib from 'pdfjs-dist';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(' ');

        // Split by newlines or just keep as page blocks? 
        // The prompt says "Extracts text... Generates candidate lines".
        // PDF.js textContent items are usually lines or chunks. 
        // Let's try to reconstruct lines better.
        // A simple join(' ') might merge lines. 
        // Better to use items and their transform to sort/group by Y coordinate if needed.
        // For simplicity, let's assume textContent.items gives us decent chunks. 
        // But often it splits words. 
        // Let's just join with space and then split by newline if the PDF has them, 
        // or rely on the fact that lab reports usually have lines.
        // Actually, `items` has `hasEOL` property sometimes.

        // Let's try a simpler approach: join all items with a special separator or just space, 
        // then try to split by some heuristic or just pass the raw text chunks to the candidate finder.
        // But candidate finder needs "lines".
        // Let's try to group by Y coordinate (transform[5]).

        const lines = {};
        textContent.items.forEach(item => {
            const y = Math.floor(item.transform[5]); // Group by Y coordinate (row)
            if (!lines[y]) lines[y] = [];
            lines[y].push(item.str);
        });

        const pageLines = Object.keys(lines)
            .sort((a, b) => b - a) // Sort by Y descending (top to bottom)
            .map(y => lines[y].join(' ')); // Join chunks in same line

        fullText = [...fullText, ...pageLines];
    }

    return fullText;
};
