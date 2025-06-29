import { describe, it, expect } from 'vitest'
import { cmakeFormSchema, targetFormSchema } from '../src/schemas/cmake'

describe('CMakeスキーマバリデーション', () => {
  describe('targetFormSchema', () => {
    it('有効なターゲットデータを検証できる', () => {
      const validTarget = {
        name: 'my_app',
        kind: 'executable' as const,
        sources: ['main.cpp', 'utils.cpp'],
        includeDirs: ['include'],
        linkLibs: ['pthread'],
        compileDefs: ['DEBUG=1']
      }

      const result = targetFormSchema.safeParse(validTarget)
      expect(result.success).toBe(true)
    })

    it('無効なターゲット種別を拒否する', () => {
      const invalidTarget = {
        name: 'my_app',
        kind: 'invalid_kind',
        sources: [],
        includeDirs: [],
        linkLibs: [],
        compileDefs: []
      }

      const result = targetFormSchema.safeParse(invalidTarget)
      expect(result.success).toBe(false)
    })

    it('空のターゲット名を拒否する', () => {
      const invalidTarget = {
        name: '',
        kind: 'executable' as const,
        sources: [],
        includeDirs: [],
        linkLibs: [],
        compileDefs: []
      }

      const result = targetFormSchema.safeParse(invalidTarget)
      expect(result.success).toBe(false)
    })
  })

  describe('cmakeFormSchema', () => {
    it('有効なCMakeフォームデータを検証できる', () => {
      const validForm = {
        cmakeVersion: '3.29',
        projectName: 'TestProject',
        languages: ['CXX'] as const,
        targets: [],
        options: []
      }

      const result = cmakeFormSchema.safeParse(validForm)
      expect(result.success).toBe(true)
    })

    it('無効なCMakeバージョン形式を拒否する', () => {
      const invalidForm = {
        cmakeVersion: 'invalid',
        projectName: 'TestProject',
        languages: ['CXX'] as const,
        targets: [],
        options: []
      }

      const result = cmakeFormSchema.safeParse(invalidForm)
      expect(result.success).toBe(false)
    })

    it('空のプロジェクト名を拒否する', () => {
      const invalidForm = {
        cmakeVersion: '3.29',
        projectName: '',
        languages: ['CXX'] as const,
        targets: [],
        options: []
      }

      const result = cmakeFormSchema.safeParse(invalidForm)
      expect(result.success).toBe(false)
    })

    it('空の言語配列を拒否する', () => {
      const invalidForm = {
        cmakeVersion: '3.29',
        projectName: 'TestProject',
        languages: [],
        targets: [],
        options: []
      }

      const result = cmakeFormSchema.safeParse(invalidForm)
      expect(result.success).toBe(false)
    })

    it('複数の言語を許可する', () => {
      const validForm = {
        cmakeVersion: '3.29',
        projectName: 'TestProject',
        languages: ['C', 'CXX', 'CUDA'] as const,
        targets: [],
        options: []
      }

      const result = cmakeFormSchema.safeParse(validForm)
      expect(result.success).toBe(true)
    })
  })
})