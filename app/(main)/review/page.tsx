'use client'

import { useState } from 'react'
import { Plus, Search, FileText, Sparkles, Download, Copy, ChevronRight, Edit3, Trash2, MoreHorizontal, Bold, Italic, List, Quote, Code, Heading1, Heading2, Save, Undo, Redo, Eye, FileDown, Share2, Clock, Users } from 'lucide-react'

const mockReviews = [
  {
    id: 1,
    title: 'Transformer 架构发展综述',
    topic: 'Transformer',
    papers: 15,
    createdAt: '2024-05-08',
    updatedAt: '2024-05-10',
    status: 'completed',
    wordCount: 8500,
    sections: ['引言', 'Transformer 基础', '变体与改进', '应用领域', '未来展望', '结论'],
    collaborators: ['张教授', '李博士'],
  },
  {
    id: 2,
    title: '大语言模型发展历程',
    topic: 'LLM',
    papers: 23,
    createdAt: '2024-05-10',
    updatedAt: '2024-05-12',
    status: 'draft',
    wordCount: 3200,
    sections: ['引言', 'GPT 系列', 'BERT 系列', '其他模型', '对比分析'],
    collaborators: ['王同学'],
  },
  {
    id: 3,
    title: '预训练语言模型方法综述',
    topic: 'Pre-training',
    papers: 18,
    createdAt: '2024-05-11',
    updatedAt: '2024-05-11',
    status: 'generating',
    wordCount: 0,
    sections: [],
    collaborators: [],
  },
]

const statusConfig = {
  draft: { label: '草稿', color: 'bg-gray-100 text-gray-700', icon: Edit3 },
  generating: { label: '生成中', color: 'bg-blue-100 text-blue-700', icon: Sparkles },
  completed: { label: '已完成', color: 'bg-green-100 text-green-700', icon: FileText },
}

// 模拟编辑器内容
const sampleContent = `
# Transformer 架构发展综述

## 1 引言

近年来，Transformer 架构已成为自然语言处理领域的主流模型。自 2017 年 Vaswani 等人提出原始 Transformer 以来，该架构经历了多次重要改进和变体发展。

## 2 Transformer 基础

### 2.1 Self-Attention 机制

Self-Attention 是 Transformer 的核心组件，其计算公式为：

$$Attention(Q, K, V) = softmax(QK^T / \\sqrt{d_k}) V$$

### 2.2 Multi-Head Attention

多头注意力机制允许模型同时关注不同位置的不同表示子空间...

## 3 变体与改进

### 3.1 BERT

BERT (Bidirectional Encoder Representations from Transformers) 通过双向预训练...

### 3.2 GPT 系列

GPT 采用单向 Transformer 解码器结构...

## 4 应用领域

Transformer 架构已被广泛应用于：
- 机器翻译
- 文本摘要
- 问答系统
- 代码生成

## 5 未来展望

未来研究方向包括：
- 更高效的注意力计算
- 长序列处理
- 多模态融合

## 6 结论

Transformer 架构彻底改变了 NLP 领域的研究范式...
`

export default function ReviewPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [editorContent, setEditorContent] = useState(sampleContent)
  const [aiPrompt, setAiPrompt] = useState('')
  const [showAiPanel, setShowAiPanel] = useState(true)

  const filteredReviews = mockReviews.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: mockReviews.length,
    totalPapers: mockReviews.reduce((sum, r) => sum + r.papers, 0),
    totalWords: mockReviews.reduce((sum, r) => sum + r.wordCount, 0),
  }

  // AI 辅助功能
  const aiFeatures = [
    { icon: '📝', label: '续写段落', desc: '根据上下文继续写作' },
    { icon: '🔄', label: '改写润色', desc: '优化语言表达' },
    { icon: '📚', label: '添加引用', desc: '插入相关文献引用' },
    { icon: '📊', label: '生成图表', desc: '创建对比表格' },
    { icon: '💡', label: '扩展内容', desc: '补充相关内容' },
    { icon: '✨', label: '总结提炼', desc: '生成段落摘要' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">综述写作</h1>
              <p className="text-gray-500 text-sm mt-1">AI 辅助生成文献综述，引用自动管理</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200">
                <FileDown className="w-4 h-4" />
                导出模板
              </button>
              <button 
                onClick={() => setShowEditor(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                新建综述
              </button>
            </div>
          </div>

          {/* 功能介绍 */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="font-semibold text-gray-900">AI 智能写作</div>
              </div>
              <p className="text-sm text-gray-600">自动续写、改写润色、生成图表</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="font-semibold text-gray-900">引用管理</div>
              </div>
              <p className="text-sm text-gray-600">自动生成引用格式，支持 APA/MLA</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="font-semibold text-gray-900">协作编辑</div>
              </div>
              <p className="text-sm text-gray-600">多人实时协作，版本追踪</p>
            </div>
          </div>

          {/* 统计 */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">综述数量</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-700">{stats.totalPapers}</div>
              <div className="text-sm text-blue-600">引用论文</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-700">{stats.totalWords.toLocaleString()}</div>
              <div className="text-sm text-green-600">总字数</div>
            </div>
          </div>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索综述..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* 综述列表 */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">暂无综述</p>
            <button 
              onClick={() => setShowEditor(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              创建第一篇综述
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {filteredReviews.map(review => {
              const status = statusConfig[review.status as keyof typeof statusConfig]
              return (
                <div 
                  key={review.id} 
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => { setSelectedReview(review); setShowEditor(true); }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{review.title}</h3>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>{review.papers} 篇文献</span>
                        <span>·</span>
                        <span>{review.wordCount > 0 ? `${review.wordCount.toLocaleString()} 字` : '生成中'}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          更新于 {review.updatedAt}
                        </span>
                        {review.collaborators.length > 0 && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {review.collaborators.length} 人协作
                            </span>
                          </>
                        )}
                      </div>
                      {/* 章节 */}
                      {review.sections.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {review.sections.slice(0, 4).map(section => (
                            <span key={section} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              {section}
                            </span>
                          ))}
                          {review.sections.length > 4 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                              +{review.sections.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {review.status === 'completed' && (
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Download className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Share2 className="w-4 h-4 text-gray-400" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 编辑器弹窗 */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
            {/* 头部 */}
            <div className="p-4 border-b flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedReview?.title || '新建综述'}
                </h2>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg">自动保存</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Undo className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Redo className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
                <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">
                  <Download className="w-4 h-4 mr-1 inline" />
                  导出
                </button>
                <button onClick={() => setShowEditor(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                  ✕
                </button>
              </div>
            </div>

            {/* 工具栏 */}
            <div className="p-2 border-b flex items-center gap-1 shrink-0 bg-gray-50">
              <button className="p-2 hover:bg-gray-200 rounded"><Heading1 className="w-4 h-4 text-gray-600" /></button>
              <button className="p-2 hover:bg-gray-200 rounded"><Heading2 className="w-4 h-4 text-gray-600" /></button>
              <button className="p-2 hover:bg-gray-200 rounded"><Bold className="w-4 h-4 text-gray-600" /></button>
              <button className="p-2 hover:bg-gray-200 rounded"><Italic className="w-4 h-4 text-gray-600" /></button>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <button className="p-2 hover:bg-gray-200 rounded"><List className="w-4 h-4 text-gray-600" /></button>
              <button className="p-2 hover:bg-gray-200 rounded"><Quote className="w-4 h-4 text-gray-600" /></button>
              <button className="p-2 hover:bg-gray-200 rounded"><Code className="w-4 h-4 text-gray-600" /></button>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                <Sparkles className="w-4 h-4" />
                AI 助手
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
                <FileText className="w-4 h-4" />
                添加引用
              </button>
            </div>

            {/* 主内容区 */}
            <div className="flex-1 flex overflow-hidden">
              {/* 编辑区 */}
              <div className="flex-1 overflow-auto p-6">
                <textarea
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  className="w-full h-full resize-none outline-none text-gray-800 leading-relaxed prose prose-sm max-w-none"
                  placeholder="开始写作..."
                />
              </div>

              {/* AI 面板 */}
              {showAiPanel && (
                <div className="w-64 border-l bg-gray-50 flex flex-col shrink-0">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      AI 写作助手
                    </h3>
                  </div>
                  <div className="flex-1 overflow-auto p-4 space-y-2">
                    {aiFeatures.map(feature => (
                      <button
                        key={feature.label}
                        className="w-full flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-100 text-left"
                      >
                        <span className="text-lg">{feature.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{feature.label}</p>
                          <p className="text-xs text-gray-500">{feature.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="p-4 border-t">
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="输入你的需求..."
                      className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm resize-none"
                      rows={3}
                    />
                    <button className="w-full mt-2 py-2 bg-blue-600 text-white rounded-lg text-sm">
                      生成
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}