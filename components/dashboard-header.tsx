'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

interface DashboardHeaderProps {
  userName?: string
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="border-b-2 border-black bg-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">HomeScore</h1>
          <p className="text-sm text-gray-600">Dashboard</p>
        </div>
        <div className="flex items-center space-x-6">
          {userName && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Selamat datang</p>
              <p className="font-bold text-black">{userName}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="px-4 py-2 border-2 border-black text-black font-bold hover:bg-black hover:text-white disabled:opacity-50"
          >
            {isLoading ? 'Keluar...' : 'Keluar'}
          </button>
        </div>
      </div>
    </header>
  )
}
