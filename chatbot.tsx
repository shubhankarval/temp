"use client"

import * as React from "react"
import { Bot, Send, Trash, X } from "lucide-react"
import { useChat } from "ai/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ChatbotSidebar() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat()
  const [open, setOpen] = React.useState(false)
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  // Format messages to include timestamps
  const formattedMessages = React.useMemo(() => {
    return messages.map((message) => ({
      ...message,
      timestamp: new Date(),
    })) as Message[]
  }, [messages])

  // Scroll to bottom when messages change
  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [formattedMessages])

  // Clear chat history
  const handleClearChat = () => {
    setMessages([])
  }

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <TooltipProvider>
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <Sidebar side="right" variant="floating" className="w-[350px] sm:w-[400px]">
          <SidebarHeader className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">{isLoading ? "Thinking..." : "Ready to help"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearChat}
                    disabled={formattedMessages.length === 0}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Clear chat</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear chat</TooltipContent>
              </Tooltip>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </SidebarHeader>
          <SidebarContent ref={scrollAreaRef} className="p-4">
            {formattedMessages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
                <Bot className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="font-semibold">How can I help you today?</h3>
                <p className="text-sm text-muted-foreground">Ask me anything and I'll do my best to assist you.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {formattedMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex max-w-[80%] flex-col gap-1 rounded-lg p-3 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      <div
                        className={`text-right text-xs ${
                          message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg bg-muted p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/50"></div>
                        <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/50 animation-delay-200"></div>
                        <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/50 animation-delay-400"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit(e)
                // Open sidebar if closed when sending a message
                if (!open) setOpen(true)
              }}
              className="flex flex-col gap-2"
            >
              <Textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="min-h-24 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    const form = e.currentTarget.form
                    if (form) form.requestSubmit()
                  }
                }}
              />
              <div className="flex justify-between">
                <p className="text-xs text-muted-foreground">
                  Press <kbd className="rounded border px-1 text-xs">Enter</kbd> to send,{" "}
                  <kbd className="rounded border px-1 text-xs">Shift + Enter</kbd> for new line
                </p>
                <Button type="submit" size="sm" disabled={input.trim() === "" || isLoading}>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </div>
            </form>
          </SidebarFooter>
        </Sidebar>
        <div className="fixed bottom-4 right-4 z-10">
          <SidebarTrigger/>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
