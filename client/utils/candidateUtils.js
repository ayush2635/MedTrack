export const findCandidates = (lines) => {
    const candidates = [];

    lines.forEach((line, index) => {
        // Regex to find numbers (integers or decimals)
        const numberPattern = /\d+(\.\d+)?/g;
        const foundNumbers = line.match(numberPattern);

        if (foundNumbers) {
            // Parse numbers to floats
            const numbers = foundNumbers.map(n => parseFloat(n));

            // Get nearby lines (context)
            const prev = lines[index - 1] || '';
            const next = lines[index + 1] || '';
            const nearby = `${prev} | ${line} | ${next}`;

            candidates.push({
                index,
                text: line.trim(),
                nearby,
                foundNumbers: numbers,
            });
        }
    });

    return candidates;
};
