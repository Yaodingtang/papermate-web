'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageSquare, Eye, EyeOff, User, Clock, Filter, ChevronRight, FileText, Highlighter, PenTool, Heart, Reply } from 'lucide-react'

const mockAnnotations = [
  {
    id: 1,
    paperId: 1,
    paperTitle: 'Attention Is All You Need',
    user: { name: '张教授', avatar: '👨‍🏫', role: '导师' },
    type: 'highlight',
    content: '这是 Transformer 架构的核心创新点，完全基于注意力机制',
    position: '第 3 页，第 2 段',
    text: 'The Transformer is the first transduction model relying entirely on self-attention',
    time: '2小时前',
    likes: 5,
    replies: 2,
    isShared: true,
    color: 'yellow',
  },
  {
    id: 2,
    paperId: 1,
    paperTitle: 'Attention Is All You Need',
    user: { name: '李博士', avatar: '👨‍🔬', role: '博士' },
    type: 'note',
    content: 'Multi-Head Attention 的设计灵感来自 CNN 的多通道，可以让模型同时关注不同位置的信息',
    position: '第 4 页，公式 (2)',
    text: 'MultiHead(Q, K, V) = Concat(head_1, ..., head_h)W^O',
    time: '3小时前',
    likes: 3,
    replies: 1,
    isShared: true,
    color: 'blue',
  },
  {
    id: 3,
    paperId: 2,
    paperTitle: 'BERT: Pre-training of Deep Bidirectional Transformers',
    user: { name: '王同学', avatar: '👨‍🎓', role: '硕士' },
    type: 'question',
    content: '这里为什么要用 Masked Language Model 而不是标准的 Language Model？',
    position: '第 2 页，3.1节',
    text: 'In order to train a bidirectional representation',
    time: '1天前',
    likes: 2,
    replies: 4,
    isShared: true,
    color: 'green',
  },
  {
    id: 4,
    paperId: 1,
    paperTitle: 'Attention Is All You Need',
    user: { name: '赵同学', avatar: '👩‍🎓', role: '硕士' },
    type: 'highlight',
    content: '',
    position: '第 5 页，表格 1',
    text: 'The encoder is composed of a stack of N = 6 identical layers',
    time: '2天前',
    likes: 1,
    replies: 0,
    isShared: true,
    color: 'pink',
  },
  {
    id: 5,
    paperId: 3,
    paperTitle: 'GPT-4 Technical Report',
    user: { name: '我', avatar: '👤', role: '' },
    type: 'note',
    content: 'Few-shot learning 的能力令人印象深刻，但成本也很高',
    position: '第 8 页',
    text: '',
    time: '3天前',
    likes: 0,
    replies: 0,
    isShared: false,
    color: 'blue',
  },
]

const typeConfig = {
  highlight: { label: '高亮', icon: Highlighter, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  note: { label: '笔记', icon: PenTool, color: 'text-blue-600', bg: 'bg-blue-100' },
  question: { label: '提问', icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-100' },
}

const colorMap: Record<string, string> = {
  yellow: 'bg-yellow-200 border-yellow-400',
  blue: 'bg-blue-200 border-blue-400',
  green: 'bg-green-200 border-green-400',
  pink: 'bg-pink-200 border-pink-400',
}

export default function SharedAnnotationsPage() {
  const [showOnlyShared, setShowOnlyShared] = useState(true)
  const [typeFilter, setTypeFilter] = useState<'all' | 'highlight' | 'note' | 'question'>('all')
  const [selectedPaper, setSelectedPaper] = useState<number | null>(null)

  const filteredAnnotations = mockAnnotations.filter(a => {
    const matchShared = !showOnlyShared || a.isShared
    const matchType = typeFilter === 'all' || a.type === typeFilter
    const matchPaper = !selectedPaper || a.paperId === selectedPaper
    return matchShared && matchType && matchPaper
  })

  // 统计
  const stats = {
    total: mockAnnotations.filter(a => a.isShared).length,
    highlights: mockAnnotations.filter(a => a.isShared && a.type === 'highlight').length,
    notes: mockAnnotations.filter(a => a.isShared && a.type === 'note').length,
    questions: mockAnnotations.filter(a => a.isShared && a.type === 'question').length,
  }

  // 按论文分组
  const papers = Array.from(new Set(mockAnnotations.map(a => a.paperId))).map(id => ({
    id,
    title: mockAnnotations.find(a => a.paperId === id)?.paperTitle || '',
    count: mockAnnotations.filter(a => a.paperId === id && a.isShared).length,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">共享批注</h1>
              <p className="text-gray-500 text-sm mt-1">查看团队成员的批注和想法</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowOnlyShared(!showOnlyShared)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                  showOnlyShared ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {showOnlyShared ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {showOnlyShared ? '仅共享' : '全部'}
              </button>
              <Link href="/team" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl">
                团队管理
              </Link>
            </div>
          </div>

          {/* 统计 */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">共享批注</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl">
              <div className="text-2xl font-bold text-yellow-700">{stats.highlights}</div>
              <div className="text-sm text-yellow-600">高亮</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-700">{stats.notes}</div>
              <div className="text-sm text-blue-600">笔记</div>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-700">{stats.questions}</div>
              <div className="text-sm text-green-600">提问</div>
            </div>
          </div>
        </div>
      </div>

      {/* 内容 */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* 侧边栏 - 论文筛选 */}
          <div className="w-56 shrink-0">
            <h3 className="font-medium text-gray-900 mb-3">按论文筛选</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedPaper(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedPaper === null ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                全部论文
              </button>
              {papers.map(paper => (
                <button
                  key={paper.id}
                  onClick={() => setSelectedPaper(paper.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedPaper === paper.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="truncate">{paper.title}</div>
                  <div className="text-xs text-gray-500">{paper.count} 条批注</div>
                </button>
              ))}
            </div>

            <h3 className="font-medium text-gray-900 mt-6 mb-3">按类型筛选</h3>
            <div className="space-y-2">
              {[
                { value: 'all', label: '全部类型' },
                { value: 'highlight', label: '高亮' },
                { value: 'note', label: '笔记' },
                { value: 'question', label: '提问' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setTypeFilter(opt.value as any)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    typeFilter === opt.value ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 批注列表 */}
          <div className="flex-1">
            {filteredAnnotations.length === 0 ? (
              <div className="text-center py-16">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">暂无共享批注</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAnnotations.map(annotation => {
                  const type = typeConfig[annotation.type as keyof typeof typeConfig]
                  return (
                    <div key={annotation.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      {/* 论文标题 */}
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <Link 
                          href={`/reading/${annotation.paperId}`}
                          className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1"
                        >
                          <FileText className="w-4 h-4" />
                          {annotation.paperTitle}
                        </Link>
                        <span className="text-xs text-gray-500">{annotation.position}</span>
                      </div>

                      {/* 批注内容 */}
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                            {annotation.user.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-900">{annotation.user.name}</span>
                              {annotation.user.role && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">
                                  {annotation.user.role}
                                </span>
                              )}
                              <span className={`px-2 py-0.5 ${type.bg} ${type.color} text-xs rounded flex items-center gap-1`}>
                                <type.icon className="w-3 h-3" />
                                {type.label}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {annotation.time}
                              </span>
                              {!annotation.isShared && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                                  私有
                                </span>
                              )}
                            </div>

                            {/* 高亮的原文 */}
                            {annotation.text && (
                              <div className={`p-3 rounded-lg mb-2 border ${colorMap[annotation.color]}`}>
                                <p className="text-sm text-gray-700 italic">"{annotation.text}"</p>
                              </div>
                            )}

                            {/* 批注内容 */}
                            {annotation.content && (
                              <p className="text-sm text-gray-700">{annotation.content}</p>
                            )}

                            {/* 操作 */}
                            <div className="flex items-center gap-4 mt-3">
                              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500">
                                <Heart className="w-4 h-4" />
                                {annotation.likes}
                              </button>
                              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500">
                                <Reply className="w-4 h-4" />
                                {annotation.replies} 回复
                              </button>
                              <Link 
                                href={`/reading/${annotation.paperId}`}
                                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                              >
                                查看原文 <ChevronRight className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}