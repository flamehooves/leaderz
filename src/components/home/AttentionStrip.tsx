'use client'
import { motion } from 'framer-motion'
import { Cake, ArrowRight, Bell, Lightning } from '@phosphor-icons/react'
import { useAppStore } from '@/stores/appStore'
import { useUpcomingBirthdays, useFollowUps, useAISuggestions } from '@/queries'
import { Avatar } from '@/components/common/Avatar'
import { formatShortDate } from '@/lib/formatting'
import Link from 'next/link'

export function AttentionStrip() {
  const { activeTenantId, userRole } = useAppStore()
  const { data: birthdays } = useUpcomingBirthdays(activeTenantId, userRole)
  const { data: followUps } = useFollowUps(activeTenantId, userRole)
  const { data: aiSuggestions } = useAISuggestions(activeTenantId)

  const highPriority = aiSuggestions?.filter(s => s.priority === 'high' && !s.dismissed) ?? []

  const cards = [
    ...(birthdays?.slice(0, 2).map(c => ({
      id: `bday-${c.id}`,
      icon: <Cake size={16} className="text-rose-500" />,
      title: c.name,
      subtitle: `Birthday ${formatShortDate(c.importantDates[0]?.date ?? '')}`,
      href: `/leader/contacts/${c.id}`,
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
    })) ?? []),
    ...(followUps?.slice(0, 2).map(c => ({
      id: `fu-${c.id}`,
      icon: <Lightning size={16} className="text-amber-500" />,
      title: c.name,
      subtitle: c.nextFollowUpNote ?? 'Follow up needed',
      href: `/leader/contacts/${c.id}`,
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    })) ?? []),
    ...(highPriority.slice(0, 2).map(s => ({
      id: s.id,
      icon: <Bell size={16} className="text-primary" />,
      title: s.title,
      subtitle: s.body.slice(0, 60) + '…',
      href: s.targetType === 'contact' ? `/leader/contacts/${s.targetId}` : '/leader/home',
      bg: 'bg-primary/5 border-primary/20',
    }))),
  ]

  if (cards.length === 0) return null

  return (
    <section aria-label="Attention items">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Needs attention</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="snap-start shrink-0"
          >
            <Link
              href={card.href}
              className={`flex items-start gap-3 p-3 rounded-2xl border min-w-[220px] max-w-[260px] hover:shadow-md transition-all card-hover ${card.bg}`}
            >
              <span className="mt-0.5">{card.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{card.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-tight mt-0.5">{card.subtitle}</p>
              </div>
              <ArrowRight size={14} className="text-muted-foreground shrink-0 mt-0.5" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
