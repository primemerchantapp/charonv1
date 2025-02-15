"use client"

import type React from "react"
import { useRef, useEffect } from "react"

interface AudioVisualizerProps {
  isListening: boolean
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isListening }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (isListening) {
        // Draw active audio waves
        ctx.strokeStyle = "#4CAF50"
        ctx.lineWidth = 2
        ctx.beginPath()

        for (let i = 0; i < canvas.width; i++) {
          const amplitude = Math.random() * 50
          ctx.lineTo(i, canvas.height / 2 + Math.sin(i * 0.1) * amplitude)
        }

        ctx.stroke()
      } else {
        // Draw inactive state (flat line)
        ctx.strokeStyle = "#666"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2)
        ctx.lineTo(canvas.width, canvas.height / 2)
        ctx.stroke()
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isListening])

  return <canvas ref={canvasRef} width={300} height={100} className="w-full max-w-md" />
}

