'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, FileText, Clock, CheckCircle, BookOpen, ChevronRight, Filter, SortAsc } from 'lucide-react'

const mockPapers = [
  { id: 1, title: 'Attention Is All You Need', authors: 'Vaswani et al.', year: 2017, status: 'reading', progress: 80, lastRead: '2小时前', folder: 'Transformer' },
  { id: 2, title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.', year: 2018, status: 'completed', progress: 100, lastRead: '昨天', folder: 'Transformer' },
  { id: 3, title: 'GPT-4 Technical Report', authors: 'OpenAI', year: 2023, status: 'unread', progress: 0, lastRead: null, folder: 'LLM' },
  { id: 4, title: 'LoRA: Low-Rank Adaptation', authors: 'Hu et al.', year: 2021, status: 'reading', progress: 45, lastRead: '3天前', folder: 'Fine-tuning' },
  { id: 5, title: 'Vision Transformer', authors: 'Dosovitskiy et al.', year: 2020, status: 'completed', progress: 100, lastRead: '1周前', folder: 'Vision' },
]

const statusConfig = {
  reading: { label: '阅读中', color: 'text-blue-600', bg: 'bg-blue-100', icon: BookOpen },
  completed: { label: '已完成', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle },
  unread: { label: '未读', color: 'text-gray-500', bg: 'bg-gray-100', icon: Clock },
}

export default function ReadingListPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredPapers = mockPapers.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-6 py-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">阅读列表</h1>
          
          {/* 搜索 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索论文..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* 状态筛选 */}
        <div className="px-6 pb-4">
          <div className="flex gap-2">
            {[
              { value: 'all', label: '全部' },
              { value: 'reading', label: '阅读中' },
              { value: 'completed', label: '已完成' },
              { value: 'unread', label: '未读' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                  statusFilter === opt.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 论文列表 */}
      <div className="px-6 py-6">
        {filteredPapers.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">暂无论文</p>
            <Link href="/bookshelf/upload" className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-sm">
              上传论文
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPapers.map(paper => {
              const status = statusConfig[paper.status as keyof typeof statusConfig]
              const StatusIcon = status.icon
              return (
                <Link
                  key={paper.id}
                  href={`/reading/${paper.id}`}
                  className="block bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-medium text-gray-900">{paper.title}</h3>
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs shrink-0 ${status.bg} ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{paper.authors} · {paper.year}</p>
                      
                      {paper.progress > 0 && paper.progress < 100 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>阅读进度</span>
                            <span>{paper.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${paper.progress}%` }} />
                          </div>
                        </div>
                      )}
                      
                      {paper.lastRead && (
                        <p className="text-xs text-gray-400 mt-2">上次阅读: {paper.lastRead}</p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 shrink-0 mt-4" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}