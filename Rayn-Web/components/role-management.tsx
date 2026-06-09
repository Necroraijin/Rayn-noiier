"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, UserPlus, Users, Edit, Trash2, Plus, ArrowLeft } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const ALL_PERMISSIONS = [
  "Read/Write All",
  "Audit Access",
  "Billing",
  "Manage Matters",
  "AI Analysis",
  "Client Comms",
  "View Own Matter",
  "Read Docs",
  "Messaging"
]

type RoleType = {
  id: string
  name: string
  description: string
  permissions: string[]
}

type UserType = {
  id: string
  name: string
  email: string
  roleId: string
}

const initialRoles: RoleType[] = [
  { id: "r1", name: "Partner / Admin", description: "Full system access. Can modify roles and view audit logs.", permissions: ["Read/Write All", "Audit Access", "Billing"] },
  { id: "r2", name: "Associate / Paralegal", description: "Can manage matters, upload docs, and use AI features.", permissions: ["Manage Matters", "AI Analysis", "Client Comms"] },
  { id: "r3", name: "Client Portal", description: "Restricted to assigned matters only. Read-only for docs.", permissions: ["View Own Matter", "Read Docs", "Messaging"] },
]

const initialUsers: UserType[] = [
  { id: "u1", name: "Alice Admin", email: "a.admin@rayn.law", roleId: "r1" },
  { id: "u2", name: "Bob Partner", email: "b.partner@rayn.law", roleId: "r1" },
  { id: "u3", name: "Eve Associate", email: "e.associate@rayn.law", roleId: "r2" },
  { id: "u4", name: "Charlie Client", email: "charlie@clientcorp.com", roleId: "r3" },
]

export default function RoleManagement() {
  const [roles, setRoles] = useState<RoleType[]>(initialRoles)
  const [users, setUsers] = useState<UserType[]>(initialUsers)
  
  const [viewingRole, setViewingRole] = useState<string | null>(null)
  
  // Role Edit/Add State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<RoleType | null>(null)
  const [roleForm, setRoleForm] = useState({ name: "", description: "", permissions: [] as string[] })

  // User Add State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [userForm, setUserForm] = useState({ name: "", email: "", roleId: "" })

  const handleOpenRoleModal = (role?: RoleType) => {
    if (role) {
      setEditingRole(role)
      setRoleForm({ name: role.name, description: role.description, permissions: [...role.permissions] })
    } else {
      setEditingRole(null)
      setRoleForm({ name: "", description: "", permissions: [] })
    }
    setIsRoleModalOpen(true)
  }

  const handleSaveRole = () => {
    if (!roleForm.name) return
    
    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...editingRole, ...roleForm } : r))
    } else {
      setRoles([...roles, { id: `r${Date.now()}`, ...roleForm }])
    }
    setIsRoleModalOpen(false)
  }

  const handleDeleteRole = (id: string) => {
    setRoles(roles.filter(r => r.id !== id))
    // Also re-assign users or handle cascading if necessary, out of scope for mock
  }

  const togglePermission = (perm: string) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm) 
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }))
  }

  const handleSaveUser = () => {
    if (!userForm.name || !userForm.email || !userForm.roleId) return
    setUsers([...users, { id: `u${Date.now()}`, ...userForm }])
    setIsUserModalOpen(false)
    setUserForm({ name: "", email: "", roleId: "" })
  }

  if (viewingRole) {
    const roleDetails = roles.find(r => r.id === viewingRole)
    const roleUsers = users.filter(u => u.roleId === viewingRole)
    
    return (
      <div className="space-y-8 animate-in fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setViewingRole(null)} className="h-8 w-8 text-white/50 hover:text-white rounded">
             <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="text-lg font-light font-serif italic text-white/90">{roleDetails?.name} Users</h3>
            <p className="text-[10px] tracking-widest uppercase text-white/40 mt-1">Found {roleUsers.length} assigned users</p>
          </div>
        </div>

        <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40">User ID</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40">Name</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-white/40">Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roleUsers.length === 0 && (
                <TableRow className="border-none hover:bg-transparent">
                   <TableCell colSpan={3} className="text-center py-8 text-white/30 text-xs font-mono uppercase tracking-widest">No users assigned to this role</TableCell>
                </TableRow>
              )}
              {roleUsers.map(u => (
                 <TableRow key={u.id} className="border-white/5 hover:bg-white/[0.02]">
                   <TableCell className="font-mono text-xs text-white/40">{u.id}</TableCell>
                   <TableCell className="font-bold text-white/80">{u.name}</TableCell>
                   <TableCell className="text-white/60 font-mono text-xs">{u.email}</TableCell>
                 </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <div>
           <h3 className="text-lg font-light font-serif italic text-white/90">Role-Based Access Control</h3>
           <p className="text-[10px] tracking-widest uppercase text-white/40 mt-1">Manage privileges across tiers.</p>
         </div>
         <div className="flex gap-4">
           {/* Add Role */}
           <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
             <DialogTrigger render={<Button variant="outline" size="sm" onClick={() => handleOpenRoleModal()} className="h-9 gap-2 border-white/20 text-white/80 hover:bg-white/10 hover:text-white rounded uppercase tracking-widest text-[10px] font-bold" />}>
                 <Shield className="h-4 w-4" /> New Role
             </DialogTrigger>
             <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[500px]">
               <DialogHeader>
                 <DialogTitle className="font-serif italic text-xl font-light">{editingRole ? "Edit Role" : "Create Role"}</DialogTitle>
               </DialogHeader>
               <div className="space-y-6 py-4">
                 <div className="space-y-2">
                   <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Role Name</Label>
                   <Input value={roleForm.name} onChange={(e) => setRoleForm({...roleForm, name: e.target.value})} className="bg-black/50 border-white/10 focus-visible:ring-emerald-500 font-mono text-sm" placeholder="e.g. Senior Partner" />
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Description</Label>
                   <Input value={roleForm.description} onChange={(e) => setRoleForm({...roleForm, description: e.target.value})} className="bg-black/50 border-white/10 focus-visible:ring-emerald-500 font-mono text-sm" placeholder="Brief access summary" />
                 </div>
                 <div className="space-y-4">
                   <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Permissions</Label>
                   <div className="flex flex-wrap gap-2">
                     {ALL_PERMISSIONS.map(p => {
                       const active = roleForm.permissions.includes(p)
                       return (
                         <Badge 
                           key={p} 
                           variant="outline" 
                           onClick={() => togglePermission(p)}
                           className={`cursor-pointer font-mono font-normal text-[10px] rounded uppercase tracking-widest transition-all ${active ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-transparent text-white/40 border-white/10 hover:border-white/30"}`}
                         >
                           {p}
                         </Badge>
                       )
                     })}
                   </div>
                 </div>
               </div>
               <DialogFooter>
                 <Button variant="outline" onClick={() => setIsRoleModalOpen(false)} className="border-white/20 text-white/60 hover:text-white rounded uppercase tracking-widest text-[10px] font-bold">Cancel</Button>
                 <Button onClick={handleSaveRole} className="bg-white text-black hover:bg-white/90 rounded uppercase tracking-widest text-[10px] font-bold">Save Role</Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>

           {/* Add User */}
           <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
             <DialogTrigger render={<Button variant="outline" size="sm" className="h-9 gap-2 border-white/20 text-white/80 hover:bg-white/10 hover:text-white rounded uppercase tracking-widest text-[10px] font-bold" />}>
                 <UserPlus className="h-4 w-4" /> Add User
             </DialogTrigger>
             <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[400px]">
               <DialogHeader>
                 <DialogTitle className="font-serif italic text-xl font-light">Assign User</DialogTitle>
               </DialogHeader>
               <div className="space-y-6 py-4">
                 <div className="space-y-2">
                   <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Full Name</Label>
                   <Input value={userForm.name} onChange={(e) => setUserForm({...userForm, name: e.target.value})} className="bg-black/50 border-white/10 py-5 focus-visible:ring-emerald-500 font-mono text-sm" placeholder="e.g. Jane Doe" />
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Email Address</Label>
                   <Input type="email" value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} className="bg-black/50 border-white/10 py-5 focus-visible:ring-emerald-500 font-mono text-sm" placeholder="jane@rayn.law" />
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Role assignment</Label>
                   <select 
                     className="w-full bg-black/50 border border-white/10 rounded py-3 px-3 text-sm font-mono focus:ring-1 focus:ring-emerald-500 outline-none text-white/80"
                     value={userForm.roleId}
                     onChange={(e) => setUserForm({...userForm, roleId: e.target.value})}
                   >
                     <option value="" disabled>Select a role...</option>
                     {roles.map(r => (
                       <option key={r.id} value={r.id}>{r.name}</option>
                     ))}
                   </select>
                 </div>
               </div>
               <DialogFooter>
                 <Button onClick={handleSaveUser} disabled={!userForm.name || !userForm.email || !userForm.roleId} className="w-full bg-white text-black py-5 hover:bg-white/90 rounded uppercase tracking-widest text-[10px] font-bold">Add to Workspace</Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {roles.map((tier) => {
            const assignedCount = users.filter(u => u.roleId === tier.id).length
            return (
              <Card key={tier.id} className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-bold tracking-widest uppercase text-white/90 truncate mr-2">{tier.name}</CardTitle>
                    <Badge variant="outline" className="font-mono font-normal text-[9px] border-white/20 text-white/60 tracking-widest shrink-0">{assignedCount} Users</Badge>
                  </div>
                  <CardDescription className="text-xs pt-4 text-white/60 leading-relaxed font-mono min-h-[60px] line-clamp-3">{tier.description || "No description provided."}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-3 flex-1 mb-8">
                    <h4 className="text-[9px] font-bold text-emerald-400/80 uppercase tracking-[0.2em] mb-4">Permissions</h4>
                    <div className="flex flex-wrap gap-2">
                       {tier.permissions.map((p, idx) => (
                         <div key={idx} className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/50 font-mono border border-white/5 px-2 py-1 rounded bg-black/20">
                            {p}
                         </div>
                       ))}
                       {tier.permissions.length === 0 && (
                         <span className="text-xs text-white/20 font-mono italic">No permissions</span>
                       )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-auto">
                     <Button variant="outline" onClick={() => setViewingRole(tier.id)} className="text-[10px] font-bold uppercase tracking-widest border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 rounded h-10 gap-2">
                       <Users className="h-4 w-4" /> View
                     </Button>
                     <Button variant="outline" onClick={() => handleOpenRoleModal(tier)} className="text-[10px] font-bold uppercase tracking-widest border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 rounded h-10 gap-2">
                       <Edit className="h-3 w-3" /> Edit
                     </Button>
                     <Button variant="outline" onClick={() => handleDeleteRole(tier.id)} className="md:col-span-2 text-[10px] font-bold uppercase tracking-widest border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/30 rounded h-10 gap-2">
                       <Trash2 className="h-3 w-3" /> Remove Role
                     </Button>
                  </div>
                </CardContent>
              </Card>
            )
         })}
      </div>
    </div>
  )
}
