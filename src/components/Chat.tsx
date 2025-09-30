import { MessageBubble } from "./MessageBubble";
import React, { useEffect, useState } from "react";
import { chatCompletion } from "../services/OpenRouterService";
import type { OpenRouterMessage } from "../services/OpenRouterService";

type ChatMessage = {
    id: string
    role: 'user' | 'assistant'
    content: string
}

type Agent = {
    id: string
    name: string
}

type Props = {
    messages: ChatMessage[]
    agents: Agent[]
}

export const Chat: React.FC<Props> = ({ messages, agents }) => {
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
        const stored = localStorage.getItem("chat_history");
        if (stored) {
          try {
            return JSON.parse(stored) as ChatMessage[];
          } catch {
            return messages; 
          }
        }
        return messages;
      });
    const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0])
    const [textareaValue, setTextareaValue] = useState<string>('')

    useEffect(() => {
        setSelectedAgent(agents[0])
    }, [messages, agents])

    useEffect(() => {
        //setting local storage here for refreshing after each message entry
        localStorage.setItem("chat_history", JSON.stringify(chatMessages, null, 2))
    }, [chatMessages])

    const handleSendMessage = async (message: string) => {
        const userMsg = { id: crypto.randomUUID(), role: 'user' as const, content: message }
        setChatMessages((prev) => ([...(prev ?? []), userMsg]))
        setTextareaValue('')

        try {
            const orMessages: OpenRouterMessage[] = [...(chatMessages ?? []), userMsg].map(m => ({
                role: m.role,
                content: m.content,
            }))
            const reply = await chatCompletion({ model: selectedAgent.id, messages: orMessages })
            setChatMessages((prev) => ([...(prev ?? []), { id: crypto.randomUUID(), role: 'assistant', content: reply }]))
        } catch (e: any) {
            setChatMessages((prev) => ([...(prev ?? []), { id: crypto.randomUUID(), role: 'assistant', content: `Error: ${e?.message || 'failed to chat'}` }]))
        }
    }

    return (
        <div className="min-h-screen bg-black text-neutral-200 grid grid-cols-[10%_50%_30%_10%]">
            {/* Left empty col */}
            <div></div>

            {/* Chat window */}
            <div className="flex h-screen flex-col border-x border-white/10">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                        <h1 className="text-sm font-semibold tracking-wide text-white">Local Machine Chat</h1>
                        <div className="text-xs text-neutral-700">In Development</div>
                    </div>
                </header>

                {/* Messages */}
                <main className="flex-1 overflow-y-auto px-4 py-6">
                    <div className="mx-auto flex max-w-2xl flex-col gap-4">
                        {chatMessages.map((m) => (
                            <MessageBubble key={m.id} role={m.role} content={m.content} />
                        ))}
                    </div>
                </main>

                {/* Composer */}
                <footer className="border-t border-white/10 bg-neutral-950/50 p-4">
                    <div className="mx-auto flex max-w-2xl items-end gap-2">
                        <div className="relative flex-1">
                            <textarea
                                placeholder="Type a message..."
                                rows={1}
                                className="block w-full resize-none rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white placeholder:text-neutral-500 shadow-inner outline-none focus:border-white/20 focus:ring-0"
                                value={textareaValue}
                                onChange={(e) => setTextareaValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        if (textareaValue) {
                                            handleSendMessage(textareaValue);
                                        }
                                    }
                                }}
                            />
                        </div>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
                            onClick={() => {
                                if (textareaValue) {
                                    handleSendMessage(textareaValue);
                                }
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5"
                            >
                                <path d="M3.4 20.6 22 12 3.4 3.4l3.2 6.9L14 12l-7.4 1.7-3.2 6.9z" />
                            </svg>
                            Send
                        </button>
                    </div>
                </footer>
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-2 p-6">
                <button className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/30 mb-8">
                    Start new chat +
                </button>
                <div className="text-s text-neutral-400">Selected Model</div>
                <select
                    className="rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white shadow-inner outline-none focus:border-white/20 focus:ring-0"
                    value={selectedAgent?.id}
                    onChange={(e) => setSelectedAgent(agents.find(a => a.id === e.target.value) ?? agents[0])}
                >
                    {agents.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                </select>
            </div>

            {/* Right empty col */}
            <div></div>
        </div>
    )
}
