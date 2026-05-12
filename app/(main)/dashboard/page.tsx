'use client'

import { useState } from 'react'
import { BookOpen, Clock, FileText, Star, TrendingUp, Target, Award, ChevronRight, BarChart3, Flame, CheckCircle } from 'lucide-react'

const mockStats = {
  totalPapers: 23,
  completedPapers: 15,
  readingPapers: 5,
  pendingPapers: 3,
  totalNotes: 47,
  totalCards: 28,
  totalHours: 36.5,
  streak: 7,
}

const weeklyData = [
  { day: '一', papers: 2, hours: 1.5 },
  { day: '二', papers: 3, hours: 2.0 },
  { day: '三', papers: 1, hours: 0.8 },
  { day: '四', papers: 4, hours: 2.5 },
  { day: '五', papers: 2, hours: 1.2 },
  { day: '六', papers: 3, hours: 2.0 },
  { day: '日', papers: 1, hours: 0.5 },
]

const goals = [
  { title: '本月阅读 10 篇论文', current: 8, target: 10, icon: BookOpen },
  { title: '创建 20 张知识卡片', current: 15, target: 20, icon: FileText },
]

const recentActivity = [
  { action: '完成阅读', paper: 'LoRA: Low-Rank Adaptation', time: '2小时前' },
  { action: '添加笔记', paper: 'BERT 论文', time: '5小时前' },
  { action: '开始阅读', paper: 'GPT-4 Technical Report', time: '1天前' },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <h1 className="text-lg font-semibold text-gray-900">阅读统计</h1>
        </div>
      </div>

      {/* 主要统计 - 大卡片 */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">本周阅读</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">16 篇</p>
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-blue-600" />
            </div>
          </div>
          
          {/* 进度条 */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-500">月度目标</span>
              <span className="text-gray-900 font-medium">16/20 篇</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>

          {/* 连续阅读 */}
          <div className="flex items-center gap-2 py-3 px-3 bg-amber-50 rounded-lg">
            <Flame className="w-5 h-5 text-amber-500" />
            <span className="text-sm text-amber-700">连续阅读 <strong>{mockStats.streak}</strong> 天</span>
          </div>
        </div>
      </div>

      {/* 详细数据 */}
      <div className="px-4 py-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">{mockStats.completedPapers}</p>
            <p className="text-xs text-gray-500 mt-1">已完成</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">{mockStats.totalHours}h</p>
            <p className="text-xs text-gray-500 mt-1">阅读时长</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">{mockStats.totalNotes}</p>
            <p className="text-xs text-gray-500 mt-1">笔记数</p>
          </div>
        </div>
      </div>

      {/* 周阅读趋势 */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">本周趋势</h3>
          <div className="flex items-end justify-between gap-1 h-28">
            {weeklyData.map((data, i) => {
              const maxPapers = Math.max(...weeklyData.map(d => d.papers))
              const height = (data.papers / maxPapers) * 100
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <span className="text-xs text-gray-900 font-medium mb-1">{data.papers}</span>
                  <div 
                    className="w-full bg-blue-500 rounded-sm"
                    style={{ height: `${Math.max(height, 8)}%` }}
                  />
                  <span className="text-xs text-gray-400 mt-2">{data.day}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 目标进度 */}
      <div className="px-4 py-2">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">阅读目标</h3>
            <button className="text-xs text-blue-600">编辑</button>
          </div>
          <div className="space-y-4">
            {goals.map((goal, i) => {
              const percent = Math.round((goal.current / goal.target) * 100)
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <goal.icon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{goal.title}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{percent}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${percent >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 最近活动 */}
      <div className="px-4 py-2 pb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">最近活动</h3>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{item.paper}</p>
                  <p className="text-xs text-gray-500">{item.action} · {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}