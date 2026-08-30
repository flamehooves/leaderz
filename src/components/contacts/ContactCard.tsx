'use client'
import Link from 'next/link'
import { Phone, EnvelopeSimple, Lightning, Cake } from '@phosphor-icons/react'
import type { Contact } from '@/types/contact'
import { Avatar } from '@/components/common/Avatar'
import { PrivacyBadge } from '@/components/common/PrivacyBadge'
import { CONTACT_CATEGORY_LABELS } from '@/types/contact'
import { formatRelativeTime } from '@/lib/formatting'
import { cn } from '@/lib/utils'

interface Props {
  contact: Contact
  compact?: boolean
}

export function ContactCard({ contact, compact = false }: Props) {
  const hasCake = contact.importantDates.some(d => d.type === 'birthday')
  const hasFollowUp = !!contact.nextFollowUpDate

  if (compact) {
    return (
      <Link
        href={`/leader/contacts/${contact.id}`}
        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
        aria-label={`Open ${contact.name}`}
      >
        <Avatar src={contact.avatarUrl} name={contact.name} size="md" verified={contact.isPersonallyVerified} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{contact.name}</p>
          {contact.title && <p className="text-xs text-muted-foreground truncate">{contact.title}{contact.organization ? ` · ${contact.organization}` : ''}</p>}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {hasFollowUp && <Lightning size={14} className="text-amber-500" weight="fill" aria-label="Follow-up pending" />}
          {hasCake && <Cake size={14} className="text-rose-400" weight="fill" aria-label="Cake" />}
          <PrivacyBadge level={contact.privacyLevel} compact />
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/leader/contacts/${contact.id}`}
      className="flex items-start gap-3 p-4 rounded-2xl border bg-card hover:shadow-md transition-all card-hover"
      aria-label={`Open ${contact.name}`}
    >
      <Avatar src={contact.avatarUrl} name={contact.name} size="lg" verified={contact.isPersonallyVerified} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="text-sm font-semibold text-foreground">{contact.name}</p>
            {contact.title && <p className="text-xs text-muted-foreground truncate">{contact.title}</p>}
            {contact.organization && <p className="text-xs text-muted-foreground truncate">{contact.organization}</p>}
          </div>
          <PrivacyBadge level={contact.privacyLevel} />
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {contact.categories.slice(0, 2).map(cat => (
            <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
              {CONTACT_CATEGORY_LABELS[cat]}
            </span>
          ))}
          {contact.categories.length > 2 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">+{contact.categories.length - 2}</span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {contact.lastInteractionDate && (
            <span>Last: {formatRelativeTime(contact.lastInteractionDate)}</span>
          )}
          <div className="flex items-center gap-1.5 ml-auto">
            {hasFollowUp && <Lightning size={13} className="text-amber-500" weight="fill" />}
            {hasCake && <Cake size={13} className="text-rose-400" weight="fill" />}
            {contact.phone && <Phone size={13} />}
            {contact.email && <EnvelopeSimple size={13} />}
          </div>
        </div>
      </div>
    </Link>
  )
}
