import { Suspense } from 'react'
import TimelineGame from '@/components/TimelineGame'
import Loading from './loading'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-1 sm:p-4 md:p-8 overflow-x-hidden">
      <Suspense fallback={<Loading />}>
        <TimelineGame />
      </Suspense>
      <div className="h-4 sm:h-8"></div> {/* Bottom spacing */}
    </main>
  )
}

