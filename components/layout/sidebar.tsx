'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Compass, BookOpen, FileText, Layers, FlaskConical, Send, Users, PenTool, 
  Settings, Sparkles, BarChart3, GitCompare, MessageSquare, Download, Bell,
  Menu, X, Search, User
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: BarChart3, label: '统计', mobile: true },
  { href: '/daily', icon: Bell, label: '推送', mobile: true },
  { href: '/discover', icon: Compass, label: '发现', mobile: true },
  { href: '/bookshelf', icon: BookOpen, label: '书架', mobile: true },
  { href: '/reading', icon: FileText, label: '阅读', mobile: false },
  { href: '/graph', icon: GitCompare, label: '图谱', mobile: false },
  { href: '/write', icon: PenTool, label: '写作', mobile: false },
  { href: '/review/generate', icon: Sparkles, label: '综述', mobile: false },
  { href: '/compare', icon: GitCompare, label: '对比', mobile: false },
  { href: '/cards', icon: Layers, label: '卡片', mobile: true },
  { href: '/annotations', icon: MessageSquare, label: '批注', mobile: false },
  { href: '/downloads', icon: Download, label: '下载', mobile: false },
  { href: '/experiment', icon: FlaskConical, label: '实验', mobile: false },
  { href: '/track', icon: Send, label: '投稿', mobile: false },
  { href: '/team', icon: Users, label: '团队', mobile: false },
  { href: '/submit', icon: Send, label: '期刊', mobile: false },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const mobileNavItems = navItems.filter(item => item.mobile)

  return (
    <>
      {/* 桌面端侧边栏 */}
      <aside 
        className={cn(
          "hidden md:flex flex-col bg-white border-r border-gray-200 h-screen sticky top-0",
          collapsed ? "w-16" : "w-56"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-bold text-gray-900 text-sm">PaperMate</h1>
                <p className="text-xs text-gray-400">论文管理</p>
              </div>
            )}
          </Link>
        </div>

        {/* 导航 */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive 
                    ? "bg-blue-50 text-blue-600 font-medium" 
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* 底部 */}
        <div className="p-2 border-t border-gray-100 space-y-0.5">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === '/settings' ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <Settings className="w-4 h-4" />
            {!collapsed && <span>设置</span>}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            <Menu className="w-4 h-4" />
            {!collapsed && <span>收起</span>}
          </button>
        </div>
      </aside>

      {/* 移动端侧边栏抽屉 */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="font-bold text-gray-900">PaperMate</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <nav className="p-2 space-y-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm",
                      isActive 
                        ? "bg-blue-50 text-blue-600 font-medium" 
                        : "text-gray-600"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <div className="border-t border-gray-100 my-2" />
              <Link
                href="/settings"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-600"
              >
                <Settings className="w-4 h-4" />
                <span>设置</span>
              </Link>
            </nav>
          </aside>
        </div>
      )}

      {/* 移动端底部导航 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around py-2">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1",
                  isActive ? "text-blue-600" : "text-gray-500"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            )
          })}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-500"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs">更多</span>
          </button>
        </div>
      </nav>
    </>
  )
}