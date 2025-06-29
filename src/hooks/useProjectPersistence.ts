import { useEffect, useCallback } from 'react'
import { FileNode } from '@/types'
import { useLocalStorage } from './useLocalStorage'

interface SavedProject {
  treeData: FileNode[]
  selectedNodeId?: string
  lastSaved: string
  version: string // スキーマバージョン管理用
}

const STORAGE_KEY = 'cmake-creator-project'
const CURRENT_VERSION = '1.0.0'

// デフォルトプロジェクト構造
const defaultProject: SavedProject = {
  treeData: [
    {
      id: 'root',
      name: 'プロジェクト',
      type: 'folder',
      children: []
    }
  ],
  selectedNodeId: undefined,
  lastSaved: new Date().toISOString(),
  version: CURRENT_VERSION
}

export function useProjectPersistence() {
  const [savedProject, setSavedProject] = useLocalStorage<SavedProject>(
    STORAGE_KEY,
    defaultProject
  )

  // プロジェクトデータを保存
  const saveProject = useCallback((
    treeData: FileNode[],
    selectedNodeId?: string
  ) => {
    const projectToSave: SavedProject = {
      treeData,
      selectedNodeId,
      lastSaved: new Date().toISOString(),
      version: CURRENT_VERSION
    }
    setSavedProject(projectToSave)
  }, [setSavedProject])

  // プロジェクトデータを読み込み
  const loadProject = useCallback(() => {
    // バージョンチェック（将来的なマイグレーション用）
    if (savedProject.version !== CURRENT_VERSION) {
      console.warn(`Project version mismatch: ${savedProject.version} vs ${CURRENT_VERSION}`)
      // 必要に応じてマイグレーション処理を実装
    }

    return {
      treeData: savedProject.treeData,
      selectedNodeId: savedProject.selectedNodeId,
      lastSaved: savedProject.lastSaved
    }
  }, [savedProject])

  // プロジェクトをリセット
  const resetProject = useCallback(() => {
    setSavedProject(defaultProject)
  }, [setSavedProject])

  // プロジェクトが保存されているかチェック
  const hasSavedProject = useCallback(() => {
    return savedProject.treeData.length > 0 && 
           savedProject.treeData[0].children && 
           savedProject.treeData[0].children.length > 0
  }, [savedProject])

  // 最後の保存時刻を取得
  const getLastSavedTime = useCallback(() => {
    return new Date(savedProject.lastSaved)
  }, [savedProject])

  return {
    saveProject,
    loadProject,
    resetProject,
    hasSavedProject,
    getLastSavedTime,
    savedProject
  }
}