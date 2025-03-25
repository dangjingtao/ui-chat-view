# Comfy UI API 文档

## 概述
Comfy UI 是一个基于 Python 的 Web 服务，提供了丰富的 API 接口用于管理和操作图像生成任务。以下是该服务的 API 文档。

支持跨域启动命令：

```
.\python_embeded\python.exe -s ComfyUI\main.py --enable-cors-header * --windows-standalone-build
```

## API 列表

### 1. WebSocket 接口

#### `GET /ws`
• **描述**: 建立 WebSocket 连接，用于实时通信。
• **请求参数**:
  • `clientId`: 可选，客户端 ID，用于重连时复用会话。
• **响应**: WebSocket 连接建立后，服务器会发送初始状态信息。

### 2. 根路径

#### `GET /`
• **描述**: 获取前端应用的入口文件。
• **响应**: 返回 `index.html` 文件。

### 3. 嵌入向量管理

#### `GET /embeddings`
• **描述**: 获取所有嵌入向量的文件名列表。
• **响应**: 返回嵌入向量文件名的 JSON 数组。

### 4. 模型管理

#### `GET /models`
• **描述**: 获取所有模型文件夹的列表。
• **响应**: 返回模型文件夹名称的 JSON 数组。

#### `GET /models/{folder}`
• **描述**: 获取指定模型文件夹中的所有模型文件。
• **请求参数**:
  • `folder`: 模型文件夹名称。
• **响应**: 返回模型文件名的 JSON 数组。

### 5. 扩展管理

#### `GET /extensions`
• **描述**: 获取所有扩展的 JavaScript 文件路径。
• **响应**: 返回扩展文件路径的 JSON 数组。

### 6. 图像上传与管理

#### `POST /upload/image`
• **描述**: 上传图像文件。
• **请求体**: `multipart/form-data` 格式，包含 `image` 文件。
• **响应**: 返回上传文件的名称、子文件夹和类型信息。

#### `POST /upload/mask`
• **描述**: 上传遮罩图像文件。
• **请求体**: `multipart/form-data` 格式，包含 `image` 文件。
• **响应**: 返回上传文件的名称、子文件夹和类型信息。

#### `GET /view`
• **描述**: 查看图像文件。
• **请求参数**:
  • `filename`: 图像文件名。
  • `subfolder`: 子文件夹路径（可选）。
  • `type`: 文件类型（`input`, `output` 等）。
  • `preview`: 预览参数（可选）。
  • `channel`: 图像通道（`rgba`, `rgb` 等，可选）。
• **响应**: 返回图像文件的内容。

#### `GET /view_metadata/{folder_name}`
• **描述**: 查看指定文件夹中文件的元数据。
• **请求参数**:
  • `folder_name`: 文件夹名称。
  • `filename`: 文件名。
• **响应**: 返回文件的元数据 JSON 对象。

### 7. 系统信息

#### `GET /system_stats`
• **描述**: 获取系统统计信息。
• **响应**: 返回包含系统信息和设备信息的 JSON 对象。

### 8. 提示任务管理

#### `GET /prompt`
• **描述**: 获取当前提示任务队列的信息。
• **响应**: 返回提示任务队列的 JSON 对象。

#### `GET /prompt/{prompt_id}`
• **描述**: 获取指定提示任务的详细信息。
• **请求参数**:
  • `prompt_id`: 提示任务 ID。
• **响应**: 返回提示任务的详细信息。

#### `POST /prompt`
• **描述**: 创建新的提示任务。
• **请求体**: JSON 格式，包含 `prompt` 和其他可选参数。
• **响应**: 返回新创建的提示任务 ID 和其他信息。

#### `GET /queue`
• **描述**: 获取当前任务队列的状态。
• **响应**: 返回任务队列的 JSON 对象。

#### `POST /queue`
• **描述**: 清空或删除任务队列中的任务。
• **请求体**: JSON 格式，包含 `clear` 或 `delete` 参数。
• **响应**: 返回操作成功的状态。

#### `POST /interrupt`
• **描述**: 中断当前正在处理的任务。
• **响应**: 返回操作成功的状态。

#### `POST /free`
• **描述**: 释放内存或卸载模型。
• **请求体**: JSON 格式，包含 `unload_models` 和 `free_memory` 参数。
• **响应**: 返回操作成功的状态。

#### `POST /history`
• **描述**: 清空或删除历史任务记录。
• **请求体**: JSON 格式，包含 `clear` 或 `delete` 参数。
• **响应**: 返回操作成功的状态。

### 9. 节点信息

#### `GET /object_info`
• **描述**: 获取所有节点的详细信息。
• **响应**: 返回所有节点信息的 JSON 对象。

#### `GET /object_info/{node_class}`
• **描述**: 获取指定节点的详细信息。
• **请求参数**:
  • `node_class`: 节点类名。
• **响应**: 返回指定节点的详细信息。

### 10. 历史记录

#### `GET /history`
• **描述**: 获取历史任务记录。
• **请求参数**:
  • `max_items`: 最大记录数（可选）。
• **响应**: 返回历史任务记录的 JSON 数组。

#### `GET /history/{prompt_id}`
• **描述**: 获取指定提示任务的历史记录。
• **请求参数**:
  • `prompt_id`: 提示任务 ID。
• **响应**: 返回指定提示任务的历史记录。

## JavaScript 调用示例

### WebSocket 连接
```javascript
const ws = new WebSocket('ws://localhost:8188/ws');
ws.onmessage = (event) => {
    console.log('Received:', event.data);
};
ws.send(JSON.stringify({ type: 'PREVIEW_IMAGE', data: imageData }));
```

### 获取模型列表
```javascript
fetch('http://localhost:8188/models')
    .then(response => response.json())
    .then(data => console.log(data));
```

### 上传图像
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('http://localhost:8188/upload/image', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### 创建提示任务
```javascript
fetch('http://localhost:8188/prompt', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        prompt: 'A beautiful landscape',
        extra_data: {}
    })
})
.then(response => response.json())
.then(data => console.log(data));
```

### 获取系统信息
```javascript
fetch('http://localhost:8188/system_stats')
    .then(response => response.json())
    .then(data => console.log(data));
```

### 中断任务
```javascript
fetch('http://localhost:8188/interrupt', {
    method: 'POST'
})
.then(response => response.status)
.then(status => console.log('Task interrupted:', status));
```
