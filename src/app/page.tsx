import ImageGenerator from '@/components/ImageGenerator'

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        <ImageGenerator />
      </div>
    </main>
  )
}