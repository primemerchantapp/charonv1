import CONFIG from "../config"

export function createGeminiClient() {
  const API_KEY = CONFIG.API.KEY
  const BASE_URL = CONFIG.API.BASE_URL
  const VERSION = CONFIG.API.VERSION
  const MODEL_NAME = CONFIG.API.MODEL_NAME

  let conversationHistory: string[] = []

  return {
    getResponse: async (prompt: string) => {
      const fullPrompt = `${CONFIG.SYSTEM_INSTRUCTION.TEXT}\n\nMentor Genesis: ${prompt}\nMagnetar:`

      const response = await fetch(`${BASE_URL}/${VERSION}/${MODEL_NAME}:streamGenerateContent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
          safetySettings: [
            { category: "HARM_CATEGORY_DANGEROUS", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          ],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
      }

      const reader = response.body!.getReader()
      let result = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        result += new TextDecoder().decode(value)
      }

      const parsedResponse = JSON.parse(result)
      const generatedText = parsedResponse.candidates[0].content.parts[0].text

      // Update conversation history
      conversationHistory.push(`Mentor Genesis: ${prompt}`)
      conversationHistory.push(`Magnetar: ${generatedText}`)
      if (conversationHistory.length > 10) {
        conversationHistory = conversationHistory.slice(-10)
      }

      return generatedText
    },
  }
}

