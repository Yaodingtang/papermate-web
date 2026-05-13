'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, TrendingUp, Loader2, BookOpen, AlertCircle, RefreshCw, ExternalLink, ChevronDown } from 'lucide-react'
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
  arxiv_id?: string
  source?: string
  url?: string
}

const categories = [
  { id: 'all', label: '全部' },
  { id: 'cs.AI', label: 'AI' },
  { id: 'cs.LG', label: '机器学习' },
  { id: 'cs.CL', label: 'NLP' },
  { id: 'cs.CV', label: '计算机视觉' },
  { id: 'cs.NE', label: '神经网络' },
  { id: 'cs.RO', label: '机器人' },
  { id: 'cs.CR', label: '安全' },
]

const popularKeywords = [
  'transformer', 'large language model', 'diffusion model',
  'reinforcement learning', 'graph neural network', 'vision transformer',
]

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [currentQuery, setCurrentQuery] = useState('')

  // 用于防抖的 ref
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadRef = useRef(false)

  // 搜索论文函数
  const searchPapers = async (query: string, pageNum: number = 1, append: boolean = false, category?: string) => {
    if (!query.trim()) return

    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
      setPapers([])
      setError(null)
    }

    const cat = category || selectedCategory

    try {
      const response = await aiApi.search({
        query,
        limit: 20,
        category: cat !== 'all' ? cat : undefined
      })

      const papersData = response.data.papers || []

      if (papersData.length > 0) {
        if (append) {
          setPapers(prev => [...prev, ...papersData])
        } else {
          setPapers(papersData)
        }
        setHasMore(papersData.length >= 20)
        setPage(pageNum)
        setCurrentQuery(query)
      } else {
        if (!append) {
          setPapers([])
          setError('未找到相关论文，请尝试其他关键词')
        }
        setHasMore(false)
      }
    } catch (err: any) {
      console.error('Search error:', err)
      if (!append) {
        setPapers([])
        setError(err.response?.status === 401 ? '请先登录' : '搜索失败，请稍后重试')
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // 加载热门论文
  const loadPopularPapers = async () => {
    setLoading(true)
    setError(null)

    try {
      const randomKeyword = popularKeywords[Math.floor(Math.random() * popularKeywords.length)]
      const response = await aiApi.search({ query: randomKeyword, limit: 20 })
      const papersData = response.data.papers || []

      if (papersData.length > 0) {
        setPapers(papersData)
        setCurrentQuery(randomKeyword)
        setHasMore(papersData.length >= 20)
      } else {
        setPapers([])
        setError('暂无数据，请尝试搜索')
      }
    } catch (err: any) {
      console.error('Load popular papers error:', err)
      setPapers([])
      setError('加载失败，请点击刷新重试')
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true
      loadPopularPapers()
    }
  }, [])

  // 分类切换时重新搜索
  useEffect(() => {
    // 只有在已经搜索过的情况下才触发
    if (currentQuery && initialLoadRef.current) {
      searchPapers(currentQuery, 1, false, selectedCategory)
    }
  }, [selectedCategory])

  // 搜索输入变化时防抖搜索
  useEffect(() => {
    if (!searchQuery.trim()) return

    // 清除之前的定时器
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current)
    }

    // 设置新的定时器
    searchTimerRef.current = setTimeout(() => {
      searchPapers(searchQuery, 1, false)
    }, 800)

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current)
      }
    }
  }, [searchQuery])

  // 加载更多
  const loadMore = () => {
    if (loadingMore || !hasMore || !currentQuery) return
    searchPapers(currentQuery, page + 1, true)
  }

  // 刷新
  const handleRefresh = () => {
    if (currentQuery) {
      searchPapers(currentQuery, 1, false)
    } else {
      loadPopularPapers()
    }
  }

  // 清除搜索
  const clearSearch = () => {
    setSearchQuery('')
    setPapers([])
    setPage(1)
    setHasMore(true)
    loadPopularPapers()
  }

  // 点击热门关键词
  const handleKeywordClick = (keyword: string) => {
    setSearchQuery(keyword)
    // 立即搜索，不等待防抖
    searchPapers(keyword, 1, false)
  }

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
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* 热门关键词 */}
          <div className="mt-4 flex flex-wrap gap-2">
            {popularKeywords.map(keyword => (
              <button
                key={keyword}
                onClick={() => handleKeywordClick(keyword)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 分类标签 */}
      <div className="px-6 py-4 overflow-x-auto bg-white border-b border-gray-100">
        <div className="flex gap-2 min-w-max">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 论文列表 */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            {currentQuery ? `搜索结果: ${papers.length} 篇` : `热门论文: ${papers.length} 篇`}
            {currentQuery && <span className="text-blue-600 ml-1">"{currentQuery}"</span>}
            {selectedCategory !== 'all' && (
              <span className="text-orange-600 ml-1">· {categories.find(c => c.id === selectedCategory)?.label}</span>
            )}
          </span>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </button>
        </div>

        {/* 加载状态 */}
        {loading && papers.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-sm text-gray-500">加载中...</span>
          </div>
        )}

        {/* 错误状态 */}
        {error && papers.length === 0 && !loading && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm"
            >
              重试
            </button>
          </div>
        )}

        {/* 空状态 */}
        {!loading && !error && papers.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">暂无论文</p>
          </div>
        )}

        {/* 论文列表 */}
        {!loading && papers.length > 0 && (
          <div className="space-y-4">
            {papers.map((paper, index) => (
              <div
                key={paper.id || `paper-${index}`}
                className="block bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2">
                      {paper.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {paper.authors} · {paper.year || '未知年份'} · {paper.venue}
                    </p>
                    {paper.abstract && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {paper.abstract.replace(/<[^>]*>/g, '').substring(0, 200)}
                        {paper.abstract.length > 200 ? '...' : ''}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                      {paper.citations > 0 && (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {paper.citations?.toLocaleString()} 引用
                        </span>
                      )}
                      {paper.source && (
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          paper.source === 'arxiv' ? 'bg-orange-100 text-orange-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {paper.source === 'crossref' ? 'Crossref' : 'arXiv'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  {paper.url && (
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <ExternalLink className="w-3 h-3" />
                      查看原文
                    </a>
                  )}
                  {paper.arxiv_id && (
                    <a
                      href={`https://arxiv.org/abs/${paper.arxiv_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-orange-600 hover:bg-orange-50 rounded-lg"
                    >
                      arXiv
                    </a>
                  )}
                  {paper.doi && (
                    <a
                      href={`https://doi.org/${paper.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      DOI
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 加载更多按钮 */}
        {papers.length > 0 && (
          <div className="mt-6 text-center">
            {loadingMore ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span className="ml-2 text-sm text-gray-500">加载中...</span>
              </div>
            ) : hasMore ? (
              <button
                onClick={loadMore}
                className="flex items-center gap-2 mx-auto px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
                发现更多论文
              </button>
            ) : (
              <p className="text-sm text-gray-400 py-4">已加载全部论文</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}