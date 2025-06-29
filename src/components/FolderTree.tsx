import { useState } from 'react'
import { FileNode } from '@/types'
import { Button } from '@/components/ui/button'
import { FolderIcon, FileIcon, Plus, Trash2, Edit2 } from 'lucide-react'
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
          "flex items-center py-1 px-2 rounded cursor-pointer hover:bg-accent group",
          isSelected && "bg-accent",
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect(node)}
      >
        <div className="flex items-center flex-1 min-w-0">
          {node.type === 'folder' && node.children && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(!isOpen)
              }}
              className="mr-1 p-0.5 hover:bg-muted rounded"
            >
              {isOpen ? '▼' : '▶'}
            </button>
          )}
          
          {node.type === 'folder' ? (
            <FolderIcon className="w-4 h-4 mr-2 text-blue-500" />
          ) : (
            <FileIcon className="w-4 h-4 mr-2 text-green-500" />
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
              className="flex-1 px-1 py-0 text-sm bg-background border rounded"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="flex-1 truncate text-sm">{node.name}</span>
          )}
        </div>
        
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          {node.type === 'folder' && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddFolder()
                }}
                title="フォルダを追加"
              >
                <FolderIcon className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddCMake()
                }}
                title="CMakeLists.txtを追加"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
            title="名前を変更"
          >
            <Edit2 className="w-3 h-3" />
          </Button>
          {node.id !== 'root' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(node.id)
              }}
              title="削除"
            >
              <Trash2 className="w-3 h-3" />
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">プロジェクト構造</h2>
      </div>
      <div className="border rounded-lg p-2 bg-card min-h-[400px]">
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
      </div>
    </div>
  )
}