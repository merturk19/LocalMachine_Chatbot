export type OpenRouterMessage = {
    role: 'system' | 'user' | 'assistant'
    content: string
}

export type OpenRouterModel = {
    id: string
    name: string
}

const BASE_URL = 'https://openrouter.ai/api/v1'

function buildHeaders(): HeadersInit {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
    if (!apiKey) {
        throw new Error('Missing VITE_OPENROUTER_API_KEY')
    }
    return {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    }
}

export async function getModels(): Promise<OpenRouterModel[]> {
    const res = await fetch(`${BASE_URL}/models`, {
        method: 'GET',
        headers: buildHeaders(),
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch models: ${res.status}`)
    }
    const data = await res.json()

    const models: OpenRouterModel[] = (data?.data ?? []).map((m: any) => ({
        id: m?.id,
        name: m?.name || m?.id,
    }))
    return models
}

export async function chatCompletion(params: {
    model: string
    messages: OpenRouterMessage[]
}): Promise<string> {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({
            model: params.model,
            messages: params.messages,
        }),
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(`Chat error ${res.status}: ${text}`)
    }
    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content
    
    if (typeof content !== 'string') {
        throw new Error('No content in response')
    }
    return content
}