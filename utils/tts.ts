import CONFIG from "../config"

const CHARON_API_KEY = process.env.NEXT_PUBLIC_CHARON_API_KEY!

export function createTTSClient() {
  return {
    synthesize: async (text: string): Promise<AudioBuffer> => {
      const response = await fetch("https://api.charonai.com/v1/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CHARON_API_KEY}`,
        },
        body: JSON.stringify({
          text,
          voice: CONFIG.VOICE.NAME,
          audio_config: {
            audio_encoding: "LINEAR16",
            sample_rate_hertz: CONFIG.AUDIO.OUTPUT_SAMPLE_RATE,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Charon TTS API error: ${response.status} ${response.statusText}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      return await audioContext.decodeAudioData(arrayBuffer)
    },
  }
}

