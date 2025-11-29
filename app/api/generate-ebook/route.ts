import { NextRequest, NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { title = 'Story Book', author = 'Teacher', language = 'English', text = '', images = [] } = await req.json()

    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const chunks: Buffer[] = []
    const stream = doc.on('data', (c: Buffer) => chunks.push(c)).on('end', () => {})

    // Cover
    doc.fontSize(28).text(title, { align: 'center' })
    doc.moveDown(0.5).fontSize(14).fillColor('#555').text(`by ${author}`, { align: 'center' })
    doc.moveDown(1).fillColor('#000')
    if (images[0]) {
      try { doc.moveDown(1).image(images[0], { fit: [450, 350], align: 'center', valign: 'center' }) } catch {}
    }
    doc.addPage()

    // Body
    const paras = String(text || '').split(/\n\n+/)
    doc.fontSize(12)
    for (let i=0;i<paras.length;i++) {
      const p = paras[i]
      doc.text(p, { align: 'left' })
      doc.moveDown(0.8)
      if (images[i+1]) {
        try { doc.image(images[i+1], { fit: [420, 260], align: 'center', valign: 'center' }) } catch {}
        doc.moveDown(0.8)
      }
      if (doc.y > 700) doc.addPage()
    }

    // Footer
    doc.moveDown(1)
    doc.fontSize(10).fillColor('#666').text(language === 'Hindi' ? '????? ??? ClassCraft ??????' : 'Made with ClassCraft', { align: 'center' })

    doc.end()
    const data = await new Promise<Buffer>((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))))

    return new NextResponse(data, { status: 200, headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${title.replace(/\s+/g,'_')}.pdf"` } })
  } catch (e: any) {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
