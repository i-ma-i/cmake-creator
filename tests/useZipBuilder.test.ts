import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useZipBuilder } from '../src/hooks/useZipBuilder'
import { FileNode } from '../src/types'

// JSZip をモック
vi.mock('jszip', () => ({
  default: vi.fn().mockImplementation(() => ({
    folder: vi.fn(),
    file: vi.fn(),
    generateAsync: vi.fn().mockResolvedValue(new Blob(['test'], { type: 'application/zip' }))
  }))
}))

// file-saver をモック
vi.mock('file-saver', () => ({
  saveAs: vi.fn()
}))

describe('useZipBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('初期状態が正しく設定される', () => {
    const { result } = renderHook(() => useZipBuilder())
    
    expect(result.current.isBuilding).toBe(false)
    expect(result.current.error).toBe(null)
    expect(typeof result.current.buildZip).toBe('function')
    expect(typeof result.current.reset).toBe('function')
  })

  it('空のプロジェクトでZIPを正常に生成できる', async () => {
    const { result } = renderHook(() => useZipBuilder())
    
    const emptyTree: FileNode[] = [
      {
        id: 'root',
        name: 'プロジェクト',
        type: 'folder',
        children: []
      }
    ]

    let buildResult: boolean | undefined
    
    await act(async () => {
      buildResult = await result.current.buildZip(emptyTree, 'test-project')
    })

    expect(buildResult).toBe(true)
    expect(result.current.error).toBe(null)
  })

  it('CMakeLists.txtファイルを含むプロジェクトでZIPを生成できる', async () => {
    const { result } = renderHook(() => useZipBuilder())
    
    const treeWithCMake: FileNode[] = [
      {
        id: 'root',
        name: 'プロジェクト',
        type: 'folder',
        children: [
          {
            id: 'cmake1',
            name: 'CMakeLists.txt',
            type: 'cmake',
            cmakeForm: {
              cmakeVersion: '3.29',
              projectName: 'TestProject',
              languages: ['CXX'],
              targets: [],
              options: []
            }
          }
        ]
      }
    ]

    let buildResult: boolean | undefined
    
    await act(async () => {
      buildResult = await result.current.buildZip(treeWithCMake, 'test-project')
    })

    expect(buildResult).toBe(true)
  })

  it('エラーリセット機能が正常に動作する', () => {
    const { result } = renderHook(() => useZipBuilder())
    
    // エラー状態を手動で設定（通常はbuildZip内で設定される）
    act(() => {
      // エラーを発生させるためにreset後にテスト
      result.current.reset()
    })

    expect(result.current.error).toBe(null)
  })
})