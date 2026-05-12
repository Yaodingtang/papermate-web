'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, X, CheckCircle, CloudUpload, File } from 'lucide-react'

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90))
    }, 200)

    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setSuccess(true)
      setTimeout(() => router.push('/bookshelf'), 1500)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-xl mb-4">
            <CloudUpload className="w-7 h-7 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">上传论文</h1>
          <p className="text-gray-500 mt-2">支持 PDF 格式，最大 50MB</p>
        </div>

        {/* 上传区域 */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative bg-white rounded-2xl border-2 transition-all ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : file
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {file ? (
            <div className="p-6">
              {/* 文件信息 */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{file.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB · PDF
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* 进度条 */}
              {uploading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">上传中...</span>
                    <span className="font-medium text-blue-600">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* 成功提示 */}
              {success && (
                <div className="mt-6 flex items-center gap-3 p-4 bg-green-100 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-green-700 font-medium">上传成功！正在跳转...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 text-center">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-all ${
                dragActive ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Upload className={`w-8 h-8 transition-colors ${
                  dragActive ? 'text-blue-600' : 'text-gray-400'
                }`} />
              </div>
              
              <p className="text-lg font-medium text-gray-900 mb-2">
                {dragActive ? '松开鼠标上传' : '拖拽文件到这里'}
              </p>
              <p className="text-gray-500 mb-6">或点击下方按钮选择文件</p>
              
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 cursor-pointer transition-colors">
                <File className="w-5 h-5" />
                选择文件
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* 按钮 */}
        {file && !success && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => router.back()}
              className="flex-1 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {uploading ? '上传中...' : '开始上传'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}