"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../utils/firebase"
import { createDeepgramClient } from "../utils/deepgram"
import { createGeminiClient } from "../utils/gemini"
import { createTTSClient } from "../utils/tts"
import { createVAD } from "../utils/vad"

export function useVoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [aiResponse, setAIResponse] = useState("")
  const [isTTSEnabled, setIsTTSEnabled] = useState(true)

  const deepgramClient = useRef(createDeepgramClient())
  const geminiClient = useRef(createGeminiClient())
  const ttsClient = useRef(createTTSClient())
  const vadClient = useRef(createVAD())

  const startListening = useCallback(async () => {
    setIsListening(true)
    deepgramClient.current.start()
    await vadClient.current.start()
  }, [])

  const stopListening = useCallback(async () => {
    setIsListening(false)
    deepgramClient.current.stop()
    await vadClient.current.stop()
  }, [])

  const saveMessage = useCallback(async (role: "user" | "ai", content: string) => {
    try {
      await addDoc(collection(db, "chathub"), {
        role,
        content,
        timestamp: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error saving message to Firebase:", error)
    }
  }, [])

  useEffect(() => {
    deepgramClient.current.onTranscript((text) => {
      setTranscript(text)
    })

    deepgramClient.current.onFinalTranscript(async (text) => {
      setIsProcessing(true)
      await saveMessage("user", text)
      const response = await geminiClient.current.getResponse(text)
      setAIResponse(response)
      await saveMessage("ai", response)
      setIsProcessing(false)

      if (isTTSEnabled) {
        const audioBuffer = await ttsClient.current.synthesize(response)
        playAudio(audioBuffer)
      }
    })

    vadClient.current.onSpeechEnd(async () => {
      await stopListening()
    })

    return () => {
      deepgramClient.current.stop()
      vadClient.current.stop()
    }
  }, [stopListening, isTTSEnabled, saveMessage])

  const toggleTTS = () => setIsTTSEnabled(!isTTSEnabled)

  return {
    isListening,
    isProcessing,
    transcript,
    aiResponse,
    startListening,
    stopListening,
    isTTSEnabled,
    toggleTTS,
  }
}

function playAudio(audioBuffer: AudioBuffer) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const source = audioContext.createBufferSource()
  source.buffer = audioBuffer
  source.connect(audioContext.destination)
  source.start(0)
}

