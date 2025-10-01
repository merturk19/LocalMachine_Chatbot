import { useState } from 'react'
import { Chat } from './components/Chat'
import { useModelSelector } from './hooks/useModelSelector'

type ChatMessage = {
    id: string
    role: 'user' | 'assistant'
    content: string
    agent: string
}

function App() {

    const [messages] = useState<ChatMessage[]>([
        { id: 'm1', role: 'assistant', content: 'Hey! I\'m your local AI. Start chatting with desired model by selecting it from the sidebar.', agent: "not picked" },
    ])

    const agents = useModelSelector().availableModels;

    return (
        <div>
            <>
              <Chat messages={messages} agents={agents} />
            </>
        </div>
      );
}


export default App
