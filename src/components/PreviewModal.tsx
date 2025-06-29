import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CMakeFormData } from '@/schemas/cmake'
import { renderCMakeTemplate } from '@/utils/template'
import { Copy, Check, FolderOpen, Code2, Download } from 'lucide-react'
import { useState } from 'react'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  cmakeData: CMakeFormData
  filePath?: string
}

export default function PreviewModal({ isOpen, onClose, cmakeData, filePath }: PreviewModalProps) {
  const [copied, setCopied] = useState(false)

  const renderedContent = renderCMakeTemplate(cmakeData)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(renderedContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-border/50">
        <DialogHeader className="pb-4 border-b border-border/50">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col items-start gap-1">
                <span className="text-xl font-semibold">CMakeLists.txt プレビュー</span>
                {filePath && (
                  <div className="flex items-center gap-2 text-sm font-normal bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                    <FolderOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="font-mono text-blue-800 dark:text-blue-200">{filePath}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  copied 
                    ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' 
                    : 'hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    コピー済み
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    コピー
                  </>
                )}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto mt-4">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-border/50 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 px-4 py-2 border-b border-border/50">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Download className="w-4 h-4" />
                Generated CMakeLists.txt
              </div>
            </div>
            <pre className="p-6 text-sm font-mono whitespace-pre-wrap overflow-auto text-slate-800 dark:text-slate-200 leading-relaxed">
              {renderedContent}
            </pre>
          </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t border-border/50">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="hover:bg-slate-50 hover:border-slate-200 dark:hover:bg-slate-800"
          >
            閉じる
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}