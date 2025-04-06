# Code Runner (代码解析器)



## 需求 分析

### 1. 需求：运行 LLM 写的前端（HTML + CSS + JS）/ Python / Java 代码

- **描述**: LLM 生成的代码通常在 Markdown 的 ```<language> ``` 代码块中，语言标识明确（如 ```html、```python）。高亮已处理，需要从 Markdown 提取代码并识别语言，然后运行。
- **方案评估**:
  1. **Markdown 解析**:
     - **工具**: 使用轻量级 Markdown 解析库（如 `marked` 或 `markdown-it`），提取代码块和语言标识。
     - **实现**: 解析 Markdown 字符串，遍历 AST 或 token，匹配 ``` 块，获取语言和内容。
     - **优点**: 成熟库支持良好，解析速度快。
     - **缺点**: 需要额外处理非标准格式（如缺少语言标识）。
  2. **语言识别**:
     - **方法 1**: 依赖代码块的显式语言标识（如 ```js），无需自动检测。
     - **方法 2**: 若无标识，可用简单启发式规则（比如检测 `print` 推断 Python），但不推荐（准确性低）。
     - **推荐**: 方法 1，假设 LLM 输出规范，始终带语言标识。
  3. **运行环境**:
     - **HTML + CSS + JS**: 客户端直接渲染（Shadow DOM 或动态 DOM 操作）。
     - **Python**: 使用 Pyodide（WebAssembly 实现的 Python 解释器）。
     - **Java**: 使用 CheerpJ 或 TeaVM（Java to JS/Wasm 编译器）。
     - **挑战**: 不同语言的运行时加载和兼容性。
- **初步方案**:
  - 输入 Markdown 文本 → 解析提取 ```<language> ``` → 根据语言调用对应运行器。
  - 假设语言标识明确，优先支持 HTML/CSS/JS、Python、Java。

---

### 2. 需求：追求客户端化，使用 Vue 3 + TS + Setup 风格，统一 API
- **描述**: 实现一个 Vue 组件，支持不同语言，但对外提供统一的 API。
- **方案评估**:
  1. **客户端化**:
     - **HTML + CSS + JS**: 使用 Shadow DOM 或自定义 DOM 容器，完全客户端化。
     - **Python**: Pyodide 已成熟，支持客户端运行。
     - **Java**: CheerpJ 支持动态运行，但体积较大；TeaVM 需要预编译，不够动态。
     - **结论**: Python 用 Pyodide，Java 用 CheerpJ 可实现客户端化。
  2. **Vue 3 + TS + Setup**:
     - **组件结构**: 单文件组件（SFC），使用 `<script setup>` 和 TypeScript。
     - **类型定义**: 定义统一的代码输入和输出接口。
     - **实现**: 不同语言的运行逻辑封装在独立模块，组件统一调用。
  3. **统一 API**:
     - **Props**: `{ code: string, language: string }`（输入代码和语言）。
     - **Events**: `run-success`（成功结果）、`run-error`（错误信息）。
     - **Methods**: `run()`（手动运行）、`reset()`（重置状态）。
     - **挑战**: 不同语言的输出格式差异（HTML 是渲染，Python/Java 是文本）。
- **初步方案**:
  
  - 组件接收 Markdown 或直接代码 + 语言，内部根据语言分发到对应运行器。
  - 使用 TS 定义类型，确保 API 一致性。
  - 示例接口：
    ```typescript
    interface CodeInput {
      code: string;
      language: 'html' | 'css' | 'js' | 'python' | 'java';
    }
    interface RunResult {
      success: boolean;
      output?: string | HTMLElement; // 根据语言不同返回文本或 DOM
      error?: string;
    }
    ```

---

### 3. 需求：代码解析器作为 LLM 工具调用，结果可下载
- **描述**: 组件既能被 LLM 调用（工具模式），也能输出结果并支持下载（比如 ZIP 包）。
- **方案评估**:
  1. **工具调用**:
     - **方式**: 组件暴露 `run` 方法，LLM 通过 API 或事件调用。
     - **格式**: 接收标准化的工具调用参数（如 JSON），返回结果。
     - **实现**: Vue 组件支持外部调用，结合事件总线或全局状态。
  2. **结果输出**:
     - **HTML + CSS + JS**: 输出渲染后的 DOM 或源代码。
     - **Python / Java**: 输出控制台文本。
     - **统一性**: 将结果标准化为字符串或文件结构。
  3. **下载为 ZIP**:
     - **工具**: 使用 JSZip（客户端 ZIP 生成库）。
     - **实现**: 
       - HTML → `index.html`。
       - CSS → `styles.css`。
       - JS → `script.js`。
       - Python/Java → `<filename>.<ext>`。
       - 生成 ZIP 并触发下载。
     - **优点**: 完全客户端化，依赖成熟库。
     - **挑战**: 多文件项目需要用户指定文件名或自动推导。
- **初步方案**:
  - 组件支持 `run` 方法，接受代码并返回结果。
  - 提供 `download` 方法，将代码和输出打包为 ZIP。
  - 示例：
    ```typescript
    interface DownloadOptions {
      filename?: string; // 默认文件名
      includeOutput?: boolean; // 是否包含运行结果
    }
    ```

---

### 4. 我的看法和补充建议
- **看法**:
  1. **需求 1**: 从 Markdown 提取代码是关键步骤，建议假设 LLM 输出规范（带语言标识），简化解析逻辑。若不规范，可增加 fallback 机制。
  2. **需求 2**: 客户端化可行，Vue 3 + TS 是现代最佳实践。统一 API 是亮点，但需处理输出差异（渲染 vs 文本）。
  3. **需求 3**: 工具调用和下载功能增强了实用性，ZIP 下载是个好想法，但需考虑多语言输出的文件结构。
- **潜在漏洞**:
  1. **安全性**: JS 运行可能访问全局对象，需严格沙盒化（Shadow DOM + 限制 `window` 访问）。
  2. **性能**: Pyodide 和 CheerpJ 加载时间较长，需优化初始加载（如懒加载）。
  3. **复杂代码**: LLM 可能生成多文件代码或依赖外部库，客户端难以支持。
- **补充建议**:
  1. **懒加载运行时**: 按需加载 Pyodide/CheerpJ，减少初始开销。
  2. **错误提示**: 为用户提供详细错误（行号、上下文），提升体验。
  3. **预览模式**: 为 HTML/CSS/JS 提供实时预览（debounce 输入），Python/Java 保留手动运行。
  4. **扩展性**: 设计插件式运行器架构，未来支持更多语言（如 Rust、Go）。

---

### 最佳实践方案（初步框架）
1. **组件结构**:
   - `CodeRunner.vue`: 主组件，负责 UI 和 API。
   - `runners/`:
     - `htmlCssJsRunner.ts`: 处理前端代码。
     - `pythonRunner.ts`: 调用 Pyodide。
     - `javaRunner.ts`: 调用 CheerpJ。
   - `utils/`:
     - `markdownParser.ts`: 解析 Markdown。
     - `zipExporter.ts`: 生成 ZIP。
2. **API**:
   
   ```typescript
   // 输入
   interface CodeInput {
     markdown?: string; // 可选 Markdown 输入
     code?: string;     // 直接代码输入
     language: 'html' | 'css' | 'js' | 'python' | 'java';
   }
   
   // 输出
   interface RunResult {
     success: boolean;
     output: string | HTMLElement; // 文本或渲染结果
     error?: string;
   }
   
   // 组件定义
   defineProps<{
     input: CodeInput;
     height?: string;
   }>();
   defineEmits<{
     (e: 'run-success', result: RunResult): void;
     (e: 'run-error', error: string): void;
   }>();
   ```
3. **流程**:
   - 输入 Markdown → 解析提取代码和语言 → 分发到运行器 → 返回结果 → 可下载 ZIP。
4. **技术栈**:
   - Vue 3 + TS + `<script setup>`。
   - Shadow DOM（HTML/CSS/JS）。
   - Pyodide（Python）。
   - CheerpJ（Java）。
   - JSZip（下载）。

---

### 下一步
- 如果你对这个方案满意，我们可以深入某部分（如 Markdown 解析逻辑或运行器设计）。
- 如果有调整需求（比如去掉 Java 支持），告诉我，我再优化！
- 你觉得这个框架如何？有什么具体方向想细化吗？





好的，感谢你的反馈和简化需求！我们已经逐步明确了方向，我会针对你的新输入进一步优化方案，解决疑虑，并总结出 `CodeRunner` 组件的 API。以下是逐条分析和最终设计：

---

### 1. 需求：识别标准 Markdown 代码块，统计可执行代码块
- **你的输入**: 
  - 识别标准 Markdown 代码块（兼容 ```js），无需复杂语言推断。
  - 需要解析代码块数量，由前端主动确认，提供通用识别方法。
- **方案调整**:
  - **Markdown 解析**: 使用 `marked` 或 `markdown-it` 解析标准 Markdown，提取所有 ``` 代码块及其语言标识。
  - **统计代码块**: 返回一个数组，包含每个代码块的 `{ language, code }`，前端可根据需要确认执行哪些。
  - **通用方法**: 组件提供 `parseMarkdown` 方法，输出代码块列表，供外部调用。
- **实现思路**:
  - 输入 Markdown 字符串 → 解析成 token → 过滤 ``` 块 → 返回 `{ language: string, code: string }[]`。
  - 前端可遍历数组，选择执行特定块。
- **我的看法**: 
  - 这个设计清晰且灵活，满足了“统计可执行代码块”的需求。
  - 建议假设 LLM 输出规范（每个 ``` 块带语言标识），简化解析逻辑。

---

### 2. 需求：JS 渲染成文本，Terminal 组件，API 改进
- **你的输入**: 
  - JS 需支持文本输出（即使可独立执行），HTML/CSS/JS 可渲染界面。
  - 已实现 Terminal 组件，考虑 `onError` 和异步事件流更新 Terminal。
- **方案调整**:
  1. **文本输出**:
     - **HTML + CSS + JS**: 同时支持 DOM 渲染和文本输出（捕获 `console.log`）。
     - **Python / Java**: 输出纯文本（控制台结果）。
     - **实现**: 统一结果为 `{ rendered: HTMLElement | null, text: string }`，满足通用需求。
  2. **Terminal 集成**:
     - 将运行结果输出到 Terminal 组件。
     - 支持同步输出（立即返回）和异步输出（流式更新）。
  3. **API 改进**:
     - **Props**: 添加 `terminalMode: boolean`，决定是否仅输出文本到 Terminal。
     - **Events**: 
       - `on-success`: 运行成功，返回结果。
       - `on-error`: 运行失败，返回错误信息。
       - `on-update`: 异步输出更新（支持流式日志）。
     - **异步支持**: 使用 Promise 或 EventEmitter 处理 Python/Java 的异步执行。
- **我的看法**:
  - `onError` 是必要的，建议改为 `on-error`（Vue 事件命名规范）。
  - 异步流更新是个好想法，特别是 Python/Java 的长时间运行任务，订阅事件流可以提升体验。
  - Terminal 组件已实现的话，可以作为输出目标，简化渲染逻辑。

---

### 3. 需求：多文件支持前端语言，调教 LLM 生成结构
- **你的输入**: 
  - 多文件暂只支持前端语言（HTML/CSS/JS）。
  - 通过提示词调教 LLM 生成特定结构。
- **方案调整**:
  - **多文件结构**: 假设 LLM 输出形如：
    ```
    ```html
    <h1>Hello</h1>
    ```
    ```css
    h1 { color: blue; }
    ```
    ```js
    console.log("Hi");
    ```
    - 解析后生成 `{ html: string, css: string, js: string }`。
  - **实现**: 
    - 解析 Markdown，合并同语言代码（若有多个 ```js，则拼接）。
    - 渲染时，HTML/CSS/JS 分别处理。
  - **下载**: 使用 JSZip，打包成 `index.html`、`styles.css`、`script.js`。
- **我的看法**:
  - 通过提示词控制 LLM 输出是个实用方案，避免客户端处理复杂依赖。
  - 建议在提示词中明确文件名（若有多文件），如 `file:index.html`，方便后续扩展。

---

### 4. 你的补充反馈：懒加载，取消实时预览
- **你的输入**: 
  - 取消实时预览。
  - 懒加载运行时，用户点开后加载，提供加载界面。
- **方案调整**:
  - **懒加载**: 
    - Pyodide 和 CheerpJ 默认不加载，用户触发运行时动态导入。
    - 显示加载状态（如 “Loading Python runtime...”）。
  - **实现**: 
    - 使用 `import()` 动态加载运行时模块。
    - Vue 组件维护 `loading` 状态，渲染加载 UI。
- **我的看法**: 
  - 懒加载能显著减少初始加载时间，非常适合客户端化。
  - 加载界面是个贴心设计，可以用 Vue 的 `v-if` 切换状态。

---

### 我的额外建议
- **安全性**: JS 执行时，限制全局作用域访问（通过代理或沙盒）。
- **可扩展性**: 运行器设计为插件式，方便未来加语言。
- **用户体验**: 支持“重试”按钮，保留上次输入。

---

### 总结：`CodeRunner` Vue 组件 API

以下是基于讨论的最终 API 设计，使用 Vue 3 + TS + `<script setup>` 风格：

#### 组件名称
- `CodeRunner`

#### Props
```typescript
interface CodeInput {
  markdown?: string;              // Markdown 输入，包含代码块
  code?: string;                  // 直接代码输入（单块）
  language?: 'html' | 'css' | 'js' | 'python' | 'java'; // 语言类型
}

defineProps<{
  input: CodeInput;               // 代码输入
  terminalMode?: boolean;         // 是否仅输出到 Terminal
  height?: string;                // 输出区域高度，默认 '200px'
}>();
```

#### Emits
```typescript
defineEmits<{
  (e: 'on-success', result: RunResult): void;  // 运行成功
  (e: 'on-error', error: string): void;        // 运行失败
  (e: 'on-update', output: string): void;      // 异步输出更新
}>();

interface RunResult {
  rendered?: HTMLElement | null;  // 渲染结果（HTML/JS）
  text: string;                   // 文本输出（通用）
}
```

#### Expose（公开方法）
```typescript
defineExpose({
  run: () => void;                // 手动运行代码
  reset: () => void;              // 重置状态
  parseMarkdown: (markdown: string) => CodeBlock[]; // 解析 Markdown
  download: (options?: DownloadOptions) => void;    // 下载 ZIP
});

interface CodeBlock {
  language: 'html' | 'css' | 'js' | 'python' | 'java';
  code: string;
}

interface DownloadOptions {
  filename?: string;              // ZIP 文件名，默认 'code.zip'
  includeOutput?: boolean;        // 是否包含运行结果
}
```

#### Slots
- `loading`: 自定义加载界面。
- `header`: 自定义头部内容。

#### 内部实现（伪代码）
```typescript
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import JSZip from 'jszip';

const props = defineProps<{ input: CodeInput, terminalMode?: boolean, height?: string }>();
const emit = defineEmits(['on-success', 'on-error', 'on-update']);

const loading = ref(false);
const output = ref<string>('');

// 运行时懒加载
const runners = {
  htmlCssJs: () => ({ run: (input: CodeInput) => ({ rendered: HTMLElement, text: string }) }),
  python: async () => {
    loading.value = true;
    const { runPython } = await import('pyodide');
    loading.value = false;
    return { run: (code: string) => ({ text: string }) };
  },
  java: async () => {
    loading.value = true;
    const { runJava } = await import('cheerpj');
    loading.value = false;
    return { run: (code: string) => ({ text: string }) };
  }
};

// 解析 Markdown
const parseMarkdown = (markdown: string): CodeBlock[] => {
  // 使用 marked 或 markdown-it 解析
  return [{ language: 'js', code: 'console.log("test")' }]; // 示例
};

// 运行代码
const run = async () => {
  const blocks = props.input.markdown ? parseMarkdown(props.input.markdown) : [{
    language: props.input.language!,
    code: props.input.code!
  }];

  for (const block of blocks) {
    try {
      const runner = await runners[block.language]();
      const result = runner.run(block);
      emit('on-success', result);
      if (!props.terminalMode && result.rendered) {
        // 渲染到 Shadow DOM
      }
      emit('on-update', result.text);
    } catch (e) {
      emit('on-error', e.message);
    }
  }
};

// 下载 ZIP
const download = (options: DownloadOptions = {}) => {
  // const zip = new JSZip();
  // const blocks = parseMarkdown(props.input.markdown || '');
  // blocks.forEach(b => zip.file(`${b.language}.${b.language}`, b.code));
  // zip.generateAsync({ type: 'blob' }).then(blob => {
  //   // 触发下载
  // });
};

defineExpose({ run, reset: () => output.value = '', parseMarkdown, download });
</script>
