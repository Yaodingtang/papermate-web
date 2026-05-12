'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Send, FileText, Calendar, Building, ExternalLink, Trash2, Star, Bell, Filter, TrendingUp, Clock, AlertCircle, Bookmark, Globe, BookOpen, Award, Target, MoreHorizontal, Edit3 } from 'lucide-react'

const mockJournals = [
  { id: 1, name: 'Nature Machine Intelligence', type: '期刊', field: '人工智能', impactFactor: 23.8, deadline: '2024-06-15', status: 'interested', acceptanceRate: '12%', reviewTime: '3-6个月' },
  { id: 2, name: 'ACL 2024', type: '会议', field: '自然语言处理', impactFactor: null, deadline: '2024-05-20', status: 'targeting', acceptanceRate: '23%', reviewTime: '2-3个月' },
  { id: 3, name: 'EMNLP 2024', type: '会议', field: '自然语言处理', impactFactor: null, deadline: '2024-06-30', status: 'interested', acceptanceRate: '25%', reviewTime: '2-3个月' },
  { id: 4, name: 'IEEE TPAMI', type: '期刊', field: '计算机视觉', impactFactor: 24.3, deadline: null, status: 'watching', acceptanceRate: '18%', reviewTime: '4-8个月' },
]

const statusConfig = {
  interested: { label: '感兴趣', color: 'bg-gray-100 text-gray-700' },
  targeting: { label: '目标期刊', color: 'bg-blue-100 text-blue-700' },
  watching: { label: '关注中', color: 'bg-amber-100 text-amber-700' },
  submitted: { label: '已投稿', color: 'bg-green-100 text-green-700' },
}

export default function SubmitPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredJournals = mockJournals.filter(j => {
    const matchSearch = j.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'all' || j.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">投稿管理</h1>
              <p className="text-sm text-gray-500 mt-1">期刊推荐、截稿日追踪</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl">
              <Plus className="w-4 h-4" />
              添加期刊
            </button>
          </div>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索期刊..."
              className="w-full pl-10 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
            />
          </div>

          <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
            {[
              { value: 'all', label: '全部' },
              { value: 'targeting', label: '目标' },
              { value: 'interested', label: '感兴趣' },
              { value: 'submitted', label: '已投稿' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-2 text-sm transition-colors ${
                  statusFilter === opt.value ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 期刊列表 */}
      <div className="px-6 py-4">
        <div className="space-y-4">
          {filteredJournals.map(journal => {
            const status = statusConfig[journal.status as keyof typeof statusConfig]
            return (
              <div key={journal.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-medium text-gray-900">{journal.name}</h3>
                      <span className={`px-2 py-1 rounded-lg text-xs ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{journal.type}</span>
                      <span>·</span>
                      <span>{journal.field}</span>
                      {journal.impactFactor && (
                        <>
                          <span>·</span>
                          <span>IF: {journal.impactFactor}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>录用率: {journal.acceptanceRate}</span>
                      <span>审稿: {journal.reviewTime}</span>
                      {journal.deadline && (
                        <span className="flex items-center gap-1 text-amber-600">
                          <Clock className="w-3 h-3" />
                          截稿: {journal.deadline}
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-xl">
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}