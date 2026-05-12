'use client'

import { useEffect, useCallback } from 'react'

interface ShortcutConfig {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
  description: string
}

export function useShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // 忽略输入框中的快捷键（除了特定的全局快捷键）
    const target = event.target as HTMLElement
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

    for (const shortcut of shortcuts) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
      const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
      const altMatch = shortcut.alt ? event.altKey : !event.altKey

      // 对于输入框，只允许带 Ctrl/Cmd 的快捷键
      if (isInput && !shortcut.ctrl) continue

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault()
        shortcut.action()
        return
      }
    }
  }, [shortcuts])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

// 阅读页快捷键
export const readingShortcuts = {
  nextPage: { key: 'ArrowRight', description: '下一页' },
  prevPage: { key: 'ArrowLeft', description: '上一页' },
  zoomIn: { key: '=', ctrl: true, description: '放大' },
  zoomOut: { key: '-', ctrl: true, description: '缩小' },
  highlight: { key: 'h', description: '高亮选中文字' },
  note: { key: 'n', description: '添加笔记' },
  bookmark: { key: 'b', description: '添加书签' },
  search: { key: 'f', ctrl: true, description: '搜索' },
  toggleOutline: { key: 'o', description: '切换大纲' },
  toggleAI: { key: 'a', description: '切换AI助手' },
  escape: { key: 'Escape', description: '关闭弹窗' },
}

// 通用快捷键
export const globalShortcuts = {
  search: { key: 'k', ctrl: true, description: '全局搜索' },
  help: { key: '?', shift: true, description: '显示快捷键帮助' },
}

interface ShortcutHelpProps {
  isOpen: boolean
  onClose: () => void
  shortcuts: Record<string, { key: string; ctrl?: boolean; shift?: boolean; description: string }>
  title?: string
}

export function ShortcutHelp({ isOpen, onClose, shortcuts, title = '快捷键' }: ShortcutHelpProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="space-y-2">
          {Object.entries(shortcuts).map(([name, config]) => (
            <div key={name} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">{config.description}</span>
              <div className="flex items-center gap-1">
                {config.ctrl && (
                  <>
                    <kbd className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-mono">Ctrl</kbd>
                    <span className="text-gray-400">+</span>
                  </>
                )}
                {config.shift && (
                  <>
                    <kbd className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-mono">Shift</kbd>
                    <span className="text-gray-400">+</span>
                  </>
                )}
                <kbd className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-mono uppercase">
                  {config.key === 'ArrowRight' ? '→' : 
                   config.key === 'ArrowLeft' ? '←' :
                   config.key === 'Escape' ? 'Esc' :
                   config.key}
                </kbd>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-400 text-center">按 Esc 关闭</p>
      </div>
    </div>
  )
}