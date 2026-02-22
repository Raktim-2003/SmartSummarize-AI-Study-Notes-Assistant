const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function localSummary(text: string) {
  const sentences = text.split(".");

  return sentences.slice(0, 3).join(".") + ".";
}

export const generateSummary = async (
  text: string,

  style: string,
): Promise<string> => {
  try {
    if (!API_KEY) {
      return localSummary(text);
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [{ text }],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      return localSummary(text);
    }

    const data = await response.json();

    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text || localSummary(text)
    );
  } catch {
    return localSummary(text);
  }
};
