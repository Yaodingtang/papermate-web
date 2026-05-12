'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Check, Download, FileText, BookOpen, ChevronRight, ExternalLink, Quote, FileCode, FileSpreadsheet } from 'lucide-react'

const mockPaper = {
  id: 1,
  title: 'Attention Is All You Need',
  authors: [
    { given: 'Ashish', family: 'Vaswani' },
    { given: 'Noam', family: 'Shazeer' },
    { given: 'Niki', family: 'Parmar' },
    { given: 'Jakob', family: 'Uszkoreit' },
    { given: 'Llion', family: 'Jones' },
    { given: 'Aidan N.', family: 'Gomez' },
    { given: 'Łukasz', family: 'Kaiser' },
    { given: 'Illia', family: 'Polosukhin' },
  ],
  year: 2017,
  venue: 'Advances in Neural Information Processing Systems',
  venueShort: 'NeurIPS',
  volume: 30,
  pages: '5998-6008',
  doi: '10.48550/arXiv.1706.03762',
  url: 'https://arxiv.org/abs/1706.03762',
  arxivId: '1706.03762',
}

// 引用格式生成函数
const citationFormats = {
  bibtex: (paper: typeof mockPaper) => {
    const authorStr = paper.authors.map(a => `${a.family}, ${a.given}`).join(' and ')
    const key = paper.authors[0].family.toLowerCase() + paper.year
    return `@inproceedings{${key},
  title     = {${paper.title}},
  author    = {${authorStr}},
  booktitle = {${paper.venue}},
  year      = {${paper.year}},
  volume    = {${paper.volume}},
  pages     = {${paper.pages}},
  doi       = {${paper.doi}},
  url       = {${paper.url}}
}`
  },

  endnote: (paper: typeof mockPaper) => {
    const authorStr = paper.authors.map(a => `${a.family}, ${a.given}`).join('; ')
    return `%0 Conference Proceedings
%T ${paper.title}
%A ${authorStr}
%D ${paper.year}
%B ${paper.venue}
%V ${paper.volume}
%P ${paper.pages}
%R ${paper.doi}
%U ${paper.url}`
  },

  apa: (paper: typeof mockPaper) => {
    const authors = paper.authors.length > 2 
      ? `${paper.authors[0].family}, ${paper.authors[0].given[0]}. et al.`
      : paper.authors.map((a, i) => `${a.family}, ${a.given[0]}.`).join(' & ')
    return `${authors} (${paper.year}). ${paper.title}. ${paper.venue}, ${paper.volume}, ${paper.pages}. ${paper.doi}`
  },

  mla: (paper: typeof mockPaper) => {
    const authors = paper.authors.length > 2 
      ? `${paper.authors[0].family}, ${paper.authors[0].given}, et al.`
      : paper.authors.map((a, i) => i === 0 ? `${a.family}, ${a.given}.` : `${a.given} ${a.family}`).join(', ')
    return `${authors} "${paper.title}." ${paper.venue}, vol. ${paper.volume}, ${paper.year}, pp. ${paper.pages}.`
  },

  ieee: (paper: typeof mockPaper) => {
    const authors = paper.authors.length > 6 
      ? paper.authors.slice(0, 6).map(a => `${a.given[0]}. ${a.family}`).join(', ') + ', et al.'
      : paper.authors.map((a, i) => `${a.given[0]}. ${a.family}`).join(', ')
    return `[1] ${authors}, "${paper.title}," in ${paper.venue}, vol. ${paper.volume}, pp. ${paper.pages}, ${paper.year}, doi: ${paper.doi}.`
  },

  chicago: (paper: typeof mockPaper) => {
    const authors = paper.authors.length > 2 
      ? `${paper.authors[0].family}, ${paper.authors[0].given}, et al.`
      : paper.authors.map((a, i) => i === 0 ? `${a.family}, ${a.given}.` : `${a.given} ${a.family}`).join(', ')
    return `${authors}. "${paper.title}." In ${paper.venue}, ${paper.volume}:${paper.pages}. ${paper.year}.`
  },

  harvard: (paper: typeof mockPaper) => {
    const authors = paper.authors.length > 3 
      ? `${paper.authors[0].family}, ${paper.authors[0].given[0]}. et al.`
      : paper.authors.map(a => `${a.family}, ${a.given[0]}.`).join(', ')
    return `${authors} (${paper.year}) '${paper.title}', ${paper.venue}, ${paper.volume}, pp. ${paper.pages}.`
  },

  ris: (paper: typeof mockPaper) => {
    const authorStr = paper.authors.map(a => `AU  - ${a.given} ${a.family}`).join('\n')
    return `TY  - CONF
TI  - ${paper.title}
${authorStr}
PY  - ${paper.year}
T2  - ${paper.venue}
VL  - ${paper.volume}
SP  - ${paper.pages}
DO  - ${paper.doi}
UR  - ${paper.url}
ER  -`
  },
}

const formatConfig = {
  bibtex: { label: 'BibTeX', icon: FileCode, desc: 'LaTeX 文献管理格式' },
  endnote: { label: 'EndNote', icon: FileSpreadsheet, desc: 'EndNote 导入格式' },
  apa: { label: 'APA', icon: Quote, desc: '美国心理学会格式' },
  mla: { label: 'MLA', icon: Quote, desc: '现代语言协会格式' },
  ieee: { label: 'IEEE', icon: Quote, desc: '电气电子工程师学会格式' },
  chicago: { label: 'Chicago', icon: Quote, desc: '芝加哥格式' },
  harvard: { label: 'Harvard', icon: Quote, desc: '哈佛格式' },
  ris: { label: 'RIS', icon: FileSpreadsheet, desc: '通用文献交换格式' },
}

export default function CitationPage() {
  const [selectedFormat, setSelectedFormat] = useState<keyof typeof citationFormats>('bibtex')
  const [copied, setCopied] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  const citation = citationFormats[selectedFormat](mockPaper)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(citation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const extension = selectedFormat === 'bibtex' ? 'bib' : selectedFormat === 'ris' ? 'ris' : 'txt'
    const blob = new Blob([citation], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `citation.${extension}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/bookshelf" className="hover:text-gray-700">书架</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/reading/${mockPaper.id}`} className="hover:text-gray-700">{mockPaper.title}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">引用导出</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">引用导出</h1>
          <p className="text-gray-500 text-sm mt-1">选择格式，一键复制或下载引用</p>
        </div>
      </div>

      {/* 内容 */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 论文信息 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">{mockPaper.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {mockPaper.authors.map(a => a.family).join(', ')} · {mockPaper.year}
              </p>
              <p className="text-sm text-gray-500">{mockPaper.venue}</p>
            </div>
            <Link 
              href={`/reading/${mockPaper.id}`}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200"
            >
              <BookOpen className="w-4 h-4" />
              阅读
            </Link>
          </div>
        </div>

        {/* 格式选择 */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">选择引用格式</h3>
          <div className="grid grid-cols-4 gap-3">
            {(Object.keys(formatConfig) as Array<keyof typeof formatConfig>).map(format => {
              const config = formatConfig[format]
              return (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedFormat === format
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <config.icon className={`w-5 h-5 mb-2 ${selectedFormat === format ? 'text-blue-600' : 'text-gray-400'}`} />
                  <p className={`font-medium ${selectedFormat === format ? 'text-blue-700' : 'text-gray-900'}`}>
                    {config.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{config.desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* 引用预览 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">{formatConfig[selectedFormat].label} 格式</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? '已复制' : '复制'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                下载
              </button>
            </div>
          </div>
          <pre className="p-4 text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
            {citation}
          </pre>
        </div>

        {/* 批量导出 */}
        <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <h3 className="font-medium text-gray-900 mb-2">批量导出</h3>
          <p className="text-sm text-gray-600 mb-4">
            导出书架中所有论文的引用，或选择特定文件夹导出
          </p>
          <button 
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            批量导出引用
          </button>
        </div>

        {/* 使用说明 */}
        <div className="mt-6 p-5 bg-white rounded-xl border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">📖 使用说明</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <p className="font-medium text-gray-700">BibTeX / RIS / EndNote</p>
              <p>用于文献管理软件（Zotero、Mendeley、EndNote）导入</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">APA / MLA / IEEE / Chicago / Harvard</p>
              <p>用于论文写作时直接粘贴到参考文献部分</p>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <p className="text-gray-500">💡 提示：点击"复制"按钮可一键复制到剪贴板，直接粘贴到你的论文中</p>
            </div>
          </div>
        </div>
      </div>

      {/* 批量导出弹窗 */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">批量导出引用</h2>
            <div className="space-y-3">
              <button className="w-full p-4 text-left border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50">
                <p className="font-medium text-gray-900">导出全部论文</p>
                <p className="text-sm text-gray-500">共 23 篇论文</p>
              </button>
              <button className="w-full p-4 text-left border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50">
                <p className="font-medium text-gray-900">导出"Transformer"文件夹</p>
                <p className="text-sm text-gray-500">共 8 篇论文</p>
              </button>
              <button className="w-full p-4 text-left border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50">
                <p className="font-medium text-gray-900">导出已读论文</p>
                <p className="text-sm text-gray-500">共 15 篇论文</p>
              </button>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowExportModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm">取消</button>
              <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm">导出</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}