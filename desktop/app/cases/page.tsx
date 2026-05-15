"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal, Filter, ShieldAlert } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const matters = [
  { id: "MAT-2024-089", name: "Smith v. OmniCorp", client: "David Smith", status: "Discovery", type: "Litigation", updated: "2h ago", priority: "High" },
  { id: "MAT-2024-091", name: "TechStart Merger D.D.", client: "TechStart Inc.", status: "Reviewing", type: "M&A", updated: "Yesterday", priority: "Medium" },
  { id: "MAT-2024-065", name: "Estate of M. Jane", client: "Jane Family", status: "Filing", type: "Probate", updated: "3 days ago", priority: "Low" },
  { id: "MAT-2024-098", name: "Global Logistics Arbitration", client: "Global Logistics PLC", status: "Hearing Prep", type: "Arbitration", updated: "5h ago", priority: "High" },
  { id: "MAT-2024-102", name: "Wright v. Davis", client: "Sarah Wright", status: "Pre-Trial", type: "Litigation", updated: "Oct 12", priority: "Medium" },
]

export default function MattersPage() {
  const { role } = useAuth()

  if (role === "INTERN") {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 animate-in fade-in">
        <ShieldAlert className="h-12 w-12 text-red-500/50" />
        <h2 className="text-xl font-serif italic text-white">Access Denied</h2>
        <p className="text-xs uppercase tracking-widest text-white/40 font-mono">This area is restricted due to Privileged Matter constraints.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Legal Matters</h1>
          <p className="text-white/40 text-xs tracking-widest uppercase">Registry & Case Progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 border-white/20 text-white/80 hover:bg-white/10 hover:text-white rounded uppercase tracking-widest text-[10px] font-bold">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" className="h-9 bg-white text-black hover:bg-white/90 rounded text-[10px] uppercase font-bold tracking-widest">
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10 rounded-2xl shadow-none mt-8 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40">ID</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40">Matter Name</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40">Client</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40">Type</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40">Status</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40">Priority</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40">Last Updated</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matters.map((matter) => (
              <TableRow key={matter.id} className="border-white/5 hover:bg-white/[0.02]">
                <TableCell className="font-mono text-xs text-white/40">{matter.id}</TableCell>
                <TableCell className="font-medium">{matter.name}</TableCell>
                <TableCell className="text-white/60">{matter.client}</TableCell>
                <TableCell className="text-white/80">{matter.type}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono font-normal text-[10px] border-white/20 text-white/60 uppercase tracking-widest uppercase rounded">
                    {matter.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${matter.priority === 'High' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : matter.priority === 'Medium' ? 'bg-amber-400' : 'bg-white/40'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">{matter.priority}</span>
                  </div>
                </TableCell>
                <TableCell className="text-white/40 text-[10px] font-mono tracking-widest uppercase">{matter.updated}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white rounded">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
