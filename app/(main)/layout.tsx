'use client'

import { ReactNode } from 'react'
import Sidebar from '@/components/layout/sidebar'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 桌面端侧边栏 */}
      <Sidebar />
      
      {/* 主内容区 */}
      <main className="flex-1 min-w-0">
        {/* 桌面端 */}
        <div className="hidden md:block">
          {children}
        </div>
        
        {/* 移动端：留出底部导航空间 */}
        <div className="md:hidden pb-16">
          {children}
        </div>
      </main>
    </div>
  )
}