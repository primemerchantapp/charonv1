import Head from "next/head"
import { AudioVisualizer } from "../components/AudioVisualizer"
import { useVoiceAssistant } from "../hooks/useVoiceAssistant"

export default function VoiceChatbot() {
  const { isListening, isProcessing, transcript, aiResponse, startListening, stopListening, isTTSEnabled, toggleTTS } =
    useVoiceAssistant()

  return (
    <>
      <Head>
        <title>Magnetar - One Opti Lifestyle Assistant</title>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <div className="bg-gradient-to-b from-purple-900 to-indigo-800 text-white flex flex-col h-screen">
        {/* Header */}
        <header className="bg-opacity-50 bg-black p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Magnetar - One Opti Lifestyle</h1>
          <button onClick={toggleTTS} className="text-2xl">
            {isTTSEnabled ? "🔊" : "🔇"}
          </button>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <AudioVisualizer isListening={isListening} />

          <div className="mt-8 text-center">
            {isListening && <p className="text-green-400">Listening to Mentor Genesis...</p>}
            {isProcessing && <p className="text-yellow-400">Magnetar is thinking...</p>}
            {transcript && <p className="mt-4 text-lg">You said: {transcript}</p>}
            {aiResponse && <p className="mt-4 text-lg font-semibold">Magnetar: {aiResponse}</p>}
          </div>

          <button
            onClick={isListening ? stopListening : startListening}
            className={`mt-8 p-4 rounded-full ${
              isListening ? "bg-red-600" : "bg-blue-600"
            } hover:opacity-90 transition-opacity`}
          >
            <span className="material-icons text-4xl">{isListening ? "mic_off" : "mic"}</span>
          </button>
        </main>
      </div>
    </>
  )
}

