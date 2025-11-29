"use client";
import { useState } from 'react';

export default function StoryBuilder() {
  const [title, setTitle] = useState('The Rainy Day Science Fair');
  const [prompt, setPrompt] = useState('A class of Grade 3 children in Mumbai learn about water cycles during monsoon and help conserve water at school.');
  const [language, setLanguage] = useState<'English'|'Hindi'>('English');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  async function generateStory() {
    setLoading(true);
    setText('');
    setImageUrls([]);
    try {
      const res = await fetch('/api/generate-text', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ type: 'story', title, prompt, language })
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setText(data.text);
      // try to fetch 3 images
      const images: string[] = [];
      for (let i=0;i<3;i++) {
        const ir = await fetch('/api/generate-image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: `${title} illustration ${i+1}`, index: i }) });
        if (ir.ok) {
          const ij = await ir.json();
          images.push(ij.url);
        }
      }
      setImageUrls(images);
    } catch (e) {
      setText('Could not generate story. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function exportPdf() {
    const res = await fetch('/api/generate-ebook', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author: 'Class Teacher', language, text, images: imageUrls })
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g,'_')}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card">
      <h3>Visual Story</h3>
      <div className="grid" style={{gap: 12}}>
        <div className="row">
          <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Story title" />
          <select value={language} onChange={e=>setLanguage(e.target.value as any)}>
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>
        <textarea className="input" value={prompt} onChange={e=>setPrompt(e.target.value)} rows={4} placeholder="Prompt describing the story" />
        <div className="row">
          <button className="button" onClick={generateStory} disabled={loading}>{loading? 'Working?' : 'Generate Story + Images'}</button>
          <button className="button" onClick={exportPdf} disabled={!text}>Export as PDF</button>
        </div>
        {!!text && <pre>{text}</pre>}
        {!!imageUrls.length && (
          <div className="grid cols-3">
            {imageUrls.map((u,i)=> (
              <div key={i}>
                <img src={u} alt={`Illustration ${i+1}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
