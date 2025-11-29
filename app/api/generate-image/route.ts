import { NextRequest, NextResponse } from 'next/server'
import { getOpenAIClient } from '@/lib/ai'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt, index = 0 } = body || {}
    const client = getOpenAIClient()

    if (!client) {
      const seed = encodeURIComponent(String(prompt||'classroom'))
      const url = `https://picsum.photos/seed/${seed}-${index}/640/400`
      return NextResponse.json({ url })
    }

    const img = await client.images.generate({
      model: 'gpt-image-1',
      prompt: String(prompt||'Child-friendly classroom illustration'),
      size: '1024x1024'
    })
    const b64 = img.data?.[0]?.b64_json
    if (!b64) {
      const url = `https://picsum.photos/seed/fallback-${index}/640/400`
      return NextResponse.json({ url })
    }
    const url = `data:image/png;base64,${b64}`
    return NextResponse.json({ url })
  } catch (e: any) {
    const url = `https://picsum.photos/seed/error/640/400`
    return NextResponse.json({ url })
  }
}
