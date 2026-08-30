'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, FilmStrip, AddressBook, User, Target, CalendarBlank, Briefcase, Star, Bell, Gear } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { TenantSwitcher } from '@/components/common/TenantSwitcher'
import { useNotifications } from '@/queries'
import { useAppStore } from '@/stores/appStore'

const NAV_ITEMS: { href: string; icon: React.ElementType; label: string; badge?: boolean }[] = [
  { href: '/leader/home', icon: House, label: 'Home' },
  { href: '/leader/notifications', icon: Bell, label: 'Notifications', badge: true },
  { href: '/leader/reels', icon: FilmStrip, label: 'Reels' },
  { href: '/leader/contacts', icon: AddressBook, label: 'Contacts' },
  { href: '/leader/mission', icon: Target, label: 'Mission' },
  { href: '/leader/events', icon: CalendarBlank, label: 'Events' },
  { href: '/leader/projects', icon: Briefcase, label: 'Projects' },
  { href: '/leader/opportunities', icon: Star, label: 'Opportunities' },
  { href: '/leader/profile', icon: User, label: 'Profile' },
]

export function DesktopSidebar() {
  const pathname = usePathname()
  const activeTenantId = useAppStore(s => s.activeTenantId)
  const { data: notifications } = useNotifications(activeTenantId)
  const unread = notifications?.filter(n => !n.read).length ?? 0

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-card border-r z-30 py-6">
      <div className="px-4 mb-6">
        <TenantSwitcher />
      </div>

      <nav className="flex-1 px-3 space-y-0.5" aria-label="Desktop navigation">
        {NAV_ITEMS.map(({ href, icon: Icon, label, badge }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon size={18} weight={isActive ? 'fill' : 'regular'} />
              <span>{label}</span>
              {badge && unread > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 border-t pt-3 mt-3 space-y-0.5">
        <Link href="/leader/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Gear size={18} />
          Settings
        </Link>
      </div>
    </aside>
  )
}
