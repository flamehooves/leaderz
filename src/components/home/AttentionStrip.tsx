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
      bg: 'bg-gradient-to-br from-pink-50 to-rose-100 border-rose-200/80',
    })) ?? []),
    ...(followUps?.slice(0, 2).map(c => ({
      id: `fu-${c.id}`,
      icon: <Lightning size={16} className="text-amber-500" />,
      title: c.name,
      subtitle: c.nextFollowUpNote ?? 'Follow up needed',
      href: `/leader/contacts/${c.id}`,
      bg: 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200/80',
    })) ?? []),
    ...(highPriority.slice(0, 2).map(s => ({
      id: s.id,
      icon: <Bell size={16} className="text-violet-500" />,
      title: s.title,
      subtitle: s.body.slice(0, 60) + '…',
      href: s.targetType === 'contact' ? `/leader/contacts/${s.targetId}` : '/leader/home',
      bg: 'bg-gradient-to-br from-violet-50 to-indigo-100 border-violet-200/80',
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
              className={`flex items-center gap-2.5 px-3 rounded-2xl border w-[220px] h-[68px] hover:shadow-sm transition-all card-hover ${card.bg}`}
            >
              <span className="shrink-0">{card.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{card.title}</p>
                <p className="text-xs text-muted-foreground truncate leading-tight mt-0.5">{card.subtitle}</p>
              </div>
              <ArrowRight size={13} className="text-muted-foreground shrink-0" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
