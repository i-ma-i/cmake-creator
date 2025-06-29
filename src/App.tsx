import { useState, useEffect } from 'react'
import { FileNode } from './types'
import FolderTree from './components/FolderTree'
import CMakeForm from './components/CMakeForm'
import { Button } from './components/ui/button'
import { useZipBuilder } from './hooks/useZipBuilder'
import { useProjectPersistence } from './hooks/useProjectPersistence'
import { Download, Loader2, RotateCcw, Save, Code2, Sparkles } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-border/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CMake Creator
                </h1>
                <p className="text-sm text-muted-foreground">
                  視覚的なCMakeLists.txt生成ツール
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {lastSaved && (
                <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  最終保存: {lastSaved.toLocaleTimeString()}
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualSave}
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
                  title="手動保存"
                >
                  <Save className="w-4 h-4" />
                  保存
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200"
                  title="プロジェクトリセット"
                >
                  <RotateCcw className="w-4 h-4" />
                  リセット
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={isBuilding}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg"
                >
                  {isBuilding ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      ZIP ダウンロード
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Panel - Project Tree */}
          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-4 lg:mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-lg lg:text-xl font-semibold">プロジェクト構造</h2>
              </div>
              <FolderTree
                data={treeData}
                onDataChange={setTreeData}
                onNodeSelect={setSelectedNode}
                selectedNode={selectedNode}
              />
            </div>
          </div>

          {/* Right Panel - Configuration */}
          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-4 lg:p-6 min-h-[500px] lg:min-h-[600px]">
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
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="flex items-center justify-center w-12 lg:w-16 h-12 lg:h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 mb-4">
                    <Code2 className="w-6 lg:w-8 h-6 lg:h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-base lg:text-lg font-semibold text-foreground mb-2">
                    CMake設定を開始
                  </h3>
                  <p className="text-sm lg:text-base text-muted-foreground max-w-md">
                    左側のプロジェクトツリーでCMakeLists.txtファイルを選択して、
                    CMake設定を開始してください。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App