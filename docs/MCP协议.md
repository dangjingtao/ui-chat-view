## 介绍

模型上下文协议（Model Context Protocol，简称MCP）。这一新标准旨在将人工智能助手与数据存储系统无缝连接，包括内容仓库、商业工具和开发环境，帮助前沿模型产出更精准的相关响应。

随着AI助手被广泛应用，行业在提升模型能力上投入巨大，推理能力和输出质量取得显著进步。但即便是最先进的模型仍受困于数据孤岛：关键数据被分散在不同的存储系统中，每次接入新数据源都需要定制化方案，严重阻碍了系统扩展性。

MCP通过统一开放标准解决了这一难题。它为AI系统与数据源建立了标准化的双向连接，将碎片化的对接方式整合为统一协议。开发者从此能够以更简单可靠的方式，让AI系统安全访问所需的各类数据。

MCP作为开放标准，MCP允许开发者以两种方式实现数据连接：一是通过MCP服务器开放企业数据源，二是构建能够对接MCP服务器的AI应用端。这为构建智能化工具提供了标准化开发框架。

开发者现可使用的核心组件：

- MCP协议规范与开发工具包
- 适用于Claude Desktop应用的本地化MCP服务器
- 开源的MCP服务器实现库

Claude 3.5 Sonnet版本进一步增强了MCP服务器的可扩展性，使企业与开发者能快速将内部数据集与各类AI工具对接。我们已提供适用于Google Drive、Slack、GitHub、Postgres等行业主流系统的预置MCP服务器方案，帮助开发者快速起步。

## MCP核心架构与组件

MCP基于**客户端-服务器架构**，允许主机应用通过协议与多个服务器进行交互。

![image-20250327172717386](D:\workspace\ui-chat-view\docs\MCP协议\image-20250327172717386.png)

### **MCP主机（Hosts）**

- **定义**：需要通过MCP访问数据或功能的程序。
- **示例**：如Claude Desktop（AI工作台）、集成开发环境（IDE）、AI工具等。
- **作用**：作为客户端发起与服务器的连接，调用服务器提供的功能。

### **MCP客户端（Clients）**

- **定义**：遵循MCP协议的客户端程序。
- **连接模式**：每个客户端与一个服务器建立**一对一的专属连接**，确保通信的直接性和稳定性。

### **MCP服务器（Servers）**

- **定义**：轻量级程序，通过MCP协议对外提供特定功能。
- **功能**：每个服务器专注实现一种或多种能力（如文件访问、API调用等）。
- **协议标准**：所有服务器接口均遵循统一的**标准化模型上下文协议（MCP）**，确保兼容性。

### **本地数据源（Local Data Sources）**

- **内容**：包括计算机本地的文件、数据库、系统服务等资源。
- **访问方式**：MCP服务器可**安全访问**本地数据源，用于执行任务或提供服务。
- **安全机制**：需通过身份验证和权限控制确保数据安全。

### **远程服务（Remote Services）**

- **定义**：通过互联网访问的外部系统，如API接口、云服务等。
- **连接方式**：MCP服务器可通过网络协议（如HTTP、WebSocket）与远程服务交互，实现跨网络功能调用。

### 架构总结

- **核心逻辑**：主机应用通过客户端连接多个MCP服务器，服务器负责调用本地数据或远程服务，所有交互均通过标准化的MCP协议完成。
- **优势**：模块化设计使系统扩展灵活，客户端与服务器解耦，支持高效、安全的数据与服务交互。

## 意义

MCP的核心意义在于突破AI与数据源之间长期存在的技术壁垒，构建了一个开放、统一的连接框架。它通过三项关键创新重塑了AI与企业系统的互动方式：

1. **消除数据孤岛** MCP终结了传统模式下为每个数据源重复开发专用接口的困境。通过制定标准化协议规范，企业无需为Google Drive、GitHub等不同系统开发独立连接器，开发者只需理解单一协议即可打通跨平台数据通道，将系统整合时间缩短70%以上。Block公司通过MCP协议，成功将内部财务系统与AI代码审查工具对接，实现了需求分析文档到代码生成的全流程自动化，效率提升显著。
2. **构建智能协同网络** 该协议设计的双向通信机制，使AI模型不仅能获取静态数据，更能动态调用执行系统（如Puppeteer浏览器）的实时操作能力。当开发人员编写数据库查询时，Claude 3.5 Sonnet已能根据PostgreSQL实际表结构即时验证代码逻辑，这种"上下文增强"使错误率降低40%。Apollo公司利用此特性开发了汽车故障诊断系统，AI可同时调取车辆实时传感器数据与历史维修手册，生成维修方案的准确率提升了3倍。
3. **定义未来协作范式** 协议的开源架构与轻量化设计（如本地仅需20MB服务端运行时）确保了极高的扩展性。开发者可基于规范快速搭建支持HTTPS加密的MCP服务器，甚至将企业本地数据仓库安全暴露给GitHub Copilot等工具。这项革新使Sourcegraph等代码搜索平台实现了跨仓库代码智能跳转，开发者定位函数定义的时间从平均30秒缩短至2秒。

MCP的意义远不止技术层面的连接，其更深远的影响在于推动建立AI协作的底层语言。正如Replit将MCP集成至开发环境后，编程初学者首次能通过自然语言查询所有仓库的文档规范，这种标准化交互接口正逐渐重构人与AI的协作模式——将原本孤立的工具链转化为互联互通的认知网络。随着代码库、邮件系统甚至ERP数据通过MCP协议开放，AI将真正具备理解业务全貌的能力，其价值输出将从单一功能执行升级为跨系统的智能决策支持。

---

# UIChat接入MCP记录

在MCP协议中，"客户端"泛指AI工具。包括界面和处理API调用控制AI调用的服务程序。本文以UIChat 应用MCP typescript SDK为例，展示如何给你的AI应用层提供MCP支持。

```
yarn add @modelcontextprotocol/sdk
```

## 定义Langchain工具类

> https://js.langchain.com/docs/how_to/tool_calling#tool-calls





## 在langchain工具调用时



## MCP服务器开发



MCP 服务器可以提供三种主要能力：

1. **资源**：可以由客户端读取的文件类型数据（例如 API 响应或文件内容）
2. **工具**：可以由LLM（需用户批准）调用的函数
3. **提示**：预写模板帮助用户完成特定任务



### MCP 调试

o inspect an MCP server implementation, there's no need to clone this repo. Instead, use `npx`. For example, if your server is built at `build/index.js`:
为了检查一个 MCP 服务器实现，请无需克隆此仓库。相反，使用 `npx` 。例如，如果您的服务器构建在 `build/index.js` ：

```
npx @modelcontextprotocol/inspector node build/index.js
```



You can pass both arguments and environment variables to your MCP server. Arguments are passed directly to your server, while environment variables can be set using the `-e` flag:
你可以将参数和环境变量传递给你的 MCP 服务器。参数直接传递到您的服务器，而环境变量可以通过使用 `-e` 标志来设置：

```
# Pass arguments only
npx @modelcontextprotocol/inspector build/index.js arg1 arg2

# Pass environment variables only
npx @modelcontextprotocol/inspector -e KEY=value -e KEY2=$VALUE2 node build/index.js

# Pass both environment variables and arguments
npx @modelcontextprotocol/inspector -e KEY=value -e KEY2=$VALUE2 node build/index.js arg1 arg2

# Use -- to separate inspector flags from server arguments
npx @modelcontextprotocol/inspector -e KEY=$VALUE -- node build/index.js -e server-flag
```



The inspector runs both a client UI (default port 5173) and an MCP proxy server (default port 3000). Open the client UI in your browser to use the inspector. You can customize the ports if needed:
检查器运行客户端 UI（默认端口 5173）和 MCP 代理服务器（默认端口 3000）。请在浏览器中打开客户端 UI 以使用检查器。如果需要，可以自定义端口。

```
CLIENT_PORT=8080 SERVER_PORT=9000 npx @modelcontextprotocol/inspector node build/index.js
```



For more details on ways to use the inspector, see the [Inspector section of the MCP docs site](https://modelcontextprotocol.io/docs/tools/inspector). For help with debugging, see the [Debugging guide](https://modelcontextprotocol.io/docs/tools/debugging).
了解更多如何使用检查器，请参阅 MCP 文档站点上的检查器部分。如需帮助进行调试，请参阅调试指南。

### Authentication 认证



The inspector supports bearer token authentication for SSE connections. Enter your token in the UI when connecting to an MCP server, and it will be sent in the Authorization header.
检查器支持对 SSE 连接进行凭据令牌认证。当连接到 MCP 服务器时，请在 UI 中输入您的凭据令牌，并将其发送到 Authorization 头中。
