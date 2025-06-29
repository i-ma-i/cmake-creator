## 1. Objective
Create a single‑page web application that lets users design an arbitrary folder tree and, for any folder, fill in **form‑based input fields** that are rendered into **`CMakeLists.txt`** files.  
The app must then bundle the entire tree—including all generated CMake files—into a **ZIP archive** for download.  
Everything runs purely client‑side and is hosted on **GitHub Pages**.

## 2. Deliverables
| Item | Description |
|------|-------------|
| Source code | React/TypeScript project (Vite) with clear folder structure |
| `templates/` | Handlebars templates for `CMakeLists.txt` |
| CI workflow  | `.github/workflows/deploy.yml` for auto‑deploy to `gh-pages` |
| Documentation | Minimal README covering setup, build & deploy instructions |

## 3. Technology Stack  (No localization required)
| Layer | Library / Tool | Notes |
|-------|----------------|-------|
| Core framework | **React 18 + TypeScript (TSX)** | SPA |
| Build | **Vite** | Fast HMR & static output |
| Styling / UI | **Tailwind CSS** + **shadcn/ui** | Radix‑based a11y, utility classes |
| Drag‑and‑drop tree | **dnd‑kit** + `react‑arborist` | Folder manipulation |
| Form state & validation | **React Hook Form** + **Zod** | Type‑safe, schema‑based |
| Templating | **Handlebars.js** (or template literals) | Conditional sections |
| Packaging | **JSZip** + **FileSaver.js** | ZIP creation & download |
| Tooling | ESLint, Prettier, Vitest | Standard quality gates |
| CI/CD | **GitHub Actions** + `peaceiris/actions-gh-pages` | Push → deploy |

> **Out of scope:** i18n / localization, backend services.

## 4. Functional Requirements
### 4.1 Folder Tree UI
* Visual tree of folders/files, root `/` is implicit.
* Drag‑and‑drop to reorder or nest nodes.
* Context actions: **Add folder**, **Add CMakeLists.txt**, **Rename**, **Delete**.

### 4.2 CMake Form
For every `CMakeLists.txt` node, show a side panel form with:

| Field | Type | Validation |
|-------|------|------------|
| CMake minimum version | string (e.g. `3.29`) | `/^\d+\.\d+$/` |
| Project name | string | non‑empty |
| Languages | multiselect (`C`, `CXX`, `CUDA`) | ≥1 |
| Targets | repeatable group | see below |
| Compile options | repeatable string array | optional |

_Target group:_
```
{
  name: string;        // ≥1 char
  kind: "executable" | "static" | "shared" | "interface";
  sources: string[];   // filenames
  includeDirs: string[];
  linkLibs: string[];
  compileDefs: string[];
}
```

### 4.3 Validation & Preview
* **Zod** schema enforces all constraints on form submit.
* “Preview” button opens modal with rendered CMake (read‑only).

### 4.4 Generation & Download
* Submit triggers Handlebars rendering → text string.
* Recursively build ZIP via **JSZip**:
  * Create folder paths.
  * `CMakeLists.txt` files use rendered content.
* Call `saveAs(blob, "project.zip")`.

### 4.5 Persistence (optional but recommended)
* Serialize entire tree as JSON in `localStorage` to survive page refresh.

## 5. Data Model (TypeScript)
```ts
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
};
```

## 6. Template Example (`templates/CMakeLists.hbs`)
```hbs
cmake_minimum_required(VERSION {{cmakeVersion}})
project({{projectName}} LANGUAGES {{#each languages}}{{this}} {{/each}})

{{#each targets}}
add_{{kind}}({{name}}
  {{#each sources}}
    {{this}}
  {{/each}}
)
{{#if includeDirs}}
target_include_directories({{name}} PUBLIC
  {{#each includeDirs}}
    {{this}}
  {{/each}}
)
{{/if}}
{{#if linkLibs}}
target_link_libraries({{name}} PUBLIC
  {{#each linkLibs}}
    {{this}}
  {{/each}}
)
{{/if}}
{{/each}}

{{#each options}}
add_compile_options({{this}})
{{/each}}
```

## 7. Suggested Project Structure
```
cmake-gen/
 ├─ src/
 │   ├─ components/
 │   │   ├─ FolderTree.tsx
 │   │   ├─ CMakeForm.tsx
 │   │   ├─ PreviewModal.tsx
 │   │   └─ ...
 │   ├─ hooks/
 │   │   └─ useZipBuilder.ts
 │   ├─ templates/
 │   │   └─ CMakeLists.hbs
 │   ├─ App.tsx
 │   └─ main.tsx
 ├─ public/
 ├─ index.html
 ├─ vite.config.ts
 ├─ tailwind.config.ts
 ├─ package.json
 └─ tsconfig.json
```

## 8. Build & Deployment
1. `npm run dev` – local dev server with HMR.  
2. `npm run build` – `vite build` outputs static files to `dist/`.  
3. `npm run preview` – preview production build locally.  
4. GitHub Actions pipeline:
   * Checkout, `npm ci`, `npm run build`.
   * Publish `./dist` to `gh-pages` branch via `peaceiris/actions-gh-pages`.
5. Configure **GitHub Pages** to serve from `gh-pages / (root)`.

## 9. Non‑Functional Requirements
* **Performance:** initial bundle ≤ 300 kB gzipped.
* **Accessibility:** keyboard‑navigable tree; WCAG AA color contrast.
* **Browser support:** Last 2 major versions of Chrome, Firefox, Edge, Safari.
* **Code quality:** ESLint “recommended + react + hooks”, Prettier auto‑format.
* **Testing:** minimum unit tests for helpers & template generation using **Vitest**.
