"use client";
import { useState } from 'react';

export default function EbookBuilder() {
  const [title, setTitle] = useState('My Class Story Book');
  const [author, setAuthor] = useState('Class Teacher');
  const [language, setLanguage] = useState<'English'|'Hindi'>('English');
  const [chapters, setChapters] = useState<string[]>(['Once upon a time...']);
  const [images, setImages] = useState<string[]>([]);

  function addChapter() { setChapters(cs => [...cs, '']); }
  function updateChapter(i: number, v: string) {
    setChapters(cs => cs.map((c,idx)=> idx===i?v:c));
  }

  async function autoWrite() {
    try {
      const res = await fetch('/api/generate-text', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'ebook', title, prompt: chapters.join('\n'), language }) });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      const parts = data.text.split(/\n\n+/).slice(0, 4);
      setChapters(parts.length? parts: [data.text]);
    } catch {}
  }

  async function exportPdf() {
    const text = chapters.join('\n\n');
    const res = await fetch('/api/generate-ebook', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author, language, text, images })
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${title.replace(/\s+/g,'_')}.pdf`; a.click();
    URL.revokeObjectURL(url);
  }

  async function addIllustration() {
    const res = await fetch('/api/generate-image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: `${title} cover illustration`, index: images.length }) });
    if (!res.ok) return;
    const data = await res.json();
    setImages(imgs => [...imgs, data.url]);
  }

  return (
    <div className="card">
      <h3>Kids Ebook Builder</h3>
      <div className="grid" style={{gap: 12}}>
        <div className="row">
          <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
          <input className="input" value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Author" />
          <select value={language} onChange={e=>setLanguage(e.target.value as any)}>
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>
        {chapters.map((c,i)=> (
          <textarea key={i} className="input" rows={4} value={c} onChange={e=>updateChapter(i, e.target.value)} placeholder={`Chapter ${i+1}`} />
        ))}
        <div className="row">
          <button className="button" onClick={addChapter}>Add Chapter</button>
          <button className="button" onClick={autoWrite}>Auto-write with AI</button>
          <button className="button" onClick={addIllustration}>Add Illustration</button>
          <button className="button" onClick={exportPdf}>Export as PDF</button>
        </div>
        {!!images.length && (
          <div className="grid cols-3">
            {images.map((u,i)=> <img key={i} src={u} alt={`Ebook image ${i+1}`} />)}
          </div>
        )}
      </div>
    </div>
  );
}
