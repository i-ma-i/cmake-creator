import { FileNode } from '@/types'

// ノードの相対パスを取得する関数
export function getNodePath(nodes: FileNode[], targetNodeId: string): string {
  const findPath = (currentNodes: FileNode[], path: string[] = []): string | null => {
    for (const node of currentNodes) {
      const currentPath = [...path, node.name]
      
      if (node.id === targetNodeId) {
        // ルートノード（"プロジェクト"）は除外して相対パスを作成
        const relativePath = currentPath.slice(1) // 最初の"プロジェクト"を除外
        return relativePath.length > 0 ? relativePath.join('/') : '/'
      }
      
      if (node.children) {
        const result = findPath(node.children, currentPath)
        if (result !== null) {
          return result
        }
      }
    }
    return null
  }

  return findPath(nodes) || ''
}

// ディレクトリパスのみを取得（ファイル名を除く）
export function getDirectoryPath(nodes: FileNode[], targetNodeId: string): string {
  const fullPath = getNodePath(nodes, targetNodeId)
  if (!fullPath || fullPath === '/') return '/'
  
  const pathParts = fullPath.split('/')
  if (pathParts.length <= 1) return '/'
  
  // 最後の要素（ファイル名）を除いたディレクトリパスを返す
  return pathParts.slice(0, -1).join('/') || '/'
}

// 親ディレクトリ名を取得
export function getParentDirectoryName(nodes: FileNode[], targetNodeId: string): string {
  const dirPath = getDirectoryPath(nodes, targetNodeId)
  if (dirPath === '/') return 'プロジェクトルート'
  
  const pathParts = dirPath.split('/')
  return pathParts[pathParts.length - 1] || 'プロジェクトルート'
}