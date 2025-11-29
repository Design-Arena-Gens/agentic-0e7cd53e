import Link from 'next/link'

export default function Page() {
  return (
    <div className="grid" style={{gap: 24}}>
      <section className="main-hero">
        <div className="grid" style={{gap: 16}}>
          <h1 style={{margin: 0}}>Empower Primary Teachers with Creative AI</h1>
          <p className="small">Generate lesson ideas, worksheets, visual stories, and export printable kids ebooks. Built with Indian primary classrooms in mind (Grades 1?5, English/Hindi, NEP 2020).</p>
          <div className="row">
            <Link href="/generate/lesson" className="button" style={{textAlign:'center'}}>Create Creative Content</Link>
            <Link href="/generate/story" className="button" style={{textAlign:'center'}}>Make Visual Story</Link>
            <Link href="/ebook" className="button" style={{textAlign:'center'}}>Build Kids Ebook</Link>
          </div>
          <div className="small">Tip: Set an <span className="tag">OPENAI_API_KEY</span> on the server for best results. Without it, the app uses smart templates as fallback.</div>
        </div>
        <div className="card grid" style={{gap: 12}}>
          <h3>What you can do</h3>
          <ul>
            <li>Generate unique lesson warm-ups, activities, and assessments</li>
            <li>Create child-friendly stories with artwork</li>
            <li>Export stories as printable PDF ebooks</li>
            <li>Support for English and Hindi classrooms</li>
          </ul>
        </div>
      </section>

      <section className="grid cols-3">
        <div className="card">
          <h3>NEP 2020 Aligned</h3>
          <p className="small">Skills: foundational literacy & numeracy, experiential learning, multi-lingual classrooms.</p>
        </div>
        <div className="card">
          <h3>Built for India</h3>
          <p className="small">Context-aware content with local themes, festivals, and real-life examples.</p>
        </div>
        <div className="card">
          <h3>Export Ready</h3>
          <p className="small">One click to export your story as a PDF ebook.</p>
        </div>
      </section>
    </div>
  )
}
