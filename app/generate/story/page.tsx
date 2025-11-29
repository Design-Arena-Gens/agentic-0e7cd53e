import dynamic from 'next/dynamic'
const StoryBuilder = dynamic(()=> import('@/components/StoryBuilder'), { ssr: false })

export default function Page(){
  return (
    <div className="grid" style={{gap: 16}}>
      <h2>Visual Stories</h2>
      <p className="small">Create child-friendly stories with illustrations for the classroom.</p>
      <StoryBuilder />
    </div>
  )
}
