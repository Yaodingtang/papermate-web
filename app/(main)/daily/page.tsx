'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Sparkles, Bell, Calendar, Clock, Bookmark, ChevronRight, 
  TrendingUp, Users, FileText, Star, ExternalLink, Share2,
  Settings, RefreshCw, Filter, Search, BookOpen, Heart,
  CheckCircle, AlertCircle, Zap, Globe, Mail, MessageSquare
} from 'lucide-react'

// 模拟每日推荐论文
const dailyPapers = [
  {
    id: 1,
    title: 'Mixture of Experts Meets Instruction Tuning',
    authors: 'Wang et al.',
    year: 2024,
    venue: 'arXiv',
    abstract: '我们探索了将专家混合模型与指令微调相结合的方法，在多个任务上取得了显著提升...',
    reason: '基于你关注的"大语言模型"领域',
    tags: ['LLM', 'Instruction Tuning', 'MoE'],
    hot: true,
    saved: false,
  },
  {
    id: 2,
    title: 'Efficient Long-Context Transformers',
    authors: 'Chen et al.',
    year: 2024,
    venue: 'ICLR 2024',
    abstract: '提出了一种高效的长期上下文处理方法，显著降低了计算复杂度...',
    reason: '与你最近阅读的 Transformer 相关',
    tags: ['Transformer', 'Long Context', 'Efficiency'],
    hot: false,
    saved: true,
  },
  {
    id: 3,
    title: 'Multimodal Foundation Models: A Survey',
    authors: 'Li et al.',
    year: 2024,
    venue: 'arXiv',
    abstract: '全面综述了多模态基础模型的发展历程、主要方法和未来方向...',
    reason: '热门综述论文',
    tags: ['Multimodal', 'Survey', 'Foundation Models'],
    hot: true,
    saved: false,
  },
  {
    id: 4,
    title: 'Self-Play Reinforcement Learning for LLM Reasoning',
    authors: 'Zhang et al.',
    year: 2024,
    venue: 'NeurIPS 2024',
    abstract: '使用自我博弈强化学习提升大语言模型的推理能力...',
    reason: '新方法，可能启发你的研究',
    tags: ['RL', 'Reasoning', 'LLM'],
    hot: false,
    saved: false,
  },
  {
    id: 5,
    title: 'Parameter-Efficient Fine-Tuning: A Comprehensive Study',
    authors: 'Liu et al.',
    year: 2024,
    venue: 'ACL 2024',
    abstract: '系统研究了多种参数高效微调方法的性能和适用场景...',
    reason: '与你收藏的 LoRA 相关',
    tags: ['Fine-tuning', 'PEFT', 'LoRA'],
    hot: false,
    saved: false,
  },
]

// 模拟用户兴趣
const userInterests = [
  { name: '大语言模型', weight: 85 },
  { name: 'Transformer', weight: 72 },
  { name: 'Fine-tuning', weight: 65 },
  { name: '多模态', weight: 45 },
  { name: '强化学习', weight: 30 },
]

// 模拟推送历史
const pushHistory = [
  { date: '2024-05-11', count: 5, read: 3, saved: 2 },
  { date: '2024-05-10', count: 5, read: 2, saved: 1 },
  { date: '2024-05-09', count: 5, read: 4, saved: 3 },
]

export default function DailyPushPage() {
  const [papers, setPapers] = useState(dailyPapers)
  const [showSettings, setShowSettings] = useState(false)
  const [pushEnabled, setPushEnabled] = useState(true)
  const [pushTime, setPushTime] = useState('09:00')
  const [pushChannel, setPushChannel] = useState<'email' | 'wechat' | 'app'>('app')

  const toggleSave = (id: number) => {
    setPapers(papers.map(p => p.id === id ? { ...p, saved: !p.saved } : p))
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
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm">
                <RefreshCw className="w-4 h-4" />
                刷新推荐
              </button>
            </div>
          </div>

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
              <span className="text-xs text-blue-500">推送时间：今日 {pushTime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* 左侧：推荐列表 */}
        <div className="flex-1 p-6">
          {/* 热门标记 */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">排序：</span>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs">推荐度</button>
            <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-xs">热度</button>
            <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-xs">时间</button>
          </div>

          {/* 论文列表 */}
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
                    <div className="flex items-center gap-2 mb-1">
                      {paper.hot && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-600 rounded-lg text-xs">
                          <TrendingUp className="w-3 h-3" />
                          热门
                        </span>
                      )}
                      <h3 className="text-base font-medium text-gray-900">{paper.title}</h3>
                    </div>

                    {/* 作者信息 */}
                    <p className="text-sm text-gray-500 mb-2">{paper.authors} · {paper.year} · {paper.venue}</p>

                    {/* 摘要 */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{paper.abstract}</p>

                    {/* 推荐理由 */}
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                        {paper.reason}
                      </span>
                    </div>

                    {/* 标签 */}
                    <div className="flex items-center gap-2">
                      {paper.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <button 
                      onClick={() => toggleSave(paper.id)}
                      className={`p-2 rounded-xl ${paper.saved ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
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

          {/* 加载更多 */}
          <button className="w-full mt-4 py-3 text-sm text-gray-500 hover:bg-gray-100 rounded-xl">
            查看更多推荐
          </button>
        </div>

        {/* 右侧：设置面板 */}
        <div className="w-72 bg-white border-l border-gray-100 p-4">
          {/* 推送状态 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">推送状态</span>
              <button 
                onClick={() => setPushEnabled(!pushEnabled)}
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
              onChange={(e) => setPushTime(e.target.value)}
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
                { id: 'app', label: '应用内', icon: Bell },
                { id: 'email', label: '邮件', icon: Mail },
                { id: 'wechat', label: '微信', icon: MessageSquare },
              ].map(channel => (
                <button
                  key={channel.id}
                  onClick={() => setPushChannel(channel.id as typeof pushChannel)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${
                    pushChannel === channel.id ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-50 text-gray-600'
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
              <button className="text-xs text-blue-600">编辑</button>
            </div>
            <div className="space-y-2">
              {userInterests.map(interest => (
                <div key={interest.name} className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">{interest.name}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${interest.weight}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{interest.weight}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 推送历史 */}
          <div>
            <label className="text-sm font-medium text-gray-900 mb-2">推送历史</label>
            <div className="space-y-2">
              {pushHistory.map(history => (
                <div key={history.date} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl text-xs">
                  <span className="text-gray-500">{history.date}</span>
                  <span className="text-gray-700">{history.count}篇</span>
                  <span className="text-green-600">读{history.read}</span>
                  <span className="text-blue-600">存{history.saved}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 设置弹窗 */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">推送设置</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">每日推送数量</label>
                <select className="w-full mt-1 px-3 py-2 bg-gray-100 border-0 rounded-xl text-sm">
                  <option>3 篇精选</option>
                  <option>5 篇推荐</option>
                  <option>10 篇扩展</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">推荐来源</label>
                <div className="mt-1 space-y-2">
                  {['arXiv 最新', '顶会论文', '高引用论文', '团队推荐'].map(source => (
                    <label key={source} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-gray-700">{source}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button 
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm"
              >
                取消
              </button>
              <button 
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}