import { createClient } from "@deepgram/sdk"

const DEEPGRAM_API_KEY = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!

export function createDeepgramClient() {
  const deepgram = createClient(DEEPGRAM_API_KEY)
  let connection: any

  return {
    start: () => {
      connection = deepgram.listen.live({
        model: "nova-2",
        language: "en-US",
        smart_format: true,
        interim_results: true,
      })
    },
    stop: () => {
      if (connection) {
        connection.finish()
      }
    },
    onTranscript: (callback: (text: string) => void) => {
      if (connection) {
        connection.on("transcriptReceived", (message: any) => {
          const transcript = message.channel.alternatives[0].transcript
          if (transcript) {
            callback(transcript)
          }
        })
      }
    },
    onFinalTranscript: (callback: (text: string) => void) => {
      if (connection) {
        connection.on("transcriptReceived", (message: any) => {
          if (message.is_final) {
            const transcript = message.channel.alternatives[0].transcript
            if (transcript) {
              callback(transcript)
            }
          }
        })
      }
    },
  }
}

