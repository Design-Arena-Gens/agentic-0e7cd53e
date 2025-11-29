import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClassCraft ? Creative AI for Primary Teachers',
  description: 'Generate unique lesson content, visual stories, and kids ebooks tailored for India (Grades 1?5).',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <div className="brand">ClassCraft</div>
            <nav className="nav">
              <a href="/" className="nav-link">Home</a>
              <a href="/generate/lesson" className="nav-link">Creative Content</a>
              <a href="/generate/story" className="nav-link">Visual Stories</a>
              <a href="/ebook" className="nav-link">Kids Ebook</a>
            </nav>
          </div>
        </header>
        <main className="container main-content">{children}</main>
        <footer className="site-footer">
          <div className="container">Made for Indian primary teachers ? NEP 2020 aligned</div>
        </footer>
      </body>
    </html>
  )
}
