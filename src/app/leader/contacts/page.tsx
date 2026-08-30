'use client'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlass, Funnel, AddressBook, Plus } from '@phosphor-icons/react'
import { useAppStore } from '@/stores/appStore'
import { useUIStore } from '@/stores/uiStore'
import { useContacts } from '@/queries'
import { ContactCard } from '@/components/contacts/ContactCard'
import { ContactCardSkeleton } from '@/components/common/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { CONTACT_CATEGORY_LABELS, type ContactCategory } from '@/types/contact'
import type { PrivacyLevel } from '@/types/common'

export default function ContactsPage() {
  const { activeTenantId, userRole } = useAppStore()
  const { contactSearchQuery, contactCategoryFilter, setContactSearch, setContactCategoryFilter } = useUIStore()
  const { data: contacts, isLoading } = useContacts(activeTenantId, userRole)

  const filtered = useMemo(() => {
    if (!contacts) return []
    return contacts.filter(c => {
      const q = contactSearchQuery.toLowerCase()
      if (q && !c.name.toLowerCase().includes(q) && !c.organization?.toLowerCase().includes(q) && !c.title?.toLowerCase().includes(q)) return false
      if (contactCategoryFilter && !c.categories.includes(contactCategoryFilter as ContactCategory)) return false
      return true
    })
  }, [contacts, contactSearchQuery, contactCategoryFilter])

  const categories = useMemo(() => {
    if (!contacts) return []
    const catSet = new Set<ContactCategory>()
    contacts.forEach(c => c.categories.forEach(cat => catSet.add(cat)))
    return Array.from(catSet)
  }, [contacts])

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <h1 className="text-xl font-bold text-foreground flex-1">Contacts</h1>
          <button className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus size={16} weight="bold" />
            Add
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search contacts…"
              value={contactSearchQuery}
              onChange={e => setContactSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none">
          <button
            onClick={() => setContactCategoryFilter(null)}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${!contactCategoryFilter ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setContactCategoryFilter(contactCategoryFilter === cat ? null : cat)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${contactCategoryFilter === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              {CONTACT_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 py-4">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => <ContactCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<AddressBook size={48} />}
            title="No contacts found"
            description={contactSearchQuery ? 'Try a different search term.' : 'Your relationship network starts here.'}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <p className="text-xs text-muted-foreground mb-3">{filtered.length} contact{filtered.length !== 1 ? 's' : ''}</p>
            {filtered.map((contact, i) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <ContactCard contact={contact} compact />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
