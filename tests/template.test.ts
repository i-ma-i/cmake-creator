import { describe, it, expect } from 'vitest'
import { renderCMakeTemplate } from '../src/utils/template'
import { CMakeFormData } from '../src/schemas/cmake'

describe('renderCMakeTemplate', () => {
  it('基本的なプロジェクト設定をレンダリングできる', () => {
    const data: CMakeFormData = {
      cmakeVersion: '3.29',
      projectName: 'TestProject',
      languages: ['CXX'],
      targets: [],
      options: []
    }

    const result = renderCMakeTemplate(data)
    
    expect(result).toContain('cmake_minimum_required(VERSION 3.29)')
    expect(result).toContain('project(TestProject LANGUAGES CXX )')
  })

  it('複数の言語を正しくレンダリングできる', () => {
    const data: CMakeFormData = {
      cmakeVersion: '3.20',
      projectName: 'MultiLang',
      languages: ['C', 'CXX', 'CUDA'],
      targets: [],
      options: []
    }

    const result = renderCMakeTemplate(data)
    
    expect(result).toContain('project(MultiLang LANGUAGES C CXX CUDA )')
  })

  it('実行可能ファイルターゲットを正しくレンダリングできる', () => {
    const data: CMakeFormData = {
      cmakeVersion: '3.29',
      projectName: 'ExeProject',
      languages: ['CXX'],
      targets: [{
        name: 'my_app',
        kind: 'executable',
        sources: ['main.cpp', 'utils.cpp'],
        includeDirs: ['include'],
        linkLibs: ['pthread'],
        compileDefs: ['DEBUG=1']
      }],
      options: []
    }

    const result = renderCMakeTemplate(data)
    
    expect(result).toContain('add_executable(my_app')
    expect(result).toContain('main.cpp')
    expect(result).toContain('utils.cpp')
    expect(result).toContain('target_include_directories(my_app PUBLIC')
    expect(result).toContain('include')
    expect(result).toContain('target_link_libraries(my_app PUBLIC')
    expect(result).toContain('pthread')
    expect(result).toContain('target_compile_definitions(my_app PUBLIC')
    expect(result).toContain('DEBUG=1')
  })

  it('ライブラリターゲットを正しくレンダリングできる', () => {
    const data: CMakeFormData = {
      cmakeVersion: '3.29',
      projectName: 'LibProject',
      languages: ['CXX'],
      targets: [{
        name: 'my_lib',
        kind: 'static',
        sources: ['lib.cpp'],
        includeDirs: [],
        linkLibs: [],
        compileDefs: []
      }],
      options: []
    }

    const result = renderCMakeTemplate(data)
    
    expect(result).toContain('add_static(my_lib')
    expect(result).toContain('lib.cpp')
  })

  it('コンパイルオプションを正しくレンダリングできる', () => {
    const data: CMakeFormData = {
      cmakeVersion: '3.29',
      projectName: 'OptionsProject',
      languages: ['CXX'],
      targets: [],
      options: ['-Wall', '-O2']
    }

    const result = renderCMakeTemplate(data)
    
    expect(result).toContain('add_compile_options(-Wall)')
    expect(result).toContain('add_compile_options(-O2)')
  })

  it('空の配列を適切に処理できる', () => {
    const data: CMakeFormData = {
      cmakeVersion: '3.29',
      projectName: 'EmptyProject',
      languages: ['CXX'],
      targets: [{
        name: 'empty_target',
        kind: 'executable',
        sources: [],
        includeDirs: [],
        linkLibs: [],
        compileDefs: []
      }],
      options: []
    }

    const result = renderCMakeTemplate(data)
    
    expect(result).toContain('add_executable(empty_target')
    // 空の配列の場合、対応するセクションが生成されないことを確認
    expect(result).not.toContain('target_include_directories')
    expect(result).not.toContain('target_link_libraries')
    expect(result).not.toContain('target_compile_definitions')
  })
})