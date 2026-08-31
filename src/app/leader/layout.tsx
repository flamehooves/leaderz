import { LeaderBottomNav } from '@/components/navigation/LeaderBottomNav'
import { DesktopSidebar } from '@/components/navigation/DesktopSidebar'
import { PostComposer } from '@/components/content/PostComposer'

export default function LeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <main className="md:ml-56">
        <div className="has-bottom-nav md:pb-0 max-w-[700px]">
          {children}
        </div>
      </main>
      <div className="md:hidden">
        <LeaderBottomNav />
      </div>
      <PostComposer />
    </div>
  )
}
