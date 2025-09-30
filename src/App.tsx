import { useState } from 'react'
import { Chat } from './components/Chat'

type ChatMessage = {
    id: string
    role: 'user' | 'assistant'
    content: string
}

type Agent = {
    id: string
    name: string
    model: string
}

function App() {
    const [messages] = useState<ChatMessage[]>([
        { id: 'm1', role: 'assistant', content: 'Hey! I\'m your local AI. How can I help today?' },
        { id: 'm2', role: 'user', content: 'Create a simple chat UI using Tailwind.' },
        { id: 'm3', role: 'assistant', content: 'Done! Try sending a message below.' },
    ])

    const [agents] = useState<Agent[]>([
        { id: 'a1', name: 'GPT-4', model: 'gpt-4' },
        { id: 'a2', name: 'Llama-2', model: 'llama-2' },
        { id: 'a3', name: 'Mistral-7B', model: 'mistral-7b' },
        { id: 'a4', name: 'Gemini Pro', model: 'gemini-pro' },
        { id: 'a5', name: 'Claude 3', model: 'claude-3' },
    ])

    return (
        <Chat messages={messages} agents={agents} />
    )
}


export default App
