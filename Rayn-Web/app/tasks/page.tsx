"use client"

import React, { useState, useEffect } from "react"
import { CheckSquare, Clock, AlertTriangle, AlertCircle, Plus, Trash2, Loader2, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface Task {
  id: string
  title: string
  matter: string
  priority: string
  dueDate: string
  completed: boolean
  assignedBy: string
  createdAt: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Form fields
  const [title, setTitle] = useState("")
  const [matter, setMatter] = useState("")
  const [priority, setPriority] = useState("MEDIUM")
  const [dueDate, setDueDate] = useState("")

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/tasks")
      if (res.ok) {
        const data = await res.json()
        setTasks(data.tasks || [])
      }
    } catch (err) {
      console.error("Failed to load tasks:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !matter.trim() || !dueDate.trim()) {
      setErrorMsg("Please fill out all required fields.")
      return
    }

    setIsSubmitting(true)
    setErrorMsg("")

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, matter, priority, dueDate })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to create task.")
      }

      setIsModalOpen(false)
      // Reset form
      setTitle("")
      setMatter("")
      setPriority("MEDIUM")
      setDueDate("")
      // Refetch
      fetchTasks()
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || "An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleComplete = async (id: string, currentCompleted: boolean) => {
    try {
      // Optimistic update
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !currentCompleted } : t))

      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentCompleted })
      })

      if (!res.ok) {
        // Rollback on failure
        const data = await res.json()
        throw new Error(data.error || "Failed to update task.")
      }
    } catch (err) {
      console.error(err)
      // Refetch to sync state
      fetchTasks()
    }
  }

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      // Optimistic update
      setTasks(prev => prev.filter(t => t.id !== id))

      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE"
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete task.")
      }
    } catch (err) {
      console.error(err)
      fetchTasks()
    }
  }

  const getPriorityColor = (p: string) => {
    switch (p.toUpperCase()) {
      case "HIGH": return "text-red-400"
      case "MEDIUM": return "text-yellow-400"
      case "LOW": return "text-green-400"
      default: return "text-white/40"
    }
  }

  return (
    <div className="h-full flex flex-col items-start w-full animate-in fade-in space-y-8 pb-10">
      <div className="border-b border-white/10 pb-4 w-full flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 md:gap-0">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2 italic font-serif">Task Manager</h1>
          <p className="text-white/40 text-xs tracking-widest uppercase">My Assignments & Delegated Items</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger render={
            <Button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black hover:bg-emerald-400 rounded text-[10px] font-bold uppercase tracking-widest transition-colors h-9">
              <Plus className="w-4 h-4" /> New Task
            </Button>
          } />
          <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-serif italic text-xl font-light">Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-6 py-4">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-xs font-mono">
                  {errorMsg}
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Task Title</Label>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="bg-black/50 border-white/10 focus-visible:ring-emerald-500 font-mono text-sm" 
                  placeholder="e.g. Draft Non-Compete Clause" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Matter / Case Context</Label>
                <Input 
                  value={matter} 
                  onChange={(e) => setMatter(e.target.value)} 
                  className="bg-black/50 border-white/10 focus-visible:ring-emerald-500 font-mono text-sm" 
                  placeholder="e.g. Smith v. OmniCorp" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Priority</Label>
                  <select 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value)} 
                    className="w-full h-10 bg-black/50 border border-white/10 rounded-md px-3 text-sm font-mono text-white outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Due Date / Timeline</Label>
                  <Input 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)} 
                    className="bg-black/50 border-white/10 focus-visible:ring-emerald-500 font-mono text-sm" 
                    placeholder="e.g. Today, Tomorrow, Oct 15" 
                    required 
                  />
                </div>
              </div>
              <DialogFooter className="pt-4 border-t border-white/5">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-white text-black hover:bg-white/95 uppercase tracking-widest font-bold text-[10px] rounded px-6"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" /> Save Task</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full flex-1">
         <div className="lg:col-span-8 flex flex-col space-y-6">
            <h2 className="text-xs uppercase tracking-widest font-bold text-white/40">My Queue</h2>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-white/40">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                <span className="text-[9px] uppercase tracking-[0.2em]">Synchronizing Tasks...</span>
              </div>
            ) : tasks.length === 0 ? (
              <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center text-white/30 flex flex-col items-center justify-center bg-white/[0.01]">
                <Clock className="w-8 h-8 mb-3 opacity-30" />
                <p className="text-xs font-serif italic">Your task queue is currently empty.</p>
                <p className="text-[9px] font-mono uppercase tracking-widest mt-1 opacity-60">Add a task using &quot;New Task&quot; above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`bg-white/5 border border-white/10 rounded-lg p-4 flex items-start justify-between cursor-pointer hover:bg-white/[0.08] transition-colors ${task.completed ? "opacity-40 line-through bg-black/20 border-white/5" : ""}`}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <button 
                        onClick={() => handleToggleComplete(task.id, task.completed)}
                        className="mt-0.5 min-w-5"
                      >
                        {task.completed ? (
                          <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center">
                            <CheckSquare className="w-3.5 h-3.5 text-black" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded border-2 border-white/20 hover:border-emerald-500 transition-colors"></div>
                        )}
                      </button>
                      <div className="min-w-0 flex-1 pr-4" onClick={() => handleToggleComplete(task.id, task.completed)}>
                        <h4 className="text-sm font-medium text-white/90 break-words">{task.title}</h4>
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">Matter: {task.matter}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className={`flex items-center gap-1 text-[9px] uppercase tracking-widest ${getPriorityColor(task.priority)}`}>
                            <AlertCircle className="w-3 h-3" /> {task.priority} Priority
                          </span>
                          <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-yellow-400">
                            <Clock className="w-3 h-3" /> Due: {task.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between h-full min-h-[50px] shrink-0">
                      <div className="text-[9px] uppercase tracking-widest text-white/30 text-right mb-2">
                        Assigned:<br/>
                        <span className="text-white/60">{task.assignedBy}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteTask(task.id)
                        }}
                        className="text-white/20 hover:text-red-400 transition-colors p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
         </div>

         <div className="lg:col-span-4 flex flex-col space-y-6">
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-6 flex-col flex h-full">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-6 flex items-center gap-2">
                Workload Intelligence
              </h3>
              <div className="flex-1 space-y-6">
                 <div>
                    <div className="flex justify-between text-[10px] font-mono uppercase mb-2 text-white/60">
                      <span>Current Capacity</span>
                      <span className="text-emerald-400">Optimal (84%)</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 w-[84%]" />
                    </div>
                 </div>

                 <div className="border border-yellow-500/20 bg-yellow-500/5 p-4 rounded-lg">
                   <div className="flex items-center gap-2 text-yellow-400 mb-2">
                     <AlertTriangle className="w-4 h-4" />
                     <h4 className="text-xs font-bold uppercase tracking-widest">Deadline Clustering</h4>
                   </div>
                   <p className="text-[10px] font-mono text-yellow-100/60 leading-relaxed uppercase tracking-widest mt-1 text-justify">
                     You have deliverables clustered in the current timeline. ARBITER suggests checking in on research briefs to distribute workloads.
                   </p>
                 </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}
