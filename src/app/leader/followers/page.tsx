'use client'
import { motion } from 'framer-motion'
import { Users, MagnifyingGlass } from '@phosphor-icons/react'
import { useAppStore } from '@/stores/appStore'
import { useFollowers } from '@/queries'
import { Avatar } from '@/components/common/Avatar'
import { EmptyState } from '@/components/common/EmptyState'
import { Skeleton } from '@/components/common/Skeleton'
import { formatRelativeTime } from '@/lib/formatting'
import { MOCK_TENANTS } from '@/data/mock/leaders'

export default function FollowersPage() {
  const { activeTenantId } = useAppStore()
  const { data: followers, isLoading } = useFollowers(activeTenantId)
  const tenant = MOCK_TENANTS.find(t => t.id === activeTenantId)

  return (
    <div className="max-w-2xl mx-auto">
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <Users size={20} className="text-primary" weight="fill" />
          <div className="flex-1">
            <h1 className="text-xl font-bold">Followers</h1>
            {tenant && <p className="text-xs text-muted-foreground">{tenant.followerCount.toLocaleString()} total</p>}
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="relative">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="search" placeholder="Search followers…" className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
      </header>

      <div className="px-4 py-4">
        {isLoading ? (
          <div className="space-y-3">{[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-1"><Skeleton className="h-4 w-36" /><Skeleton className="h-3 w-24" /></div>
            </div>
          ))}</div>
        ) : !followers?.length ? (
          <EmptyState icon={<Users size={48} />} title="Your first followers will appear here" description="Share your Mission and invite people to follow your journey." />
        ) : (
          <div className="space-y-1">
            {followers.map((follower, i) => {
              const rel = follower.leaderRelationships.find(r => r.tenantId === activeTenantId)
              return (
                <motion.div
                  key={follower.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                >
                  <Avatar src={follower.avatarUrl} name={follower.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{follower.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{follower.occupation ?? follower.location ?? ''}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {rel?.activityCount ? (
                      <p className="text-xs text-primary font-medium">{rel.activityCount} interactions</p>
                    ) : null}
                    {rel?.lastActiveAt && (
                      <p className="text-[10px] text-muted-foreground">{formatRelativeTime(rel.lastActiveAt)}</p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
