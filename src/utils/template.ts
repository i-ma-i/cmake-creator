import Handlebars from 'handlebars'
import { CMakeFormData } from '@/schemas/cmake'
import { cmakeTemplate } from '@/templates/cmake-template'

// テンプレートをコンパイル
const template = Handlebars.compile(cmakeTemplate)

export function renderCMakeTemplate(data: CMakeFormData): string {
  try {
    return template(data)
  } catch (error) {
    console.error('Template rendering error:', error)
    return `# テンプレートレンダリングエラー
# ${error instanceof Error ? error.message : 'Unknown error'}

cmake_minimum_required(VERSION ${data.cmakeVersion})
project(${data.projectName})
`
  }
}