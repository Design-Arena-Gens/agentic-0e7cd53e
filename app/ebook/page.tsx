import dynamic from 'next/dynamic'
const EbookBuilder = dynamic(()=> import('@/components/EbookBuilder'), { ssr: false })

export default function Page(){
  return (
    <div className="grid" style={{gap: 16}}>
      <h2>Kids Ebook</h2>
      <p className="small">Compose short ebooks from your story or lesson content and export as PDF.</p>
      <EbookBuilder />
    </div>
  )
}
