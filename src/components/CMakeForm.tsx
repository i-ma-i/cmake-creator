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

  const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
    control: form.control,
    name: 'options'
  })

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
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">CMake設定</h2>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              プレビュー
            </Button>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
            >
              保存
            </Button>
          </div>
        </div>
        
        {/* ファイルパス表示 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
          <FolderOpen className="w-4 h-4" />
          <span className="font-mono">
            {filePath || '/CMakeLists.txt'}
          </span>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cmakeVersion">CMakeバージョン</Label>
            <Input
              id="cmakeVersion"
              placeholder="3.29"
              {...form.register('cmakeVersion')}
            />
            {form.formState.errors.cmakeVersion && (
              <p className="text-sm text-destructive">
                {form.formState.errors.cmakeVersion.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectName">プロジェクト名</Label>
            <Input
              id="projectName"
              placeholder="MyProject"
              {...form.register('projectName')}
            />
            {form.formState.errors.projectName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.projectName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>言語</Label>
          <div className="flex gap-2">
            {languageOptions.map((lang) => (
              <Button
                key={lang.value}
                type="button"
                variant={selectedLanguages.includes(lang.value) ? "default" : "outline"}
                onClick={() => handleLanguageToggle(lang.value)}
                className="text-sm"
              >
                {lang.label}
              </Button>
            ))}
          </div>
          {form.formState.errors.languages && (
            <p className="text-sm text-destructive">
              {form.formState.errors.languages.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">ターゲット</Label>
            <Button type="button" variant="outline" onClick={addTarget}>
              <Plus className="w-4 h-4 mr-2" />
              ターゲット追加
            </Button>
          </div>

          {targetFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">ターゲット {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTarget(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>名前</Label>
                  <Input
                    placeholder="my_target"
                    {...form.register(`targets.${index}.name`)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>種類</Label>
                  <Select
                    value={form.watch(`targets.${index}.kind`)}
                    onValueChange={(value) => 
                      form.setValue(`targets.${index}.kind`, value as any)
                    }
                  >
                    <SelectTrigger>
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
                <Label>ソースファイル（改行区切り）</Label>
                <textarea
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">コンパイルオプション</Label>
            <Button type="button" variant="outline" onClick={addOption}>
              <Plus className="w-4 h-4 mr-2" />
              オプション追加
            </Button>
          </div>

          {optionFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                placeholder="-Wall"
                {...form.register(`options.${index}`)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeOption(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
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