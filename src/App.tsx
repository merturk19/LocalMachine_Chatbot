import { useState } from 'react'
import { Chat } from './components/Chat'

type ChatMessage = {
    id: string
    role: 'user' | 'assistant'
    content: string
}

function App() {
    const [messages] = useState<ChatMessage[]>([
        { id: 'm1', role: 'assistant', content: 'Hey! I\'m your local AI. How can I help today?' },
        { id: 'm2', role: 'user', content: 'Create a simple chat UI using Tailwind.' },
        { id: 'm3', role: 'assistant', content: 'Done! Try sending a message below.' },
        { id: 'm4', role: 'assistant', content: 'sample response' }
    ])

    return (
        <Chat messages={messages} />
    )
}


export default App
