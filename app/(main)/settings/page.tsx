'use client'

import { useState } from 'react'
import { User, Bell, Shield, Palette, Database, HelpCircle, ChevronRight, Sun, Moon, Leaf, Monitor, Check } from 'lucide-react'
import ThemeSwitcher from '@/components/theme-switcher'

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: '测试用户',
    email: 'test@example.com',
    avatar: null,
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
  })

  const settingsGroups = [
    {
      title: '账号设置',
      items: [
        { icon: User, label: '个人资料', desc: '修改头像、昵称等信息', href: '#profile' },
        { icon: Shield, label: '安全设置', desc: '密码、两步验证', href: '#security' },
      ]
    },
    {
      title: '偏好设置',
      items: [
        { icon: Bell, label: '通知设置', desc: '邮件、推送通知', href: '#notifications' },
        { icon: Palette, label: '外观主题', desc: '深色模式、护眼模式', href: '#theme' },
      ]
    },
    {
      title: '数据管理',
      items: [
        { icon: Database, label: '存储空间', desc: '已用 2.3GB / 10GB', href: '#storage' },
      ]
    },
    {
      title: '帮助',
      items: [
        { icon: HelpCircle, label: '帮助中心', desc: '使用指南、常见问题', href: '#help' },
      ]
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 theme-light">
      {/* 头部 */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900">设置</h1>
        </div>
      </div>

      {/* 内容 */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* 用户卡片 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">{profile.name}</h2>
              <p className="text-gray-500">{profile.email}</p>
            </div>
            <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              编辑资料
            </button>
          </div>
        </div>

        {/* 主题设置 - 突出显示 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">外观主题</h3>
              <p className="text-sm text-gray-500">选择适合你的阅读模式</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <button className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-2 border-transparent hover:border-blue-200 transition-all group">
              <Sun className="w-6 h-6 text-amber-500" />
              <span className="text-sm font-medium text-gray-900">浅色</span>
              <span className="text-xs text-gray-500">默认模式</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-2 border-transparent hover:border-blue-200 transition-all group">
              <Moon className="w-6 h-6 text-indigo-500" />
              <span className="text-sm font-medium text-gray-900">深色</span>
              <span className="text-xs text-gray-500">夜间阅读</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl border-2 border-green-300 transition-all group relative">
              <Leaf className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-green-900">护眼</span>
              <span className="text-xs text-green-600">柔和绿色</span>
              <Check className="absolute top-2 right-2 w-4 h-4 text-green-600" />
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-2 border-transparent hover:border-blue-200 transition-all group">
              <Monitor className="w-6 h-6 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">自动</span>
              <span className="text-xs text-gray-500">跟随系统</span>
            </button>
          </div>

          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <p className="text-sm text-green-800">
              💡 <strong>护眼模式</strong>采用柔和的绿色调，减少蓝光辐射，适合长时间阅读。建议在阅读论文时开启。
            </p>
          </div>
        </div>

        {/* 设置分组 */}
        {settingsGroups.map((group) => (
          <div key={group.title} className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3 px-1">{group.title}</h3>
            <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
              {group.items.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* 版本信息 */}
        <div className="text-center text-sm text-gray-400 mt-8">
          PaperMate v1.0.0
        </div>
      </div>
    </div>
  )
}