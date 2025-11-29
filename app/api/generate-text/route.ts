import { NextRequest, NextResponse } from 'next/server'
import { getOpenAIClient, generateTextFallback } from '@/lib/ai'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, topic, title, prompt, subject, grade, language, style, length } = body || {}

    const client = getOpenAIClient()
    if (!client) {
      const text = await generateTextFallback({ type, topic, title, prompt, subject, grade, language, style, length })
      return NextResponse.json({ text })
    }

    const system = type === 'lesson'
      ? 'You are a creative teaching assistant for Indian primary classrooms (Grades 1-5). Generate concise, age-appropriate material aligned with NEP 2020.'
      : 'You write child-friendly stories with simple language and cultural resonance for India.'

    const user = type === 'lesson'
      ? `Create a ${length||'medium'} ${language||'English'} ${subject||''} (Grade ${grade||'3'}) creative plan on "${topic||title||'Everyday Learning'}" with ${style||'playful tone'}. Include warm-up, main activity, assessment, and homework.`
      : `Write a ${length||'short'} ${language||'English'} story titled "${title||topic||'A School Day'}". Prompt: ${prompt||'Children learn together in class.'}. Keep it classroom-friendly.`

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      temperature: 0.8,
      max_tokens: 600
    })

    const text = completion.choices?.[0]?.message?.content || await generateTextFallback({ type, topic, title, prompt, subject, grade, language, style, length })
    return NextResponse.json({ text })
  } catch (e: any) {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
