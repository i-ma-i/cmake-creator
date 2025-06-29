import { useState, useEffect } from 'react'
import { FileNode } from './types'
import FolderTree from './components/FolderTree'
import CMakeForm from './components/CMakeForm'
import { Button } from './components/ui/button'
import { useZipBuilder } from './hooks/useZipBuilder'
import { useProjectPersistence } from './hooks/useProjectPersistence'
import { Download, Loader2, RotateCcw, Save } from 'lucide-react'

function App() {
  const [treeData, setTreeData] = useState<FileNode[]>([
    {
      id: 'root',
      name: 'プロジェクト',
      type: 'folder',
      children: []
    }
  ])
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const { buildZip, isBuilding, error } = useZipBuilder()
  const { 
    saveProject, 
    loadProject, 
    resetProject, 
    hasSavedProject, 
    getLastSavedTime 
  } = useProjectPersistence()

  // プロジェクト読み込み（初回起動時）
  useEffect(() => {
    const loadedProject = loadProject()
    if (loadedProject.treeData) {
      setTreeData(loadedProject.treeData)
      setLastSaved(getLastSavedTime())
      
      // 選択されていたノードを復元
      if (loadedProject.selectedNodeId) {
        const findNodeById = (nodes: FileNode[], id: string): FileNode | null => {
          for (const node of nodes) {
            if (node.id === id) return node
            if (node.children) {
              const found = findNodeById(node.children, id)
              if (found) return found
            }
          }
          return null
        }
        const nodeToSelect = findNodeById(loadedProject.treeData, loadedProject.selectedNodeId)
        if (nodeToSelect) {
          setSelectedNode(nodeToSelect)
        }
      }
    }
  }, [loadProject, getLastSavedTime])

  // データ変更時の自動保存
  useEffect(() => {
    const timer = setTimeout(() => {
      saveProject(treeData, selectedNode?.id)
      setLastSaved(new Date())
    }, 500) // 500ms のデバウンス

    return () => clearTimeout(timer)
  }, [treeData, selectedNode, saveProject])

  const handleDownload = async () => {
    const success = await buildZip(treeData, 'cmake-project')
    if (!success && error) {
      alert(`ZIP生成エラー: ${error}`)
    }
  }

  const handleReset = () => {
    if (confirm('プロジェクトをリセットしますか？保存されたデータは失われます。')) {
      resetProject()
      setTreeData([
        {
          id: 'root',
          name: 'プロジェクト',
          type: 'folder',
          children: []
        }
      ])
      setSelectedNode(null)
      setLastSaved(null)
    }
  }

  const handleManualSave = () => {
    saveProject(treeData, selectedNode?.id)
    setLastSaved(new Date())
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="w-1/2 border-r border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">CMake Creator</h1>
            {lastSaved && (
              <p className="text-xs text-muted-foreground mt-1">
                最終保存: {lastSaved.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSave}
              className="flex items-center gap-2"
              title="手動保存"
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-2"
              title="プロジェクトリセット"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleDownload}
              disabled={isBuilding}
              className="flex items-center gap-2"
            >
              {isBuilding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  ZIP
                </>
              )}
            </Button>
          </div>
        </div>
        <FolderTree
          data={treeData}
          onDataChange={setTreeData}
          onNodeSelect={setSelectedNode}
          selectedNode={selectedNode}
        />
      </div>
      <div className="w-1/2 p-4">
        {selectedNode?.type === 'cmake' ? (
          <CMakeForm
            node={selectedNode}
            treeData={treeData}
            onUpdate={(updatedNode) => {
              const updateTree = (nodes: FileNode[]): FileNode[] => {
                return nodes.map(node => {
                  if (node.id === updatedNode.id) {
                    return updatedNode
                  }
                  if (node.children) {
                    return { ...node, children: updateTree(node.children) }
                  }
                  return node
                })
              }
              setTreeData(updateTree(treeData))
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            CMakeLists.txtファイルを選択してください
          </div>
        )}
      </div>
    </div>
  )
}

export default App