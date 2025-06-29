import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CMakeFormData } from '@/schemas/cmake'
import { renderCMakeTemplate } from '@/utils/template'
import { Copy, Check, FolderOpen } from 'lucide-react'
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
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex flex-col items-start gap-2">
              <span>CMakeLists.txt プレビュー</span>
              {filePath && (
                <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                  <FolderOpen className="w-4 h-4" />
                  <span className="font-mono">{filePath}</span>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-2"
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
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          <pre className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-auto">
            {renderedContent}
          </pre>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            閉じる
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}