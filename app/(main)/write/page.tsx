'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { 
  Sparkles, FileText, Copy, RefreshCw, Wand2, BookOpen, 
  CheckCircle, AlertCircle, Lightbulb, Quote, Edit3, FileDown,
  Bold, Italic, List, Link2, PenTool,
  ThumbsUp, ThumbsDown, Target, Zap
} from 'lucide-react'

const mockCitations = [
  { id: 1, title: 'Attention Is All You Need', authors: 'Vaswani et al.', year: 2017, relevance: 95, reason: '核心方法引用' },
  { id: 2, title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.', year: 2018, relevance: 88, reason: '相关工作' },
  { id: 3, title: 'GPT-3: Language Models are Few-Shot Learners', authors: 'Brown et al.', year: 2020, relevance: 82, reason: '方法对比' },
]

const mockSuggestions = [
  { type: 'grammar', text: '第3行："their" 应为 "there"', severity: 'error' },
  { type: 'style', text: '第5行：建议将 "very good" 改为 "significant"', severity: 'warning' },
  { type: 'citation', text: '第8行：缺少引用，建议引用 Transformer 原论文', severity: 'info' },
  { type: 'logic', text: '第12行：论证不够充分，建议补充实验数据', severity: 'warning' },
]

export default function WritingAssistantPage() {
  const [activeTab, setActiveTab] = useState<'write' | 'polish' | 'cite' | 'check'>('write')
  const [content, setContent] = useState('')
  const [polishedContent, setPolishedContent] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handlePolish = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setPolishedContent('本文提出了一种基于注意力机制的新型模型，实验结果表明该方法在多个基准数据集上取得了显著优于现有方法的性能。')
      setIsProcessing(false)
    }, 2000)
  }

  const insertCitation = (citation: typeof mockCitations[0]) => {
    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const citeText = ' [' + citation.authors.split(' ')[0] + ' et al., ' + citation.year + ']'
      const newContent = content.slice(0, start) + citeText + content.slice(start)
      setContent(newContent)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-blue-600" />
                智能写作助手
              </h1>
              <p className="text-sm text-gray-500 mt-1">AI 辅助学术写作，提升论文质量</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm hover:bg-gray-50">
              <FileDown className="w-4 h-4" />
              导出
            </button>
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={() => setActiveTab('write')} className={"flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors " + (activeTab === 'write' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
              <Edit3 className="w-4 h-4" />
              智能写作
            </button>
            <button onClick={() => setActiveTab('polish')} className={"flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors " + (activeTab === 'polish' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
              <Wand2 className="w-4 h-4" />
              润色改写
            </button>
            <button onClick={() => setActiveTab('cite')} className={"flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors " + (activeTab === 'cite' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
              <Quote className="w-4 h-4" />
              引用推荐
            </button>
            <button onClick={() => setActiveTab('check')} className={"flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors " + (activeTab === 'check' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
              <CheckCircle className="w-4 h-4" />
              论文检查
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 p-6">
          {activeTab === 'write' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                <button className="p-2 hover:bg-gray-100 rounded-lg"><Bold className="w-4 h-4 text-gray-600" /></button>
                <button className="p-2 hover:bg-gray-100 rounded-lg"><Italic className="w-4 h-4 text-gray-600" /></button>
                <button className="p-2 hover:bg-gray-100 rounded-lg"><List className="w-4 h-4 text-gray-600" /></button>
                <button className="p-2 hover:bg-gray-100 rounded-lg"><Link2 className="w-4 h-4 text-gray-600" /></button>
                <div className="flex-1" />
                <span className="text-xs text-gray-400">{content.length} 字</span>
              </div>

              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="开始写作..."
                className="w-full h-96 p-4 bg-gray-50 border-0 rounded-xl text-sm resize-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm">
                  <Quote className="w-4 h-4" />
                  推荐引用
                </button>
                <button onClick={handlePolish} disabled={!content.trim()} className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-sm disabled:opacity-50">
                  <Wand2 className="w-4 h-4" />
                  润色选中
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-sm">
                  <CheckCircle className="w-4 h-4" />
                  全文检查
                </button>
              </div>
            </div>
          )}

          {activeTab === 'polish' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">原文</h3>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="输入需要润色的文字..."
                  className="w-full h-32 p-4 bg-gray-50 border-0 rounded-xl text-sm resize-none"
                />
                <button onClick={handlePolish} disabled={isProcessing || !content.trim()} className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm disabled:opacity-50">
                  {isProcessing ? '润色中...' : '开始润色'}
                </button>
              </div>

              {polishedContent && (
                <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-blue-900">润色结果</h3>
                    <button className="p-1.5 hover:bg-blue-100 rounded-lg"><Copy className="w-4 h-4 text-blue-600" /></button>
                  </div>
                  <p className="text-sm text-blue-900 leading-relaxed">{polishedContent}</p>
                  <div className="flex gap-2 mt-4">
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs">采用</button>
                    <button className="px-3 py-1.5 bg-white text-blue-600 rounded-lg text-xs border border-blue-200">重新生成</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cite' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">智能引用推荐</h3>
              <p className="text-sm text-gray-500 mb-4">基于您的写作内容，AI 推荐以下相关论文：</p>
              
              <div className="space-y-3">
                {mockCitations.map(citation => (
                  <div key={citation.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">{citation.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{citation.authors} - {citation.year}</p>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs mt-2 inline-block">相关度 {citation.relevance}%</span>
                    </div>
                    <button onClick={() => insertCitation(citation)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs shrink-0">插入引用</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'check' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">检查结果</h3>

              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-red-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-red-600">1</p>
                  <p className="text-xs text-red-500">语法错误</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-amber-600">2</p>
                  <p className="text-xs text-amber-500">风格建议</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">1</p>
                  <p className="text-xs text-blue-500">引用缺失</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">85</p>
                  <p className="text-xs text-green-500">质量评分</p>
                </div>
              </div>

              <div className="space-y-2">
                {mockSuggestions.map((suggestion, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-700">{suggestion.text}</p>
                    <button className="ml-auto px-2 py-1 bg-white rounded text-xs text-gray-600 shrink-0">修复</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-72 bg-white border-l border-gray-100 p-4 hidden lg:block">
          <h3 className="text-sm font-medium text-gray-900 mb-4">写作助手</h3>

          <div className="p-3 bg-blue-50 rounded-xl mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-900">快捷键</span>
            </div>
            <p className="text-xs text-blue-700">Ctrl + Space 唤起 AI 建议</p>
          </div>

          <h4 className="text-xs font-medium text-gray-700 mb-2">AI 写作建议</h4>
          <div className="space-y-2">
            <div className="p-2 bg-gray-50 rounded-xl text-xs text-gray-600">开头可以更吸引读者注意</div>
            <div className="p-2 bg-gray-50 rounded-xl text-xs text-gray-600">建议在第二段添加过渡句</div>
          </div>
        </div>
      </div>
    </div>
  )
}
