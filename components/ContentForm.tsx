"use client";
import { useState } from 'react';

const subjects = ["Maths", "EVS", "English", "Hindi"] as const;
const grades = ["1", "2", "3", "4", "5"] as const;
const languages = ["English", "Hindi"] as const;

type Generation = {
  topic: string;
  subject: typeof subjects[number];
  grade: typeof grades[number];
  language: typeof languages[number];
  style: string;
  length: 'short' | 'medium' | 'long';
}

export default function ContentForm() {
  const [gen, setGen] = useState<Generation>({
    topic: '', subject: 'English' as any, grade: '3' as any, language: 'English', style: 'playful, child-friendly', length: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lesson',
          ...gen,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setResult(data.text);
    } catch (e: any) {
      setResult('There was an error generating content. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3>Create Creative Content</h3>
      <form className="grid" style={{gap: 12}} onSubmit={onSubmit}>
        <div className="row">
          <div>
            <label className="small">Subject</label>
            <select value={gen.subject} onChange={e => setGen(g => ({...g, subject: e.target.value as any}))}>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="small">Grade</label>
            <select value={gen.grade} onChange={e => setGen(g => ({...g, grade: e.target.value as any}))}>
              {grades.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="small">Language</label>
            <select value={gen.language} onChange={e => setGen(g => ({...g, language: e.target.value as any}))}>
              {languages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="small">Topic / Theme</label>
          <input className="input" placeholder="e.g. Water conservation during monsoon" value={gen.topic} onChange={e => setGen(g => ({...g, topic: e.target.value}))} />
        </div>
        <div className="row">
          <div>
            <label className="small">Style</label>
            <input className="input" placeholder="playful, inquiry-based" value={gen.style} onChange={e => setGen(g => ({...g, style: e.target.value}))} />
          </div>
          <div>
            <label className="small">Length</label>
            <select value={gen.length} onChange={e => setGen(g => ({...g, length: e.target.value as any}))}>
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
        </div>
        <button className="button" disabled={loading}>{loading? 'Generating?' : 'Generate'}</button>
      </form>
      {result && (
        <div style={{marginTop: 16}}>
          <h4>Result</h4>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
