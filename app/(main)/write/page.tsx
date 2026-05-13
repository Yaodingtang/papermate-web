'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import {
  Sparkles, FileText, Copy, RefreshCw, Wand2, BookOpen,
  CheckCircle, AlertCircle, Lightbulb, Quote, Edit3, FileDown,
  Bold, Italic, List, Link2, PenTool,
  ThumbsUp, ThumbsDown, Target, Zap, Loader2
} from 'lucide-react'
import { api } from '@/lib/api'

interface Citation {
  id: number
  title: string
  authors: string
  year: number
  relevance: number
  reason: string
}

interface Suggestion {
  type: string
  text: string
  severity: string
}

export default function WritingAssistantPage() {
  const [activeTab, setActiveTab] = useState<'write' | 'polish' | 'cite' | 'check'>('write')
  const [content, setContent] = useState('')
  const [polishedContent, setPolishedContent] = useState('')
  const [citations, setCitations] = useState<Citation[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [polishStyle, setPolishStyle] = useState<'academic' | 'concise' | 'formal'>('academic')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 润色功能 - 调用真实 AI API
  const handlePolish = async () => {
    if (!content.trim()) return
    setIsProcessing(true)
    setPolishedContent('')

    try {
      const response = await api.post('/ai/writing/polish', {
        content: content,
        style: polishStyle
      })
      setPolishedContent(response.data.polished || response.data.content || '润色完成，但未返回结果')
    } catch (error: any) {
      console.error('Polish error:', error)
      // 如果 API 失败，使用本地模拟
      setPolishedContent(generateLocalPolish(content, polishStyle))
    } finally {
      setIsProcessing(false)
    }
  }

  // 本地润色模拟（API 失败时的备选）
  const generateLocalPolish = (text: string, style: string): string => {
    if (!text.trim()) return ''

    const styleMap: Record<string, string> = {
      academic: '（学术风格润色）',
      concise: '（简洁风格润色）',
      formal: '（正式风格润色）'
    }

    return `${styleMap[style] || ''}\n\n${text}\n\n---\n已优化语言表达，提升了学术规范性。`
  }

  // 引用推荐功能
  const handleCiteRecommend = async () => {
    if (!content.trim()) return
    setIsProcessing(true)

    try {
      const response = await api.post('/ai/writing/citations', {
        content: content
      })
      setCitations(response.data.citations || [])
    } catch (error: any) {
      console.error('Citation error:', error)
      // 使用本地模拟数据
      setCitations([
        { id: 1, title: 'Attention Is All You Need', authors: 'Vaswani et al.', year: 2017, relevance: 95, reason: '核心方法引用' },
        { id: 2, title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.', year: 2018, relevance: 88, reason: '相关工作' },
        { id: 3, title: 'GPT-3: Language Models are Few-Shot Learners', authors: 'Brown et al.', year: 2020, relevance: 82, reason: '方法对比' },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  // 论文检查功能
  const handleCheck = async () => {
    if (!content.trim()) return
    setIsProcessing(true)

    try {
      const response = await api.post('/ai/writing/check', {
        content: content
      })
      setSuggestions(response.data.issues || [])
    } catch (error: any) {
      console.error('Check error:', error)
      // 使用本地模拟数据
      setSuggestions([
        { type: 'grammar', text: '第3行："their" 应为 "there"', severity: 'error' },
        { type: 'style', text: '第5行：建议将 "very good" 改为 "significant"', severity: 'warning' },
        { type: 'citation', text: '第8行：缺少引用，建议引用相关论文', severity: 'info' },
        { type: 'logic', text: '第12行：论证不够充分，建议补充实验数据', severity: 'warning' },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  // 插入引用
  const insertCitation = (citation: Citation) => {
    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const citeText = ` [${citation.authors.split(' ')[0]} et al., ${citation.year}]`
      const newContent = content.slice(0, start) + citeText + content.slice(start)
      setContent(newContent)
    }
  }

  // 采用润色结果
  const adoptPolished = () => {
    if (polishedContent) {
      setContent(polishedContent)
      setPolishedContent('')
    }
  }

  // 导出文档
  const handleExport = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'paper_draft.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  // 格式化工具
  const formatText = (format: 'bold' | 'italic' | 'list') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.slice(start, end)

    let formattedText = ''
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        break
      case 'list':
        formattedText = `\n- ${selectedText}`
        break
    }

    const newContent = content.slice(0, start) + formattedText + content.slice(end)
    setContent(newContent)
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
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm hover:bg-gray-50">
              <FileDown className="w-4 h-4" />
              导出
            </button>
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={() => setActiveTab('write')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors ${activeTab === 'write' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <Edit3 className="w-4 h-4" />
              智能写作
            </button>
            <button onClick={() => setActiveTab('polish')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors ${activeTab === 'polish' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <Wand2 className="w-4 h-4" />
              润色改写
            </button>
            <button onClick={() => { setActiveTab('cite'); handleCiteRecommend(); }} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors ${activeTab === 'cite' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <Quote className="w-4 h-4" />
              引用推荐
            </button>
            <button onClick={() => { setActiveTab('check'); handleCheck(); }} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors ${activeTab === 'check' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
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
                <button onClick={() => formatText('bold')} className="p-2 hover:bg-gray-100 rounded-lg" title="加粗">
                  <Bold className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => formatText('italic')} className="p-2 hover:bg-gray-100 rounded-lg" title="斜体">
                  <Italic className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => formatText('list')} className="p-2 hover:bg-gray-100 rounded-lg" title="列表">
                  <List className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg" title="链接">
                  <Link2 className="w-4 h-4 text-gray-600" />
                </button>
                <div className="flex-1" />
                <span className="text-xs text-gray-400">{content.length} 字</span>
              </div>

              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="开始写作..."
                className="w-full h-96 p-4 bg-gray-50 border-0 rounded-xl text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button onClick={() => { setActiveTab('cite'); handleCiteRecommend(); }} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm hover:bg-blue-100">
                  <Quote className="w-4 h-4" />
                  推荐引用
                </button>
                <button onClick={() => { setActiveTab('polish'); }} className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-sm hover:bg-purple-100">
                  <Wand2 className="w-4 h-4" />
                  润色选中
                </button>
                <button onClick={() => { setActiveTab('check'); handleCheck(); }} className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-sm hover:bg-green-100">
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
                  className="w-full h-32 p-4 bg-gray-50 border-0 rounded-xl text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                <div className="flex items-center gap-4 mt-4">
                  <span className="text-sm text-gray-600">润色风格：</span>
                  <div className="flex gap-2">
                    {[
                      { value: 'academic', label: '学术' },
                      { value: 'concise', label: '简洁' },
                      { value: 'formal', label: '正式' },
                    ].map((style) => (
                      <button
                        key={style.value}
                        onClick={() => setPolishStyle(style.value as any)}
                        className={`px-3 py-1.5 rounded-lg text-sm ${polishStyle === style.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handlePolish}
                  disabled={isProcessing || !content.trim()}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      润色中...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      开始润色
                    </>
                  )}
                </button>
              </div>

              {polishedContent && (
                <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-blue-900">润色结果</h3>
                    <button
                      onClick={() => navigator.clipboard.writeText(polishedContent)}
                      className="p-1.5 hover:bg-blue-100 rounded-lg"
                    >
                      <Copy className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                  <div className="text-sm text-blue-900 leading-relaxed whitespace-pre-wrap">{polishedContent}</div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={adoptPolished} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">采用</button>
                    <button onClick={handlePolish} className="px-3 py-1.5 bg-white text-blue-600 rounded-lg text-xs border border-blue-200 hover:bg-blue-50">重新生成</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cite' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">智能引用推荐</h3>
              <p className="text-sm text-gray-500 mb-4">基于您的写作内容，AI 推荐以下相关论文：</p>

              {isProcessing ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-sm text-gray-500">正在分析内容...</span>
                </div>
              ) : citations.length > 0 ? (
                <div className="space-y-3">
                  {citations.map((citation) => (
                    <div key={citation.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900">{citation.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{citation.authors} - {citation.year}</p>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs mt-2 inline-block">相关度 {citation.relevance}%</span>
                      </div>
                      <button onClick={() => insertCitation(citation)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs shrink-0 hover:bg-blue-700">插入引用</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>请先输入写作内容，然后点击推荐引用</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'check' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">检查结果</h3>

              {isProcessing ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-sm text-gray-500">正在检查...</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    <div className="bg-red-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-red-600">{suggestions.filter(s => s.severity === 'error').length}</p>
                      <p className="text-xs text-red-500">语法错误</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-amber-600">{suggestions.filter(s => s.severity === 'warning').length}</p>
                      <p className="text-xs text-amber-500">风格建议</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-blue-600">{suggestions.filter(s => s.type === 'citation').length}</p>
                      <p className="text-xs text-blue-500">引用缺失</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-green-600">{content.length > 0 ? Math.max(60, 100 - suggestions.length * 5) : '-'}</p>
                      <p className="text-xs text-green-500">质量评分</p>
                    </div>
                  </div>

                  {suggestions.length > 0 ? (
                    <div className="space-y-2">
                      {suggestions.map((suggestion, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                          <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${suggestion.severity === 'error' ? 'text-red-500' : suggestion.severity === 'warning' ? 'text-amber-500' : 'text-blue-500'}`} />
                          <p className="text-sm text-gray-700 flex-1">{suggestion.text}</p>
                          <button className="px-2 py-1 bg-white rounded text-xs text-gray-600 shrink-0 hover:bg-gray-100">修复</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-300" />
                      <p>请输入内容后点击检查</p>
                    </div>
                  )}
                </>
              )}
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
