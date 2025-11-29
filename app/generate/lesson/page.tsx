import dynamic from 'next/dynamic'
const ContentForm = dynamic(()=> import('@/components/ContentForm'), { ssr: false })

export default function Page(){
  return (
    <div className="grid" style={{gap: 16}}>
      <h2>Creative Classroom Content</h2>
      <p className="small">Generate warm-ups, activities, and assessments adapted to subject, grade, and language.</p>
      <ContentForm />
    </div>
  )
}
