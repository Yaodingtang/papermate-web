'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, FileText, Plus, Trash2, Play, Download, Copy, ChevronDown, ChevronRight, BookOpen, Clock, RefreshCw, FileDown, Edit3, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

// 模拟相关论文
const relatedPapers = [
  { id: 1, title: 'Attention Is All You Need', authors: 'Vaswani et al.', year: 2017, citations: 89000, selected: true },
  { id: 2, title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.', year: 2018, citations: 75000, selected: true },
  { id: 3, title: 'GPT-3: Language Models are Few-Shot Learners', authors: 'Brown et al.', year: 2020, citations: 45000, selected: true },
  { id: 4, title: 'Vision Transformer', authors: 'Dosovitskiy et al.', year: 2020, citations: 32000, selected: false },
  { id: 5, title: 'LoRA: Low-Rank Adaptation', authors: 'Hu et al.', year: 2021, citations: 12000, selected: false },
]

const reviewSections = [
  { id: 'background', title: '研究背景', status: 'done', content: '自然语言处理领域长期依赖循环神经网络（RNN）和卷积神经网络（CNN）处理序列数据。然而，这些架构存在并行化困难、长距离依赖建模能力有限等问题。Transformer架构的提出彻底改变了这一局面...' },
  { id: 'methods', title: '主要方法', status: 'done', content: 'Transformer架构的核心是自注意力机制（Self-Attention），它允许模型在处理序列时直接关注任意位置的信息。多头注意力机制进一步增强了模型从不同子空间捕获信息的能力...' },
  { id: 'progress', title: '发展脉络', status: 'generating', content: '' },
  { id: 'comparison', title: '方法对比', status: 'pending', content: '' },
  { id: 'future', title: '未来方向', status: 'pending', content: '' },
]

export default function ReviewGeneratePage() {
  const [topic, setTopic] = useState('Transformer架构及其在NLP领域的应用')
  const [papers, setPapers] = useState(relatedPapers)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReview, setGeneratedReview] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('background')
  const [sections, setSections] = useState(reviewSections)

  const togglePaper = (id: number) => {
    setPapers(papers.map(p => p.id === id ? { ...p, selected: !p.selected } : p))
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    // 模拟生成过程
    setTimeout(() => {
      setGeneratedReview('full_review_content')
      setIsGenerating(false)
    }, 3000)
  }

  const selectedCount = papers.filter(p => p.selected).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                智能文献综述
              </h1>
              <p className="text-sm text-gray-500 mt-1">AI 自动生成结构化文献综述</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm hover:bg-gray-50">
                <FileDown className="w-4 h-4" />
                导出 Word
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm hover:bg-gray-50">
                <Download className="w-4 h-4" />
                导出 LaTeX
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* 左侧：配置面板 */}
        <div className="w-80 bg-white border-r border-gray-100 min-h-[calc(100vh-120px)] p-4">
          {/* 研究主题 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">研究主题</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="输入研究主题..."
            />
          </div>

          {/* 选择论文 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">参考论文</label>
              <span className="text-xs text-gray-500">已选 {selectedCount} 篇</span>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {papers.map(paper => (
                <label
                  key={paper.id}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                    paper.selected ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={paper.selected}
                    onChange={() => togglePaper(paper.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{paper.title}</p>
                    <p className="text-xs text-gray-500">{paper.authors} · {paper.year}</p>
                  </div>
                </label>
              ))}
            </div>
            <button className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-xl">
              <Plus className="w-4 h-4" />
              添加更多论文
            </button>
          </div>

          {/* 综述结构 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">综述结构</label>
            <div className="space-y-1">
              {['研究背景', '主要方法', '发展脉络', '方法对比', '未来方向'].map((section, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl text-sm text-gray-700">
                  <span className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">{i + 1}</span>
                  {section}
                </div>
              ))}
            </div>
          </div>

          {/* 生成按钮 */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || selectedCount === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                正在生成...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                开始生成综述
              </>
            )}
          </button>
        </div>

        {/* 右侧：生成结果 */}
        <div className="flex-1 p-6">
          {!generatedReview && !isGenerating ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-medium text-gray-900 mb-2">准备好生成文献综述</h2>
              <p className="text-sm text-gray-500 mb-6">选择参考论文，点击"开始生成综述"按钮</p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  自动提取关键信息
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  结构化输出
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  支持导出
                </span>
              </div>
            </div>
          ) : isGenerating ? (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-lg font-medium text-gray-900 mb-2">正在生成文献综述...</h2>
              <p className="text-sm text-gray-500">AI 正在分析论文并生成内容，请稍候</p>
              <div className="mt-6 max-w-md mx-auto">
                {sections.map(section => (
                  <div key={section.id} className="flex items-center gap-3 py-2">
                    {section.status === 'done' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {section.status === 'generating' && <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />}
                    {section.status === 'pending' && <Clock className="w-4 h-4 text-gray-300" />}
                    <span className={`text-sm ${section.status === 'pending' ? 'text-gray-400' : 'text-gray-700'}`}>
                      {section.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">{topic}</h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-xl" title="复制">
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-xl" title="编辑">
                    <Edit3 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-xl" title="重新生成">
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* 章节导航 */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap ${
                      activeSection === section.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>

              {/* 内容区域 */}
              <div className="prose prose-sm max-w-none">
                <div className="text-gray-700 leading-relaxed">
                  {sections.find(s => s.id === activeSection)?.content || '内容生成中...'}
                </div>

                {/* 引用 */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">参考文献</p>
                  <div className="space-y-1">
                    {papers.filter(p => p.selected).slice(0, 3).map((p, i) => (
                      <p key={p.id} className="text-xs text-gray-500">
                        [{i + 1}] {p.authors} ({p.year}). {p.title}.
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}