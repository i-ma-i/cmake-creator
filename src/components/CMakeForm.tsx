import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileNode } from '@/types'
import { cmakeFormSchema, CMakeFormData } from '@/schemas/cmake'
import { Plus, Trash2, Eye, FolderOpen } from 'lucide-react'
import { useState } from 'react'
import PreviewModal from './PreviewModal'
import { getNodePath } from '@/utils/path'
import { cn } from '@/lib/utils'

interface CMakeFormProps {
  node: FileNode
  onUpdate: (node: FileNode) => void
  treeData: FileNode[]
}

const languageOptions = [
  { value: 'C', label: 'C' },
  { value: 'CXX', label: 'C++' },
  { value: 'CUDA', label: 'CUDA' }
]

const targetKindOptions = [
  { value: 'executable', label: '実行ファイル' },
  { value: 'static', label: '静的ライブラリ' },
  { value: 'shared', label: '動的ライブラリ' },
  { value: 'interface', label: 'インターフェースライブラリ' }
]

export default function CMakeForm({ node, onUpdate, treeData }: CMakeFormProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    node.cmakeForm?.languages || ['CXX']
  )

  // ファイルパスを取得
  const filePath = getNodePath(treeData, node.id)

  const form = useForm<CMakeFormData>({
    resolver: zodResolver(cmakeFormSchema),
    defaultValues: node.cmakeForm || {
      cmakeVersion: '3.29',
      projectName: '',
      languages: ['CXX'],
      targets: [],
      options: []
    }
  })

  const { fields: targetFields, append: appendTarget, remove: removeTarget } = useFieldArray({
    control: form.control,
    name: 'targets'
  })

  const optionFields = form.watch('options') || []
  const appendOption = (value: string) => {
    const currentOptions = form.getValues('options') || []
    form.setValue('options', [...currentOptions, value])
  }
  const removeOption = (index: number) => {
    const currentOptions = form.getValues('options') || []
    form.setValue('options', currentOptions.filter((_, i) => i !== index))
  }

  const onSubmit = (data: CMakeFormData) => {
    const updatedNode = {
      ...node,
      cmakeForm: data
    }
    onUpdate(updatedNode)
  }

  const handleLanguageToggle = (language: string) => {
    const newLanguages = selectedLanguages.includes(language)
      ? selectedLanguages.filter(l => l !== language)
      : [...selectedLanguages, language]
    
    if (newLanguages.length > 0) {
      setSelectedLanguages(newLanguages)
      form.setValue('languages', newLanguages as ('C' | 'CXX' | 'CUDA')[])
    }
  }

  const addTarget = () => {
    appendTarget({
      name: '',
      kind: 'executable',
      sources: [],
      includeDirs: [],
      linkLibs: [],
      compileDefs: []
    })
  }

  const addOption = () => {
    appendOption('')
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-semibold">CMake設定</h2>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
            >
              <Eye className="w-4 h-4" />
              プレビュー
            </Button>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              保存
            </Button>
          </div>
        </div>
        
        {/* ファイルパス表示 */}
        <div className="flex items-center gap-3 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-4 py-3 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
          <FolderOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="font-mono text-blue-800 dark:text-blue-200">
            {filePath || '/CMakeLists.txt'}
          </span>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* 基本設定 */}
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-border/50">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-pink-600"></div>
            基本設定
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cmakeVersion" className="text-sm font-medium">CMakeバージョン</Label>
              <Input
                id="cmakeVersion"
                placeholder="3.29"
                {...form.register('cmakeVersion')}
                className="bg-white dark:bg-slate-900 border-border/50 focus:border-blue-500 focus:ring-blue-500/20"
              />
              {form.formState.errors.cmakeVersion && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {form.formState.errors.cmakeVersion.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-sm font-medium">プロジェクト名</Label>
              <Input
                id="projectName"
                placeholder="MyProject"
                {...form.register('projectName')}
                className="bg-white dark:bg-slate-900 border-border/50 focus:border-blue-500 focus:ring-blue-500/20"
              />
              {form.formState.errors.projectName && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {form.formState.errors.projectName.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 言語設定 */}
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-border/50">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-orange-500 to-red-600"></div>
            対応言語
          </h3>
          <div className="flex gap-3">
            {languageOptions.map((lang) => (
              <Button
                key={lang.value}
                type="button"
                variant={selectedLanguages.includes(lang.value) ? "default" : "outline"}
                onClick={() => handleLanguageToggle(lang.value)}
                className={cn(
                  "text-sm font-medium transition-all duration-200",
                  selectedLanguages.includes(lang.value) 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg" 
                    : "hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20"
                )}
              >
                {lang.label}
              </Button>
            ))}
          </div>
          {form.formState.errors.languages && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              {form.formState.errors.languages.message}
            </p>
          )}
        </div>

        {/* ターゲット設定 */}
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-green-500 to-emerald-600"></div>
              ターゲット
            </h3>
            <Button 
              type="button" 
              variant="outline" 
              onClick={addTarget}
              className="flex items-center gap-2 hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-900/20"
            >
              <Plus className="w-4 h-4" />
              ターゲット追加
            </Button>
          </div>

          <div className="space-y-4">
            {targetFields.map((field, index) => (
              <div key={field.id} className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-5 border border-slate-200/50 dark:border-slate-600/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">ターゲット {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTarget(index)}
                    className="hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">名前</Label>
                    <Input
                      placeholder="my_target"
                      {...form.register(`targets.${index}.name`)}
                      className="bg-white dark:bg-slate-900 border-border/50 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">種類</Label>
                    <Select
                      value={form.watch(`targets.${index}.kind`)}
                      onValueChange={(value) => 
                        form.setValue(`targets.${index}.kind`, value as any)
                      }
                    >
                      <SelectTrigger className="bg-white dark:bg-slate-900 border-border/50 focus:border-blue-500 focus:ring-blue-500/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {targetKindOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">ソースファイル（改行区切り）</Label>
                  <textarea
                    className="w-full min-h-[80px] rounded-lg border border-border/50 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    placeholder="main.cpp&#10;utils.cpp"
                    value={form.watch(`targets.${index}.sources`)?.join('\n') || ''}
                    onChange={(e) => {
                      const sources = e.target.value.split('\n').filter(s => s.trim())
                      form.setValue(`targets.${index}.sources`, sources)
                    }}
                  />
                </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>インクルードディレクトリ（改行区切り）</Label>
                  <textarea
                    className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="include/&#10;third_party/"
                    value={form.watch(`targets.${index}.includeDirs`)?.join('\n') || ''}
                    onChange={(e) => {
                      const dirs = e.target.value.split('\n').filter(d => d.trim())
                      form.setValue(`targets.${index}.includeDirs`, dirs)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>リンクライブラリ（改行区切り）</Label>
                  <textarea
                    className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="pthread&#10;m"
                    value={form.watch(`targets.${index}.linkLibs`)?.join('\n') || ''}
                    onChange={(e) => {
                      const libs = e.target.value.split('\n').filter(l => l.trim())
                      form.setValue(`targets.${index}.linkLibs`, libs)
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>コンパイル定義（改行区切り）</Label>
                <textarea
                  className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="DEBUG=1&#10;VERSION=&quot;1.0&quot;"
                  value={form.watch(`targets.${index}.compileDefs`)?.join('\n') || ''}
                  onChange={(e) => {
                    const defs = e.target.value.split('\n').filter(d => d.trim())
                    form.setValue(`targets.${index}.compileDefs`, defs)
                  }}
                />
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* コンパイルオプション */}
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-yellow-500 to-orange-600"></div>
              コンパイルオプション
            </h3>
            <Button 
              type="button" 
              variant="outline" 
              onClick={addOption}
              className="flex items-center gap-2 hover:bg-yellow-50 hover:border-yellow-200 dark:hover:bg-yellow-900/20"
            >
              <Plus className="w-4 h-4" />
              オプション追加
            </Button>
          </div>

          <div className="space-y-3">
            {optionFields.map((_, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="-Wall"
                  {...form.register(`options.${index}`)}
                  className="flex-1 bg-white dark:bg-slate-900 border-border/50 focus:border-blue-500 focus:ring-blue-500/20"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(index)}
                  className="hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {optionFields.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                コンパイルオプションが設定されていません
              </p>
            )}
          </div>
        </div>
      </form>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        cmakeData={form.getValues()}
        filePath={filePath}
      />
    </div>
  )
}