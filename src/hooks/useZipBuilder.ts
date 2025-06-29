import { useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { FileNode } from '@/types'
import { renderCMakeTemplate } from '@/utils/template'

export function useZipBuilder() {
  const [isBuilding, setIsBuilding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const buildZip = async (treeData: FileNode[], projectName: string = 'project') => {
    try {
      setIsBuilding(true)
      setError(null)

      const zip = new JSZip()

      // 再帰的にファイルツリーを処理してZIPに追加
      const processNode = (node: FileNode, currentPath: string = '') => {
        const fullPath = currentPath ? `${currentPath}/${node.name}` : node.name

        if (node.type === 'folder') {
          // フォルダを作成
          zip.folder(fullPath)
          
          // 子要素を処理
          if (node.children) {
            node.children.forEach(child => processNode(child, fullPath))
          }
        } else if (node.type === 'cmake' && node.cmakeForm) {
          // CMakeLists.txtファイルを生成
          const content = renderCMakeTemplate(node.cmakeForm)
          zip.file(`${fullPath}`, content)
        }
      }

      // ルートノードから処理開始
      treeData.forEach(node => {
        if (node.name === 'プロジェクト' && node.children) {
          // ルートフォルダの場合は、その子要素から処理
          node.children.forEach(child => processNode(child))
        } else {
          processNode(node)
        }
      })

      // ZIPファイルを生成してダウンロード
      const blob = await zip.generateAsync({ type: 'blob' })
      saveAs(blob, `${projectName}.zip`)

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ZIP生成中にエラーが発生しました'
      setError(errorMessage)
      console.error('ZIP generation error:', err)
      return false
    } finally {
      setIsBuilding(false)
    }
  }

  const reset = () => {
    setError(null)
  }

  return {
    buildZip,
    isBuilding,
    error,
    reset
  }
}