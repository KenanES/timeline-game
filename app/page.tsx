import { Suspense } from 'react'
import TimelineGame from '@/components/TimelineGame'
import Loading from './loading'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 sm:p-4 md:p-8">
      <Suspense fallback={<Loading />}>
        <TimelineGame />
      </Suspense>
    </main>
  )
}

