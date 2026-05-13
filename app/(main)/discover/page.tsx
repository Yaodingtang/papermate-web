'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, FileText, ChevronRight, Clock, Users, TrendingUp, SlidersHorizontal, Loader2, BookOpen } from 'lucide-react'
import { aiApi } from '@/lib/api'

interface Paper {
  id: string
  title: string
  authors: string
  year: number
  venue: string
  citations: number
  abstract: string
  doi?: string
}

const categories = ['全部', 'NLP', 'CV', 'ML', 'RL', 'KG']

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 搜索论文
  const searchPapers = async (query: string) => {
    if (!query.trim()) {
      // 显示默认推荐论文
      setPapers([
        { id: '1', title: 'Attention Is All You Need', authors: 'Vaswani et al.', year: 2017, venue: 'NeurIPS', citations: 89000, abstract: '我们提出了一种新的简单网络架构——Transformer，完全基于注意力机制...' },
        { id: '2', title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.', year: 2018, venue: 'NAACL', citations: 75000, abstract: '我们引入了一种新的语言表示模型BERT...' },
        { id: '3', title: 'GPT-4 Technical Report', authors: 'OpenAI', year: 2023, venue: 'arXiv', citations: 4500, abstract: '我们报告了GPT-4的开发...' },
        { id: '4', title: 'LoRA: Low-Rank Adaptation', authors: 'Hu et al.', year: 2021, venue: 'ICLR', citations: 12000, abstract: '我们提出了低秩自适应方法...' },
      ])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await aiApi.search({ query, limit: 20 })
      setPapers(response.data.papers || response.data.results || [])
    } catch (err: any) {
      console.error('Search error:', err)
      setError('搜索失败，请稍后重试')
      // 使用本地模拟数据
      setPapers([
        { id: 'local_1', title: `关于"${query}"的相关论文`, authors: 'Various', year: 2023, venue: 'arXiv', citations: 1000, abstract: `这是一篇关于${query}的研究论文...` },
      ])
    } finally {
      setLoading(false)
    }
  }

  // 延迟搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      searchPapers(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-6 py-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">发现论文</h1>

          {/* 搜索 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索论文、关键词、作者..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 分类标签 */}
      <div className="px-6 py-4 overflow-x-auto bg-white border-b border-gray-100">
        <div className="flex gap-2 min-w-max">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 论文列表 */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">共 {papers.length} 篇</span>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
            <SlidersHorizontal className="w-4 h-4" />
            筛选
          </button>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-sm text-gray-500">搜索中...</span>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-sm">{error}</p>
            <button onClick={() => searchPapers(searchQuery)} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm">
              重试
            </button>
          </div>
        )}

        {/* 空状态 */}
        {!loading && !error && papers.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">暂无搜索结果</p>
            <p className="text-gray-400 text-xs mt-1">请尝试其他关键词</p>
          </div>
        )}

        {/* 论文列表 */}
        {!loading && !error && papers.length > 0 && (
          <div className="space-y-4">
            {papers.map(paper => (
              <Link
                key={paper.id}
                href={`/reading/${paper.id}`}
                className="block bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors"
              >
                <h3 className="text-base font-medium text-gray-900 mb-2">{paper.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{paper.authors} · {paper.year} · {paper.venue}</p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{paper.abstract}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {paper.citations?.toLocaleString() || '-'} 引用
                  </span>
                  {paper.doi && (
                    <span className="flex items-center gap-1 text-xs text-blue-600">
                      DOI: {paper.doi}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}