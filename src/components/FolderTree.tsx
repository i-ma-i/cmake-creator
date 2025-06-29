import { useState } from 'react'
import { FileNode } from '@/types'
import { Button } from '@/components/ui/button'
import { FolderIcon, FileIcon, Plus, Trash2, Edit2, FolderPlus, ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FolderTreeProps {
  data: FileNode[]
  onDataChange: (data: FileNode[]) => void
  onNodeSelect: (node: FileNode | null) => void
  selectedNode: FileNode | null
}

interface TreeNodeProps {
  node: FileNode
  level: number
  onSelect: (node: FileNode) => void
  onUpdate: (updatedNode: FileNode) => void
  onDelete: (nodeId: string) => void
  selectedNodeId?: string
}

function TreeNode({ node, level, onSelect, onUpdate, onDelete, selectedNodeId }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(node.name)
  const isSelected = selectedNodeId === node.id

  const handleAddFolder = () => {
    const newFolder: FileNode = {
      id: `folder-${Date.now()}`,
      name: '新しいフォルダ',
      type: 'folder',
      children: [],
      parentId: node.id
    }
    
    const updatedNode = {
      ...node,
      children: [...(node.children || []), newFolder]
    }
    onUpdate(updatedNode)
  }

  const handleAddCMake = () => {
    const newCMake: FileNode = {
      id: `cmake-${Date.now()}`,
      name: 'CMakeLists.txt',
      type: 'cmake' as const,
      parentId: node.id,
      cmakeForm: {
        cmakeVersion: '3.29',
        projectName: '',
        languages: ['CXX'],
        targets: [],
        options: []
      }
    }
    
    const updatedNode = {
      ...node,
      children: [...(node.children || []), newCMake]
    }
    onUpdate(updatedNode)
  }

  const handleSaveEdit = () => {
    if (editName.trim()) {
      onUpdate({ ...node, name: editName.trim() })
    }
    setIsEditing(false)
  }

  const handleChildUpdate = (updatedChild: FileNode) => {
    const updatedChildren = (node.children || []).map(child =>
      child.id === updatedChild.id ? updatedChild : child
    )
    onUpdate({ ...node, children: updatedChildren })
  }

  const handleChildDelete = (childId: string) => {
    const updatedChildren = (node.children || []).filter(child => child.id !== childId)
    onUpdate({ ...node, children: updatedChildren })
  }

  return (
    <div className="select-none">
      <div 
        className={cn(
          "flex items-center py-2 px-3 rounded-lg cursor-pointer group transition-all duration-200",
          "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20",
          isSelected && "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-sm",
          node.type === 'cmake' && "border-l-2 border-green-400"
        )}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
        onClick={() => onSelect(node)}
      >
        <div className="flex items-center flex-1 min-w-0">
          {node.type === 'folder' && node.children && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(!isOpen)
              }}
              className="mr-2 p-1 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded transition-colors"
            >
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              )}
            </button>
          )}
          
          {node.type === 'folder' ? (
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 mr-3">
              <FolderIcon className="w-3 h-3 text-white" />
            </div>
          ) : (
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 mr-3">
              <FileIcon className="w-3 h-3 text-white" />
            </div>
          )}
          
          {isEditing ? (
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit()
                if (e.key === 'Escape') {
                  setIsEditing(false)
                  setEditName(node.name)
                }
              }}
              className="flex-1 px-2 py-1 text-sm bg-white dark:bg-slate-800 border border-border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="flex-1 truncate text-sm font-medium">{node.name}</span>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {node.type === 'folder' && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddFolder()
                }}
                title="フォルダを追加"
              >
                <FolderPlus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-green-100 dark:hover:bg-green-900/30"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddCMake()
                }}
                title="CMakeLists.txtを追加"
              >
                <Plus className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
            title="名前を変更"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          </Button>
          {node.id !== 'root' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-red-100 dark:hover:bg-red-900/30"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(node.id)
              }}
              title="削除"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            </Button>
          )}
        </div>
      </div>
      
      {node.type === 'folder' && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              onUpdate={handleChildUpdate}
              onDelete={handleChildDelete}
              selectedNodeId={selectedNodeId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function FolderTree({ data, onDataChange, onNodeSelect, selectedNode }: FolderTreeProps) {
  const handleNodeUpdate = (updatedNode: FileNode) => {
    const updatedData = data.map(node => 
      node.id === updatedNode.id ? updatedNode : node
    )
    onDataChange(updatedData)
  }

  const handleNodeDelete = (nodeId: string) => {
    const updatedData = data.filter(node => node.id !== nodeId)
    onDataChange(updatedData)
    if (selectedNode?.id === nodeId) {
      onNodeSelect(null)
    }
  }

  return (
    <div className="space-y-1">
      {data.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          onSelect={onNodeSelect}
          onUpdate={handleNodeUpdate}
          onDelete={handleNodeDelete}
          selectedNodeId={selectedNode?.id}
        />
      ))}
      {data.length === 1 && data[0].children?.length === 0 && (
        <div className="text-center py-12">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 mx-auto mb-4">
            <FolderPlus className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </div>
          <h3 className="font-medium text-foreground mb-2">プロジェクトが空です</h3>
          <p className="text-sm text-muted-foreground">
            フォルダアイコンをクリックして<br />
            項目を追加してください
          </p>
        </div>
      )}
    </div>
  )
}