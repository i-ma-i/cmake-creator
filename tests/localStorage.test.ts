import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../src/hooks/useLocalStorage'

// localStorage をモック
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

describe('useLocalStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('初期値を正しく設定する', () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => 
      useLocalStorage('test-key', 'initial-value')
    )

    expect(result.current[0]).toBe('initial-value')
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key')
  })

  it('保存された値を正しく読み込む', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify('saved-value'))
    
    const { result } = renderHook(() => 
      useLocalStorage('test-key', 'initial-value')
    )

    expect(result.current[0]).toBe('saved-value')
  })

  it('値を正しく保存する', () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => 
      useLocalStorage('test-key', 'initial-value')
    )

    act(() => {
      result.current[1]('new-value')
    })

    expect(result.current[0]).toBe('new-value')
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'test-key', 
      JSON.stringify('new-value')
    )
  })

  it('関数による更新を正しく処理する', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(10))
    
    const { result } = renderHook(() => 
      useLocalStorage('counter', 0)
    )

    act(() => {
      result.current[1](prev => prev + 1)
    })

    expect(result.current[0]).toBe(11)
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'counter', 
      JSON.stringify(11)
    )
  })

  it('JSONパースエラーを適切に処理する', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-json')
    
    const { result } = renderHook(() => 
      useLocalStorage('test-key', 'fallback-value')
    )

    expect(result.current[0]).toBe('fallback-value')
  })

  it('オブジェクトを正しく保存・読み込みする', () => {
    const testObject = { name: 'test', value: 42 }
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(testObject))
    
    const { result } = renderHook(() => 
      useLocalStorage('object-key', {})
    )

    expect(result.current[0]).toEqual(testObject)

    act(() => {
      result.current[1]({ name: 'updated', value: 100 })
    })

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'object-key', 
      JSON.stringify({ name: 'updated', value: 100 })
    )
  })
})