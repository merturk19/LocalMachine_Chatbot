export function MessageBubble(props: { role: 'user' | 'assistant'; content: string }) {
    const isUser = props.role === 'user'
    return (
        <div className={isUser ? 'flex justify-end' : 'flex justify-start'}>
            <div
                className={
                    'max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow ' +
                    (isUser
                        ? 'bg-white text-black'
                        : 'bg-neutral-900/80 text-neutral-100 ring-1 ring-white/10')
                }
            >
                <div className="whitespace-pre-wrap leading-relaxed">{props.content}</div>
            </div>
        </div>
    )
}