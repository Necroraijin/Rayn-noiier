"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileUp, Sparkles, Loader2, ListChecks, CheckCircle2 } from "lucide-react"
import { GoogleGenAI } from "@google/genai"
import Markdown from 'react-markdown'

export function DocumentsPage() {
  const [inputText, setInputText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState("")

  const handleAnalyze = async () => {
    if (!inputText.trim()) return
    setIsAnalyzing(true)
    setErrorMsg("")
    setResult(null)

    try {
      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error("Gemini API key is not configured. Please add GEMINI_API_KEY in the environment secrets.")
      }
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY })
      
      const prompt = `You are a highly capable AI Legal Assistant. 
Analyze the following legal text. Please extract the key clauses, summarize the main points, and flag any potential risks or unusual liabilities. Format your output strictly in markdown, using headings, clear bullet points, and bold text for emphasis where appropriate. Maintain a professional, objective legal tone. \n\nDocument Text:\n${inputText}`

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
      })

      if (response.text) {
        setResult(response.text)
      } else {
        throw new Error("No response generated from the model.")
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || "An error occurred during analysis.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Document Intelligence</h1>
        <p className="text-white/40 text-xs tracking-widest uppercase">Automated Summarization & Extraction</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-0">
        <Card className="bg-white/5 border-white/10 rounded-2xl shadow-none flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs uppercase tracking-[0.3em] font-bold text-white/40">Input Source</CardTitle>
              <Button variant="outline" size="sm" className="h-8 gap-2 bg-transparent border-white/20 text-white/80 hover:bg-white/10 hover:text-white rounded text-[10px] uppercase font-bold tracking-widest">
                <FileUp className="h-4 w-4" />
                Upload
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-6 pt-0">
            <Textarea 
              placeholder="PASTE CONTRACT PROVISIONS HERE..." 
              className="flex-1 resize-none bg-black/50 border-white/10 focus-visible:ring-1 focus-visible:ring-emerald-500 placeholder:text-white/20 placeholder:tracking-widest font-mono text-sm"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || inputText.length === 0}
                className="bg-white text-black hover:bg-white/90 text-[10px] font-bold uppercase tracking-widest rounded px-6 py-4 h-auto"
              >
                {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Analyze Document
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs uppercase tracking-[0.3em] font-bold text-white/40">Neural Output</CardTitle>
              {result && <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-mono text-[10px] px-2 uppercase tracking-widest"><CheckCircle2 className="mr-1 h-3 w-3" /> Complete</Badge>}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-6 pt-0">
             {isAnalyzing ? (
               <div className="flex flex-col items-center justify-center h-full text-white/40 space-y-4">
                 <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                 <p className="text-[10px] uppercase tracking-[0.3em] font-bold animate-pulse">Synthesizing</p>
                 <div className="w-full max-w-xs space-y-2 mt-4 opacity-50">
                    <div className="h-1 bg-white/20 rounded animate-pulse w-full"></div>
                    <div className="h-1 bg-white/20 rounded animate-pulse w-5/6 delay-75"></div>
                    <div className="h-1 bg-white/20 rounded animate-pulse w-4/6 delay-150"></div>
                 </div>
               </div>
             ) : errorMsg ? (
               <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-mono">
                 <p className="font-bold mb-1 uppercase tracking-widest text-[10px]">Analysis Failed</p>
                 <p>{errorMsg}</p>
               </div>
             ) : result ? (
               <div className="prose prose-invert prose-sm max-w-none 
                 prose-h2:text-lg prose-h2:font-serif prose-h2:italic prose-h2:tracking-tighter prose-h2:mt-6 prose-h2:mb-4
                 prose-h3:text-xs prose-h3:uppercase prose-h3:tracking-[0.2em] prose-h3:text-white/60
                 prose-p:text-white/70
                 prose-li:text-white/70 marker:text-emerald-500">
                 <Markdown>{result}</Markdown>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-white/20">
                 <ListChecks className="h-10 w-10 mb-4 opacity-20" />
                 <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Awaiting Source Request</p>
               </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
