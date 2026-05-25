"use client"

import React, { createContext, useContext, useState } from "react"

interface NavContextType {
  activeView: string
  setActiveView: (view: string) => void
}

const NavContext = createContext<NavContextType>({
  activeView: "dashboard",
  setActiveView: () => {},
})

export const useNav = () => useContext(NavContext)

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState("dashboard")

  return (
    <NavContext.Provider value={{ activeView, setActiveView }}>
      {children}
    </NavContext.Provider>
  )
}
