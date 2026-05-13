'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Sparkles, Bell, Calendar, Clock, Bookmark, ChevronRight,
  TrendingUp, Users, FileText, Star, ExternalLink, Share2,
  Settings, RefreshCw, Filter, Search, BookOpen, Heart,
  CheckCircle, AlertCircle, Zap, Globe, Mail, MessageSquare,
  Loader2, X, Plus, Trash2, Save
} from 'lucide-react'
import { api } from '@/lib/api'

interface Paper {
  id: string
  title: string
  authors: string
  year: number
  venue: string
  abstract: string
  doi?: string
  arxiv_id?: string
  citation_count: number
  reason: string
  relevance: number
  source: string
  saved: boolean
  hot: boolean
}

interface UserInterest {
  name: string
  weight: number
}

type SortType = 'relevance' | 'citations' | 'year'

export default function DailyPushPage() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [originalPapers, setOriginalPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showInterestEditor, setShowInterestEditor] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  // 设置状态
  const [pushEnabled, setPushEnabled] = useState(true)
  const [pushTime, setPushTime] = useState('09:00')
  const [pushChannel, setPushChannel] = useState<'email' | 'wechat' | 'app'>('app')
  const [pushCount, setPushCount] = useState(5)
  const [sources, setSources] = useState({
    arxiv: true,
    crossref: true,
    semanticScholar: false,
    hotPapers: true,
  })

  // 排序状态
  const [sortBy, setSortBy] = useState<SortType>('relevance')

  // 研究兴趣
  const [userInterests, setUserInterests] = useState<UserInterest[]>([
    { name: '机器学习', weight: 85 },
    { name: '深度学习', weight: 72 },
    { name: '自然语言处理', weight: 65 },
  ])
  const [newInterest, setNewInterest] = useState('')
  const [editingInterest, setEditingInterest] = useState<UserInterest | null>(null)

  // 加载用户设置
  useEffect(() => {
    loadUserSettings()
  }, [])

  // 加载用户设置
  const loadUserSettings = async () => {
    try {
      const response = await api.get('/users/me')
      const user = response.data

      if (user.daily_push_enabled !== undefined) {
        setPushEnabled(user.daily_push_enabled)
      }
      if (user.push_time) {
        setPushTime(user.push_time)
      }
      if (user.push_channel) {
        setPushChannel(user.push_channel)
      }
      if (user.research_interests && user.research_interests.length > 0) {
        setUserInterests(user.research_interests.map((name: string) => ({
          name,
          weight: Math.floor(Math.random() * 40) + 60
        })))
      }
    } catch (err) {
      console.error('Load user settings error:', err)
    }
  }

  // 加载每日推荐
  const loadRecommendations = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.get('/daily/recommendations')
      const data = response.data

      if (data.papers && data.papers.length > 0) {
        const papersWithMeta = data.papers.map((paper: Paper, index: number) => ({
          ...paper,
          saved: false,
          hot: index < 2 || paper.citation_count > 100,
        }))
        setOriginalPapers(papersWithMeta)
        setPapers(sortPapers(papersWithMeta, sortBy))
      } else {
        setError('暂无推荐论文')
        setPapers([])
        setOriginalPapers([])
      }
    } catch (err: any) {
      console.error('Load recommendations error:', err)
      if (err.response?.status === 401) {
        setError('请先登录')
      } else {
        setError('加载失败，请点击刷新重试')
      }
      setPapers([])
      setOriginalPapers([])
    } finally {
      setLoading(false)
    }
  }

  // 排序论文
  const sortPapers = (paperList: Paper[], sortType: SortType): Paper[] => {
    const sorted = [...paperList]
    switch (sortType) {
      case 'citations':
        sorted.sort((a, b) => b.citation_count - a.citation_count)
        break
      case 'year':
        sorted.sort((a, b) => (b.year || 0) - (a.year || 0))
        break
      case 'relevance':
      default:
        sorted.sort((a, b) => b.relevance - a.relevance)
    }
    return sorted
  }

  // 切换排序
  const handleSortChange = (sortType: SortType) => {
    setSortBy(sortType)
    setPapers(sortPapers(originalPapers, sortType))
  }

  // 初始加载
  useEffect(() => {
    loadRecommendations()
  }, [])

  // 切换收藏状态
  const toggleSave = (id: string) => {
    setPapers(papers.map(p => p.id === id ? { ...p, saved: !p.saved } : p))
    setOriginalPapers(originalPapers.map(p => p.id === id ? { ...p, saved: !p.saved } : p))
  }

  // 保存设置
  const saveSettings = async () => {
    setSaving(true)
    setSaveMessage(null)

    try {
      await api.patch('/daily/settings', {
        push_enabled: pushEnabled,
        push_time: pushTime,
        push_channel: pushChannel,
        push_count: pushCount,
        sources: sources,
      })

      setSaveMessage('设置已保存')
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (err) {
      console.error('Save settings error:', err)
      setSaveMessage('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  // 保存研究兴趣
  const saveInterests = async () => {
    setSaving(true)
    setSaveMessage(null)

    try {
      await api.patch('/daily/interests', {
        interests: userInterests.map(i => i.name)
      })

      setSaveMessage('研究兴趣已保存')
      setShowInterestEditor(false)
      setTimeout(() => setSaveMessage(null), 3000)

      // 重新加载推荐
      loadRecommendations()
    } catch (err) {
      console.error('Save interests error:', err)
      setSaveMessage('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  // 添加研究兴趣
  const addInterest = () => {
    if (newInterest.trim() && !userInterests.find(i => i.name === newInterest.trim())) {
      setUserInterests([...userInterests, { name: newInterest.trim(), weight: 50 }])
      setNewInterest('')
    }
  }

  // 删除研究兴趣
  const removeInterest = (name: string) => {
    setUserInterests(userInterests.filter(i => i.name !== name))
  }

  // 更新兴趣权重
  const updateInterestWeight = (name: string, weight: number) => {
    setUserInterests(userInterests.map(i =>
      i.name === name ? { ...i, weight } : i
    ))
  }

  const savedCount = papers.filter(p => p.saved).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                每日论文推送
              </h1>
              <p className="text-sm text-gray-500 mt-1">根据你的研究兴趣，每天推荐精选论文</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm hover:bg-gray-50"
              >
                <Settings className="w-4 h-4" />
                设置
              </button>
              <button
                onClick={loadRecommendations}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                刷新推荐
              </button>
            </div>
          </div>

          {/* 保存提示 */}
          {saveMessage && (
            <div className={`mt-4 p-3 rounded-xl text-sm flex items-center gap-2 ${
              saveMessage.includes('失败') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
            }`}>
              {saveMessage.includes('失败') ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {saveMessage}
            </div>
          )}

          {/* 今日统计 */}
          <div className="flex items-center gap-4 mt-4 p-4 bg-blue-50 rounded-2xl">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-900">今日推荐</span>
              <span className="text-lg font-bold text-blue-600">{papers.length}</span>
              <span className="text-sm text-blue-700">篇</span>
            </div>
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-900">已收藏</span>
              <span className="text-lg font-bold text-blue-600">{savedCount}</span>
              <span className="text-sm text-blue-700">篇</span>
            </div>
            <div className="flex-1 text-right">
              <span className="text-xs text-blue-500">
                推送时间：{pushTime} · {pushEnabled ? '已开启' : '已关闭'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* 左侧：推荐列表 */}
        <div className="flex-1 p-6">
          {/* 加载状态 */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-sm text-gray-500">加载推荐论文...</span>
            </div>
          )}

          {/* 错误状态 */}
          {error && !loading && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">{error}</p>
              <button
                onClick={loadRecommendations}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm"
              >
                重试
              </button>
            </div>
          )}

          {/* 排序按钮 */}
          {!loading && !error && papers.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-500">排序：</span>
              <button
                onClick={() => handleSortChange('relevance')}
                className={`px-3 py-1.5 rounded-xl text-xs transition-colors ${
                  sortBy === 'relevance' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                推荐度
              </button>
              <button
                onClick={() => handleSortChange('citations')}
                className={`px-3 py-1.5 rounded-xl text-xs transition-colors ${
                  sortBy === 'citations' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                热度
              </button>
              <button
                onClick={() => handleSortChange('year')}
                className={`px-3 py-1.5 rounded-xl text-xs transition-colors ${
                  sortBy === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                时间
              </button>
            </div>
          )}

          {/* 论文列表 */}
          {!loading && !error && papers.length > 0 && (
            <div className="space-y-4">
              {papers.map((paper, index) => (
                <div
                  key={paper.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* 排名 */}
                    <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* 标题行 */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {paper.hot && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-600 rounded-lg text-xs">
                            <TrendingUp className="w-3 h-3" />
                            热门
                          </span>
                        )}
                        {paper.source && (
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            paper.source === 'arxiv' ? 'bg-orange-100 text-orange-600' :
                            paper.source === 'crossref' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {paper.source}
                          </span>
                        )}
                        <h3 className="text-base font-medium text-gray-900 line-clamp-1">{paper.title}</h3>
                      </div>

                      {/* 作者信息 */}
                      <p className="text-sm text-gray-500 mb-2">
                        {paper.authors} · {paper.year || '未知年份'} · {paper.venue}
                        {paper.citation_count > 0 && (
                          <span className="ml-2 text-blue-600">
                            · {paper.citation_count.toLocaleString()} 引用
                          </span>
                        )}
                      </p>

                      {/* 摘要 */}
                      {paper.abstract && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {paper.abstract.replace(/<[^>]*>/g, '').substring(0, 150)}
                          {paper.abstract.length > 150 ? '...' : ''}
                        </p>
                      )}

                      {/* 推荐理由 */}
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                          {paper.reason}
                        </span>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex items-center gap-2">
                        {paper.doi && (
                          <a
                            href={`https://doi.org/${paper.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <ExternalLink className="w-3 h-3" />
                            DOI
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
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => toggleSave(paper.id)}
                        className={`p-2 rounded-xl transition-colors ${paper.saved ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                      >
                        <Bookmark className="w-5 h-5" fill={paper.saved ? 'currentColor' : 'none'} />
                      </button>
                      <Link
                        href={`/reading/${paper.id}`}
                        className="p-2 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200"
                      >
                        <BookOpen className="w-5 h-5" />
                      </Link>
                      <button className="p-2 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 空状态 */}
          {!loading && !error && papers.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">暂无推荐论文</p>
              <p className="text-gray-400 text-xs mt-1">请稍后再试或调整研究兴趣</p>
            </div>
          )}
        </div>

        {/* 右侧：设置面板 */}
        <div className="w-72 bg-white border-l border-gray-100 p-4">
          {/* 推送状态 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">推送状态</span>
              <button
                onClick={() => {
                  setPushEnabled(!pushEnabled)
                  // 自动保存
                  setTimeout(() => saveSettings(), 100)
                }}
                className={`w-10 h-6 rounded-full transition-colors ${pushEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${pushEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              {pushEnabled ? '每日自动推送' : '推送已关闭'}
            </p>
          </div>

          {/* 推送时间 */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-900 mb-2">推送时间</label>
            <select
              value={pushTime}
              onChange={(e) => {
                setPushTime(e.target.value)
                setTimeout(() => saveSettings(), 100)
              }}
              className="w-full px-3 py-2 bg-gray-100 border-0 rounded-xl text-sm"
            >
              <option value="08:00">08:00 早晨</option>
              <option value="09:00">09:00 早间</option>
              <option value="12:00">12:00 午间</option>
              <option value="18:00">18:00 傍晚</option>
              <option value="21:00">21:00 夜间</option>
            </select>
          </div>

          {/* 推送渠道 */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-900 mb-2">推送渠道</label>
            <div className="space-y-2">
              {[
                { id: 'app' as const, label: '应用内', icon: Bell },
                { id: 'email' as const, label: '邮件', icon: Mail },
                { id: 'wechat' as const, label: '微信', icon: MessageSquare },
              ].map(channel => (
                <button
                  key={channel.id}
                  onClick={() => {
                    setPushChannel(channel.id)
                    setTimeout(() => saveSettings(), 100)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                    pushChannel === channel.id ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <channel.icon className="w-4 h-4" />
                  {channel.label}
                  {pushChannel === channel.id && <CheckCircle className="w-4 h-4 ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* 研究兴趣 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-900">研究兴趣</label>
              <button
                onClick={() => setShowInterestEditor(true)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                编辑
              </button>
            </div>
            <div className="space-y-2">
              {userInterests.map(interest => (
                <div key={interest.name} className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 w-20 truncate">{interest.name}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${interest.weight}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{interest.weight}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 数据来源说明 */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-2">数据来源</p>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">Crossref</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded text-xs">arXiv</span>
            </div>
          </div>
        </div>
      </div>

      {/* 设置弹窗 */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">推送设置</h2>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">每日推送数量</label>
                <select
                  value={pushCount}
                  onChange={(e) => setPushCount(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 bg-gray-100 border-0 rounded-xl text-sm"
                >
                  <option value={3}>3 篇精选</option>
                  <option value={5}>5 篇推荐</option>
                  <option value={10}>10 篇扩展</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2">推荐来源</label>
                <div className="space-y-2">
                  {[
                    { key: 'arxiv', label: 'arXiv 最新' },
                    { key: 'crossref', label: 'Crossref 高引用' },
                    { key: 'semanticScholar', label: 'Semantic Scholar' },
                    { key: 'hotPapers', label: '热门论文' },
                  ].map(source => (
                    <label key={source.key} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={sources[source.key as keyof typeof sources]}
                        onChange={(e) => setSources({ ...sources, [source.key]: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">{source.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-gray-200"
              >
                取消
              </button>
              <button
                onClick={() => {
                  saveSettings()
                  setShowSettings(false)
                }}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 研究兴趣编辑弹窗 */}
      {showInterestEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">编辑研究兴趣</h2>
              <button onClick={() => setShowInterestEditor(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 添加新兴趣 */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="输入新的研究兴趣..."
                className="flex-1 px-3 py-2 bg-gray-100 border-0 rounded-xl text-sm"
                onKeyDown={(e) => e.key === 'Enter' && addInterest()}
              />
              <button
                onClick={addInterest}
                disabled={!newInterest.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* 兴趣列表 */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {userInterests.map(interest => (
                <div key={interest.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={interest.weight}
                    onChange={(e) => updateInterestWeight(interest.name, Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-700 w-24 truncate">{interest.name}</span>
                  <span className="text-xs text-gray-500 w-8">{interest.weight}%</span>
                  <button
                    onClick={() => removeInterest(interest.name)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {userInterests.length === 0 && (
              <p className="text-center text-sm text-gray-500 py-4">暂无研究兴趣，请添加</p>
            )}

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowInterestEditor(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-gray-200"
              >
                取消
              </button>
              <button
                onClick={saveInterests}
                disabled={saving || userInterests.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}