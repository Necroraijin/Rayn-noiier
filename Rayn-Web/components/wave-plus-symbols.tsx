"use client"

import React from "react"

interface WavePlusSymbolsProps {
  count?: number
  className?: string
  colorClass?: string
}

export default function WavePlusSymbols({
  count = 12,
  className = "h-40",
  colorClass = "text-emerald-500/30",
}: WavePlusSymbolsProps) {
  return (
    <div className={`absolute left-0 right-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wavePlusAnimation {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(180deg);
          }
          100% {
            transform: translateY(0px) rotate(360deg);
          }
        }
      `}} />
      <div className="w-full h-full flex justify-between items-center px-4 md:px-12">
        {[...Array(count)].map((_, i) => (
          <span
            key={i}
            className={`text-2xl md:text-3xl font-extrabold font-mono transition-transform ${colorClass}`}
            style={{
              animation: "wavePlusAnimation 5s ease-in-out infinite",
              animationDelay: `${i * 0.4}s`,
            }}
          >
            +
          </span>
        ))}
      </div>
    </div>
  )
}
