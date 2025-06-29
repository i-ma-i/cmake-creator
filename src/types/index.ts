export type TargetFormData = {
  name: string;
  kind: "executable" | "static" | "shared" | "interface";
  sources: string[];
  includeDirs: string[];
  linkLibs: string[];
  compileDefs: string[];
};

export type CMakeFormData = {
  cmakeVersion: string;
  projectName: string;
  languages: ("C" | "CXX" | "CUDA")[];
  targets: TargetFormData[];
  options: string[];
};

export type FileNode = {
  id: string;
  name: string;
  type: "folder" | "cmake";
  children?: FileNode[];
  cmakeForm?: CMakeFormData;
  parentId?: string;
};

export type TreeNode = {
  id: string;
  name: string;
  type: "folder" | "cmake";
  children?: TreeNode[];
  data?: CMakeFormData;
  isOpen?: boolean;
};