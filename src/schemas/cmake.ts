import { z } from "zod";

export const targetFormSchema = z.object({
  name: z.string().min(1, "ターゲット名は必須です"),
  kind: z.enum(["executable", "static", "shared", "interface"]),
  sources: z.array(z.string()).default([]),
  includeDirs: z.array(z.string()).default([]),
  linkLibs: z.array(z.string()).default([]),
  compileDefs: z.array(z.string()).default([]),
});

export const cmakeFormSchema = z.object({
  cmakeVersion: z
    .string()
    .min(1, "CMakeバージョンは必須です")
    .regex(/^\d+\.\d+$/, "バージョン形式が無効です（例: 3.29）"),
  projectName: z.string().min(1, "プロジェクト名は必須です"),
  languages: z
    .array(z.enum(["C", "CXX", "CUDA"]))
    .min(1, "少なくとも1つの言語を選択してください"),
  targets: z.array(targetFormSchema).default([]),
  options: z.array(z.string()).default([]),
});

export const fileNodeSchema: z.ZodType<{
  id: string;
  name: string;
  type: "folder" | "cmake";
  children?: any[];
  cmakeForm?: any;
  parentId?: string;
}> = z.object({
  id: z.string(),
  name: z.string().min(1, "ファイル名は必須です"),
  type: z.enum(["folder", "cmake"]),
  children: z.array(z.lazy(() => fileNodeSchema)).optional(),
  cmakeForm: cmakeFormSchema.optional(),
  parentId: z.string().optional(),
});

export type TargetFormData = z.infer<typeof targetFormSchema>;
export type CMakeFormData = z.infer<typeof cmakeFormSchema>;
export type FileNodeData = z.infer<typeof fileNodeSchema>;