"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PortalSidebar } from "@/components/portal-sidebar"

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    // Verify token validity (optional)
    const verifyToken = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/health", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Invalid token")
        }

        setLoading(false)
      } catch (error) {
        console.error("Authentication error:", error)
        localStorage.removeItem("token")
        router.push("/login")
      }
    }

    verifyToken()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PortalSidebar />
      <div className="flex-1">{children}</div>
    </div>
  )
}
