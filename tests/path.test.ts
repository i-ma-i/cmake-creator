import { describe, it, expect } from 'vitest'
import { getNodePath, getDirectoryPath, getParentDirectoryName } from '../src/utils/path'
import { FileNode } from '../src/types'

describe('パスユーティリティ', () => {
  const sampleTree: FileNode[] = [
    {
      id: 'root',
      name: 'プロジェクト',
      type: 'folder',
      children: [
        {
          id: 'src',
          name: 'src',
          type: 'folder',
          children: [
            {
              id: 'main-cmake',
              name: 'CMakeLists.txt',
              type: 'cmake'
            },
            {
              id: 'main',
              name: 'main',
              type: 'folder',
              children: [
                {
                  id: 'main-main-cmake',
                  name: 'CMakeLists.txt',
                  type: 'cmake'
                }
              ]
            }
          ]
        },
        {
          id: 'root-cmake',
          name: 'CMakeLists.txt',
          type: 'cmake'
        }
      ]
    }
  ]

  describe('getNodePath', () => {
    it('ルートのCMakeLists.txtパスを正しく取得できる', () => {
      const path = getNodePath(sampleTree, 'root-cmake')
      expect(path).toBe('CMakeLists.txt')
    })

    it('srcディレクトリのCMakeLists.txtパスを正しく取得できる', () => {
      const path = getNodePath(sampleTree, 'main-cmake')
      expect(path).toBe('src/CMakeLists.txt')
    })

    it('ネストしたディレクトリのCMakeLists.txtパスを正しく取得できる', () => {
      const path = getNodePath(sampleTree, 'main-main-cmake')
      expect(path).toBe('src/main/CMakeLists.txt')
    })

    it('存在しないノードIDに対して空文字を返す', () => {
      const path = getNodePath(sampleTree, 'non-existent')
      expect(path).toBe('')
    })
  })

  describe('getDirectoryPath', () => {
    it('ルートのCMakeLists.txtのディレクトリパスを正しく取得できる', () => {
      const dirPath = getDirectoryPath(sampleTree, 'root-cmake')
      expect(dirPath).toBe('/')
    })

    it('srcディレクトリのCMakeLists.txtのディレクトリパスを正しく取得できる', () => {
      const dirPath = getDirectoryPath(sampleTree, 'main-cmake')
      expect(dirPath).toBe('src')
    })

    it('ネストしたディレクトリのCMakeLists.txtのディレクトリパスを正しく取得できる', () => {
      const dirPath = getDirectoryPath(sampleTree, 'main-main-cmake')
      expect(dirPath).toBe('src/main')
    })
  })

  describe('getParentDirectoryName', () => {
    it('ルートのCMakeLists.txtの親ディレクトリ名を正しく取得できる', () => {
      const parentName = getParentDirectoryName(sampleTree, 'root-cmake')
      expect(parentName).toBe('プロジェクトルート')
    })

    it('srcディレクトリのCMakeLists.txtの親ディレクトリ名を正しく取得できる', () => {
      const parentName = getParentDirectoryName(sampleTree, 'main-cmake')
      expect(parentName).toBe('src')
    })

    it('ネストしたディレクトリのCMakeLists.txtの親ディレクトリ名を正しく取得できる', () => {
      const parentName = getParentDirectoryName(sampleTree, 'main-main-cmake')
      expect(parentName).toBe('main')
    })
  })
})