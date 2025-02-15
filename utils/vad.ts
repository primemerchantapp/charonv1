import { MicVAD } from "@ricky0123/vad-web"

export function createVAD() {
  let vad: MicVAD | null = null

  return {
    start: async () => {
      if (vad) {
        await vad.stop()
      }
      vad = await MicVAD.new({
        onSpeechEnd: () => {
          if (vad && vad.callbacks.onSpeechEnd) {
            vad.callbacks.onSpeechEnd()
          }
        },
      })
      await vad.start()
    },
    stop: async () => {
      if (vad) {
        await vad.stop()
        vad = null
      }
    },
    onSpeechEnd: (callback: () => void) => {
      if (vad) {
        vad.callbacks.onSpeechEnd = callback
      }
    },
  }
}

