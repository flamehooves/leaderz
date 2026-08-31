'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  House, FilmStrip, AddressBook, User, Target, CalendarBlank,
  Briefcase, Star, Bell, Gear, Users, PencilSimple
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useNotifications } from '@/queries'
import { useAppStore } from '@/stores/appStore'
import { useLeader } from '@/queries'
import { Avatar } from '@/components/common/Avatar'
import { useUIStore } from '@/stores/uiStore'

const NAV_ITEMS: { href: string; icon: React.ElementType; label: string; badge?: boolean }[] = [
  { href: '/leader/home', icon: House, label: 'Home' },
  { href: '/leader/notifications', icon: Bell, label: 'Notifications', badge: true },
  { href: '/leader/followers', icon: Users, label: 'Followers' },
  { href: '/leader/contacts', icon: AddressBook, label: 'Contacts' },
  { href: '/leader/reels', icon: FilmStrip, label: 'Reels' },
  { href: '/leader/mission', icon: Target, label: 'Mission' },
  { href: '/leader/events', icon: CalendarBlank, label: 'Events' },
  { href: '/leader/projects', icon: Briefcase, label: 'Projects' },
  { href: '/leader/opportunities', icon: Star, label: 'Opportunities' },
  { href: '/leader/profile', icon: User, label: 'Profile' },
]

export function DesktopSidebar() {
  const pathname = usePathname()
  const { activeTenantId } = useAppStore()
  const { data: notifications } = useNotifications(activeTenantId)
  const { data: leader } = useLeader(activeTenantId)
  const { setPostComposerOpen } = useUIStore()
  const unread = notifications?.filter(n => !n.read).length ?? 0

  return (
    <aside className="hidden md:flex flex-col w-56 h-screen fixed left-0 top-0 z-30 py-3 pr-3">
      {/* Logo */}
      <div className="px-3 py-2 mb-1">
        <span className="text-xl font-black tracking-tight text-foreground">LeaderZ</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-0.5" aria-label="Main navigation">
        {NAV_ITEMS.map(({ href, icon: Icon, label, badge }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-full text-[15px] transition-colors group',
                isActive
                  ? 'font-bold text-foreground'
                  : 'font-normal text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
              )}
            >
              <Icon size={22} weight={isActive ? 'fill' : 'regular'} />
              <span>{label}</span>
              {badge && unread > 0 && (
                <span className="ml-auto bg-foreground text-background text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Post button */}
      <button
        onClick={() => setPostComposerOpen(true)}
        className="mx-3 mt-2 mb-3 flex items-center justify-center gap-2 py-3 rounded-full bg-foreground text-background text-sm font-bold hover:bg-foreground/85 transition-colors"
      >
        <PencilSimple size={16} weight="bold" />
        Post
      </button>

      {/* Settings + Profile */}
      <div className="border-t border-border/50 pt-3 space-y-0.5">
        <Link href="/leader/settings" className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-full text-[15px] transition-colors',
          pathname.startsWith('/leader/settings') ? 'font-bold text-foreground' : 'font-normal text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
        )}>
          <Gear size={22} weight={pathname.startsWith('/leader/settings') ? 'fill' : 'regular'} />
          Settings
        </Link>

        {leader && (
          <Link href="/leader/profile" className="flex items-center gap-2.5 px-3 py-2.5 rounded-full hover:bg-foreground/5 transition-colors">
            <Avatar src={leader.avatarUrl} name={leader.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{leader.name.split(' ')[0]}</p>
              <p className="text-[11px] text-foreground/50 truncate">@{leader.tenantId?.replace('tenant-', '')}</p>
            </div>
          </Link>
        )}
      </div>
    </aside>
  )
}
