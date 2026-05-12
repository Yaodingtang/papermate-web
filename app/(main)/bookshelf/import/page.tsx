'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Upload, FileText, Check, AlertCircle, ChevronRight, Download, ExternalLink, FolderOpen, Archive } from 'lucide-react'

type ImportSource = 'zotero' | 'mendeley' | 'endnote' | 'bibtex' | 'csv'

const importSources: Record<ImportSource, { name: string; icon: string; desc: string; steps: string[] }> = {
  zotero: {
    name: 'Zotero',
    icon: '📚',
    desc: '从 Zotero 导出后导入',
    steps: [
      '在 Zotero 中选择要导出的文献',
      '右键 → 导出文献 → 选择 BibTeX 格式',
      '保存 .bib 文件',
      '上传文件到下方',
    ],
  },
  mendeley: {
    name: 'Mendeley',
    icon: '📖',
    desc: '从 Mendeley 导出后导入',
    steps: [
      '在 Mendeley 中选择文献',
      'File → Export → BibTeX',
      '保存 .bib 文件',
      '上传文件到下方',
    ],
  },
  endnote: {
    name: 'EndNote',
    icon: '📓',
    desc: '从 EndNote 导出后导入',
    steps: [
      '在 EndNote 中选择文献',
      'File → Export → 选择 RIS 格式',
      '保存 .ris 文件',
      '上传文件到下方',
    ],
  },
  bibtex: {
    name: 'BibTeX 文件',
    icon: '📄',
    desc: '直接导入 BibTeX 文件',
    steps: [
      '准备 .bib 文件',
      '上传文件到下方',
    ],
  },
  csv: {
    name: 'CSV/Excel',
    icon: '📊',
    desc: '从表格文件导入',
    steps: [
      '准备 CSV 文件（需包含标题、作者、年份等列）',
      '上传文件到下方',
    ],
  },
}

export default function ImportPage() {
  const [selectedSource, setSelectedSource] = useState<ImportSource>('zotero')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: boolean; count: number; errors: string[] } | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      setUploadedFile(file)
      setImportResult(null)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setImportResult(null)
    }
  }

  const handleImport = async () => {
    if (!uploadedFile) return
    
    setImporting(true)
    // 模拟导入过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 模拟结果
    setImportResult({
      success: true,
      count: 23,
      errors: ['2 条记录缺少标题字段', '1 条记录作者信息不完整'],
    })
    setImporting(false)
  }

  const source = importSources[selectedSource]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/bookshelf" className="hover:text-gray-700">书架</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">导入文献</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">导入文献</h1>
          <p className="text-gray-500 text-sm mt-1">从其他文献管理工具导入你的文献库</p>
        </div>
      </div>

      {/* 内容 */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 选择来源 */}
        <div className="mb-8">
          <h2 className="font-medium text-gray-900 mb-4">选择导入来源</h2>
          <div className="grid grid-cols-5 gap-3">
            {(Object.keys(importSources) as ImportSource[]).map(key => {
              const s = importSources[key]
              return (
                <button
                  key={key}
                  onClick={() => setSelectedSource(key)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    selectedSource === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl mb-2 block">{s.icon}</span>
                  <p className={`text-sm font-medium ${selectedSource === key ? 'text-blue-700' : 'text-gray-900'}`}>
                    {s.name}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* 导入步骤 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-600" />
            导出步骤
          </h3>
          <ol className="space-y-2">
            {source.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium shrink-0">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 提示：导出时建议选择完整的文献信息，包括摘要、关键词、附件链接等
            </p>
          </div>
        </div>

        {/* 上传区域 */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">上传文件</h3>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
            }`}
          >
            {uploadedFile ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={() => { setUploadedFile(null); setImportResult(null) }}
                  className="ml-4 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">拖拽文件到此处，或点击选择文件</p>
                <p className="text-sm text-gray-400">支持 .bib, .ris, .csv 格式</p>
                <input
                  type="file"
                  accept=".bib,.ris,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  选择文件
                </label>
              </>
            )}
          </div>
        </div>

        {/* 导入结果 */}
        {importResult && (
          <div className={`mb-6 p-5 rounded-xl border ${
            importResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              {importResult.success ? (
                <Check className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
              <div>
                <p className={`font-medium ${importResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  导入完成
                </p>
                <p className="text-sm text-gray-600">
                  成功导入 {importResult.count} 篇文献
                </p>
              </div>
            </div>
            {importResult.errors.length > 0 && (
              <div className="mt-3 p-3 bg-white rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">警告信息：</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {importResult.errors.map((err, i) => (
                    <li key={i}>• {err}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex gap-3 mt-4">
              <Link href="/bookshelf" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                查看书架
              </Link>
              <button
                onClick={() => { setUploadedFile(null); setImportResult(null) }}
                className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50"
              >
                继续导入
              </button>
            </div>
          </div>
        )}

        {/* 导入按钮 */}
        {uploadedFile && !importResult && (
          <button
            onClick={handleImport}
            disabled={importing}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {importing ? (
              <>
                <span className="animate-spin">⏳</span>
                正在导入...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                开始导入
              </>
            )}
          </button>
        )}

        {/* 模板下载 */}
        <div className="mt-8 p-5 bg-gray-100 rounded-xl">
          <h3 className="font-medium text-gray-900 mb-3">📥 下载导入模板</h3>
          <p className="text-sm text-gray-600 mb-4">
            如果你想从 Excel 或其他表格工具导入，可以下载我们的模板文件
          </p>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              <Download className="w-4 h-4" />
              CSV 模板
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Excel 模板
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}