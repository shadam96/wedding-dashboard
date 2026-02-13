'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'דשבורד', icon: HomeIcon },
  { href: '/guests', label: 'מוזמנים', icon: UserGroupIcon },
  { href: '/tasks', label: 'משימות', icon: ClipboardDocumentListIcon },
  { href: '/budget', label: 'תקציב', icon: BanknotesIcon },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const navContent = (
    <>
      <div className="flex items-center gap-3 px-4 py-6 border-b border-rose-700/30">
        <div className="w-10 h-10 rounded-full bg-rose-400/20 flex items-center justify-center">
          <HeartIcon className="w-5 h-5 text-rose-200" />
        </div>
        <div>
          <h2 className="font-bold text-white text-lg leading-tight">החתונה שלנו</h2>
          <p className="text-rose-300 text-xs">דשבורד ניהול</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-rose-400/20 text-white'
                  : 'text-rose-200 hover:bg-rose-400/10 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-rose-800 h-14 flex items-center px-4 shadow-md">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-white p-1.5 hover:bg-rose-700 rounded-lg transition"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <span className="font-bold text-white me-3">החתונה שלנו</span>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute inset-y-0 right-0 w-64 bg-rose-800 shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 left-4 text-rose-200 hover:text-white"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 lg:right-0 bg-rose-800 shadow-xl z-30">
        {navContent}
      </aside>
    </>
  )
}
