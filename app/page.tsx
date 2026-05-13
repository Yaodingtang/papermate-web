'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, BookOpen, FileText, BarChart3, ChevronRight, Plus, Clock, TrendingUp, Loader2, Sparkles } from 'lucide-react'
import { api } from '@/lib/api'

interface Paper {
  id: string
  title: string
  authors: string
  year: number
  venue: string
  abstract?: string
  reason?: string
  relevance?: number
  citation_count?: number
  source?: string
  doi?: string
}

export default function HomePage() {
  const [recommendations, setRecommendations] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)

  // 加载推荐论文
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const response = await api.get('/daily/recommendations')
        const data = response.data
        if (data.papers && data.papers.length > 0) {
          setRecommendations(data.papers.slice(0, 5))
        }
      } catch (err) {
        console.error('Load recommendations error:', err)
        // 使用备用数据
        setRecommendations([
          { id: '1', title: 'Attention Is All You Need', authors: 'Vaswani et al.', year: 2017, venue: 'NeurIPS', reason: '经典论文', citation_count: 89000 },
          { id: '2', title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.', year: 2018, venue: 'NAACL', reason: '高引用论文', citation_count: 75000 },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [])

  // 模拟最近阅读数据（实际应从数据库获取）
  const recentPapers = [
    { id: '1', title: 'Attention Is All You Need', progress: 80, time: '2小时前' },
    { id: '2', title: 'BERT: Pre-training of Deep Bidirectional...', progress: 45, time: '昨天' },
    { id: '3', title: 'GPT-4 Technical Report', progress: 20, time: '3天前' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">你好，欢迎回来</h1>
            <p className="text-sm text-gray-500 mt-0.5">今天想读点什么？</p>
          </div>
          <Link href="/settings" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">我</span>
          </Link>
        </div>

        {/* 搜索框 */}
        <Link href="/discover">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <div className="w-full pl-10 pr-3 py-2.5 bg-gray-100 border-0 rounded-xl text-sm text-gray-400">
              搜索论文、关键词、作者...
            </div>
          </div>
        </Link>
      </div>

      {/* 快捷入口 */}
      <div className="px-4 py-4">
        <div className="flex gap-3 overflow-x-auto pb-1">
          <Link href="/discover" className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-100 shrink-0">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm text-gray-700">发现</span>
          </Link>
          <Link href="/bookshelf" className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-100 shrink-0">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm text-gray-700">书架</span>
          </Link>
          <Link href="/cards" className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-100 shrink-0">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm text-gray-700">卡片</span>
          </Link>
          <Link href="/daily" className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-100 shrink-0">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-sm text-gray-700">推送</span>
          </Link>
        </div>
      </div>

      {/* 继续阅读 */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">继续阅读</h2>
          <Link href="/bookshelf" className="text-sm text-blue-600">查看全部</Link>
        </div>
        <div className="space-y-2">
          {recentPapers.map(paper => (
            <Link
              key={paper.id}
              href={`/reading/${paper.id}`}
              className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3"
            >
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{paper.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${paper.progress}%` }} />
                  </div>
                  <span className="text-xs text-gray-400">{paper.progress}%</span>
                </div>
              </div>
              <span className="text-xs text-gray-400 shrink-0">{paper.time}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 为你推荐 */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">为你推荐</h2>
          <Link href="/daily" className="text-sm text-blue-600">更多</Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="ml-2 text-sm text-gray-500">加载推荐...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {recommendations.map((paper, index) => (
              <Link
                key={paper.id || index}
                href={`/discover?query=${encodeURIComponent(paper.title)}`}
                className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{paper.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {paper.reason || `${paper.authors} · ${paper.year}`}
                    {paper.citation_count && paper.citation_count > 0 && (
                      <span className="text-blue-600 ml-1">· {paper.citation_count.toLocaleString()} 引用</span>
                    )}
                  </p>
                </div>
                {paper.source && (
                  <span className={`px-2 py-0.5 rounded text-xs shrink-0 ${
                    paper.source === 'arxiv' ? 'bg-orange-100 text-orange-600' :
                    paper.source === 'crossref' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {paper.source}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 快捷操作 */}
      <div className="px-4 py-4 pb-6">
        <div className="flex gap-3">
          <Link href="/bookshelf" className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium">
            <Plus className="w-4 h-4" />
            上传论文
          </Link>
          <Link href="/discover" className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium">
            发现更多
          </Link>
        </div>
      </div>

      {/* 数据来源说明 */}
      <div className="px-4 pb-6 text-center">
        <p className="text-xs text-gray-400">
          推荐数据来源: Crossref · arXiv
        </p>
      </div>
    </div>
  )
}