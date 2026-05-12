'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Bookmark, Share2, Download, ExternalLink, Clock, Users, Quote } from 'lucide-react'

const mockPaper = {
  id: 1,
  title: 'Attention Is All You Need',
  authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones'],
  year: 2017,
  venue: 'NeurIPS 2017',
  citations: 85000,
  abstract: '我们提出了一种新的简单网络架构——Transformer，完全基于注意力机制，摒弃了循环和卷积。在两个机器翻译任务上的实验表明，该模型在质量上优越，同时更易于并行化，训练时间显著减少。我们的模型在 WMT 2014 英德翻译任务上达到 28.4 BLEU，超越现有最佳结果。在 WMT 2014 英法翻译任务上，我们的模型在 8 个 GPU 上训练 3.5 天后达到新的单模型最佳 BLEU 分数 41.8。',
  keywords: ['Transformer', 'Attention', 'Neural Machine Translation', 'Deep Learning'],
  relatedPapers: [
    { id: 2, title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.', year: 2019 },
    { id: 3, title: 'GPT-3: Language Models are Few-Shot Learners', authors: 'Brown et al.', year: 2020 },
  ]
}

export default function PaperDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [saved, setSaved] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{mockPaper.title}</h1>
          
          {/* 作者 */}
          <p className="text-gray-600 mb-4">
            {mockPaper.authors.join(', ')}
          </p>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {mockPaper.year}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {mockPaper.venue}
            </span>
            <span className="flex items-center gap-1">
              <Quote className="w-4 h-4" />
              {mockPaper.citations.toLocaleString()} 引用
            </span>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 mt-6">
            <Link
              href={`/reading/${mockPaper.id}`}
              className="flex-1 py-2.5 bg-blue-600 text-white text-center font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              开始阅读
            </Link>
            <button
              onClick={() => setSaved(!saved)}
              className={`p-2.5 rounded-xl border transition-colors ${
                saved ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 内容 */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 摘要 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">摘要</h2>
          <p className="text-gray-700 leading-relaxed">{mockPaper.abstract}</p>
        </div>

        {/* 关键词 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">关键词</h2>
          <div className="flex flex-wrap gap-2">
            {mockPaper.keywords.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* 相关论文 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">相关论文</h2>
          <div className="space-y-3">
            {mockPaper.relatedPapers.map((paper) => (
              <Link
                key={paper.id}
                href={`/discover/${paper.id}`}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📄</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 line-clamp-1">{paper.title}</p>
                  <p className="text-sm text-gray-500">{paper.authors} · {paper.year}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-300" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}