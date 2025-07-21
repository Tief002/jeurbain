'use client'

import { useAuth } from '@/hooks/useAuth'
import { Home, Gamepad2, Trophy, Gift, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function BottomNav() {
  const { user } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const navItems = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/games', label: 'Jeux', icon: Gamepad2 },
    { href: '/leaderboard', label: 'Classement', icon: Trophy },
    { href: '/rewards', label: 'Boutique', icon: Gift },
    { href: '/profile', label: 'Profil', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 sm:hidden">
      <div className="grid grid-cols-5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}