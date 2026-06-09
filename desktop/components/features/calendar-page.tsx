"use client"

import React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Video } from "lucide-react"

export function CalendarPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Master Calendar</h1>
          <p className="text-white/40 text-xs tracking-widest uppercase">Deadlines & Appointments</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 flex-1 min-h-0">
        <Card className="col-span-1 bg-white/5 border-white/10 rounded-2xl shadow-none flex flex-col">
          <CardHeader>
             <CardTitle className="text-xs uppercase tracking-[0.3em] font-bold text-white/40">Schedule Selection</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-xl border border-white/10 bg-black/20"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-white/[0.02] border-white/10 rounded-2xl shadow-none flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-light italic font-serif">Agenda: {date ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : "Select a date"}</CardTitle>
            <CardDescription className="text-white/40 text-[10px] tracking-widest uppercase">Upcoming appointments and hard deadlines</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto space-y-4">
            {[
               { time: "09:00 AM", duration: "1h", title: "Smith v. OmniCorp: Deposition Prep", type: "Meeting", icon: Video, matter: "MAT-2024-089" },
               { time: "11:30 AM", duration: "30m", title: "Initial Client Consultation - Doe", type: "Consultation", icon: MapPin, matter: "N/A" },
               { time: "04:00 PM", duration: "Hard Deadline", title: "File Motion to Dismiss - Wright", type: "Filing Deadline", icon: Clock, matter: "MAT-2024-102" },
            ].map((event, i) => (
               <div key={i} className="flex gap-4 p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-24 shrink-0 text-[10px] uppercase font-bold tracking-widest text-emerald-400 font-mono flex flex-col justify-center">
                    {event.time}
                    <div className="text-[9px] text-white/40 tracking-normal mt-1 border border-white/10 w-fit px-1">{event.duration}</div>
                  </div>
                  <div className="w-px bg-white/10 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white/90">{event.title}</h4>
                      <Badge variant="outline" className="font-mono font-normal text-[9px] tracking-widest uppercase rounded border-white/20 text-white/50">{event.type}</Badge>
                    </div>
                    <div className="flex items-center text-[10px] uppercase tracking-widest text-white/40 gap-4 font-mono">
                       <span className="flex items-center gap-1"><event.icon className="h-3 w-3" /> Virtual</span>
                       <span>Matter: <span className="text-white/80">{event.matter}</span></span>
                    </div>
                  </div>
               </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
