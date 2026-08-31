import { LeaderBottomNav } from '@/components/navigation/LeaderBottomNav'
import { DesktopSidebar } from '@/components/navigation/DesktopSidebar'
import { PostComposer } from '@/components/content/PostComposer'

export default function LeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar + content centered together as one unit, like X */}
      <div className="flex w-full max-w-[960px] mx-auto">
        <DesktopSidebar />
        <main className="flex-1 min-w-0">
          <div className="has-bottom-nav md:pb-0">
            {children}
          </div>
        </main>
      </div>
      <div className="md:hidden">
        <LeaderBottomNav />
      </div>
      <PostComposer />
    </div>
  )
}
