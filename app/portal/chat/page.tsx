"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Send, Bot, Sparkles } from "lucide-react"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  source?: "medical_bot" | "gemini"
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeSource, setActiveSource] = useState<"medical_bot" | "gemini">("medical_bot")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: input,
          source: activeSource,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Failed to get response")
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "bot",
        source: data.source,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, there was an error processing your request. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <MessageSquare className="mr-2 h-6 w-6" />
        Medical Chat
      </h1>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <Tabs
            defaultValue="medical_bot"
            onValueChange={(value) => setActiveSource(value as "medical_bot" | "gemini")}
          >
            <div className="flex justify-between items-center">
              <CardTitle>Chat with AI</CardTitle>
              <TabsList>
                <TabsTrigger value="medical_bot" className="flex items-center">
                  <Bot className="mr-2 h-4 w-4" />
                  Smart Aid
                </TabsTrigger>
                <TabsTrigger value="gemini" className="flex items-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Deep Aid
                </TabsTrigger>
              </TabsList>
            </div>
            <CardDescription>
              <TabsContent value="medical_bot">
                Ask medical questions to our specialized medical AI assistant
              </TabsContent>
              <TabsContent value="gemini">Get general medical information from Google's Gemini AI</TabsContent>
            </CardDescription>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] overflow-y-auto border rounded-md p-4 mb-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                <p>No messages yet</p>
                <p className="text-sm">Start a conversation by sending a message</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex items-start max-w-[80%]">
                      {message.sender === "bot" && (
                        <Avatar className="mr-2">
                          <AvatarFallback
                            className={
                              message.source === "gemini"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-blue-100 text-blue-600"
                            }
                          >
                            {message.source === "gemini" ? "D" : "S"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg p-3 ${
                          message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <div
                          className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      {message.sender === "user" && (
                        <Avatar className="ml-2">
                          <AvatarFallback className="bg-blue-600 text-white">U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSendMessage} className="w-full flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
