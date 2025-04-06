import type { XPlugin } from "../types";
// @ts-ignore
import translateIcon from "~icons/mdi/translate";
// @ts-ignore
import networkIcon from "~icons/mdi/web-check";
// @ts-ignore
import castAudioVariant from "~icons/mdi/cast-audio-variant";
// @ts-ignore
import applicationBraces from "~icons/mdi/application-braces";
// @ts-ignore
import bookOpenVariant from "~icons/mdi/bookOpenVariant";

export const plugins: XPlugin[] = [
  {
    id: 1,
    name: "翻译",
    icon: translateIcon,
    version: "1.0.0",
    description: "将任何模型支持的语言翻译成你想要的语言",
    enabled: true,
    component: "Translate",
  },
  {
    id: 2,
    name: "ComfyUI",
    description:
      "ComfyUI 是一个开源的节点程序，允许用户从一系列文本提示生成图像。它使用基于 Stable Diffusion 的稳定扩散模型作为其图像能力的基础，并结合其他工具如 ControlNet 和 LCM Low-rank 适应性，每个工具都由程序中的节点表示。",
    version: "1.0.0",
    enabled: false,
    icon: "https://framerusercontent.com/images/7Nhoxwn9eWYrqKjEewfXutR90U.png?scale-down-to=1024",
    component: "ComfyUI",
  },
  {
    id: 3,
    name: "网页阅读器",
    icon: networkIcon,
    version: "1.0.0",
    description:
      "让你的大模型可以在网页上阅读任何公开的文本，需要配置embeddings模型。",
    enabled: true,
    component: "WebReader",
  },
  {
    id: 4,
    name: "Notion API",
    description: "通过这个插件，你可以将你的聊天记录同步到你的 Notion",
    version: "1.0.0",
    enabled: false,
    component: "Notion",
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAY1BMVEX///8AAAD19fWMjIzj4+NBQUEiIiINDQ3m5uba2tqysrKqqqouLi7ExMTR0dH8/PxISEiZmZnLy8u5ubkUFBRhYWE7Ozvt7e14eHgnJydZWVlQUFBqamqEhIQaGhqSkpKhoaHiMf6YAAACDUlEQVRIib2WSYKDIBREkeAsalScp/ufskFAaRSVXnTt/NZLQAr4ABgEUViU8XdqSe45cx+ZfMwacOvYu85ZVXgCok9Lhu7Cq2nR/sdorPtx+sZlEaIGxTMrNCrYKtZkGNsljjC1Zvq4JmZQZ+qx8ZcpCuDN9JkwI8nxg9vEnyA+qYF5CxV0HPyGBF9mnX6B+iczKGTWDqmg019bswalRRmtbHmH2uPeSAWdahs9TUGKqY+trWtcXKyCNvrYgn4ykDegX9NE0PREND5BI9YMX4Ddhe8keAbjV0tyAb7Kzz+CGUTNCzCDzb7l4VgnFTMstyBsBzfx1Y/Vi/ducAvmR0HseLyyXVw/zTH3Klk4gk9L7vPHCfZKKUH/FYjOJWuQ/BWUZ8p7sEtEMbMEk1QUR0vQA6OoFragvBv8zBIEkSi3tiAYRD21BWWCZluQH/mbzxIEcjGRZwmG4o1rC/LrVMBWIPD/CmIj6N+DgJjA4QGEJjB+APfk6SA4gywxVbr3F7kBLHQwEIGZA/7c8MdEB8HnNyiP3/284TEg4Qncj2AOkmmhjRhOA3AoPQaugpk2x3spoIzkOzBUQLC+BGGDik4FeT5OrSwMtjZ5XaaRDHKLMSl9GLtoEsyaI+prR5Lfdr7lAaI7n65aHVb07N9Em2GtsW8vfbPbk/az0rY5DU29cJT7fpKTUfou+mtFPwwEHTPGCzJuAAAAAElFTkSuQmCC",
  },

  {
    id: 5,
    name: "MCP运行器",
    description:
      "随着人工智能助手的主流采用，行业已经投入大量资源在模型能力上，实现了快速的进步。然而，即使是最先进的模型也受到数据隔离的影响——被困在信息孤岛和遗留系统中。每个新的数据源都需要其独特的定制实现，这使得真正连通的系统难以扩展。\nMCP 解决了这一挑战。它提供了一个通用、开放的标准，用于连接 AI 系统与数据源，取代碎片化的集成，使用单一协议。结果是为 AI 系统提供所需数据的一种更简单、更可靠的途径。",
    version: "1.0.0",
    enabled: false,
    component: "MCPRunner",
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAAAAABXZoBIAAAA10lEQVR4AXXPIWyDQBhH8ee9DzUk9b71l5ypmZqeqT07ixdIDBKfulnU+cyiq1Cc+y9ky9HvYM/+1EOmeRxn5SwGgHCMjqrrKt6P0OMk6ULMaG0YFGl26FZrQROhRP9nT/UA7Su6bBHOb+A39K82SHL0Ent7aIlaqFfcW6qYdEbi0ILELzq81BX2SbNiwknfhTWQVlSSFIiFzdvKBT1Ly3hjXq6FZey5S1qMZdSJ69CSzWK6AbTZDErT15isCZmMFdgbK7A2VuAH4X9MJ+4WjdZEi0Yf2voBIRlaTuvjYuQAAAAASUVORK5CYII=",
  },

  {
    id: 6,
    name: "GPT-SoVITS-v3",
    description: "A Powerful Few-shot Voice Conversion and Text-to-Speech",
    version: "1.0.0",
    enabled: false,
    component: "GptSoVITS",
    icon: castAudioVariant,
  },

  {
    id: 7,
    name: "代码解释器",
    description: "在UIChat中运行前端+ts+node代码！",
    version: "1.0.0",
    enabled: false,
    component: "CodeRunner",
    icon: applicationBraces,
  },

  {
    id: 8,
    name: "检索增强生成（RAG）",
    description:
      "结合实时检索与生成模型，动态引入外部知识库，解决大模型信息滞后与幻觉问题，提升生成内容真实性。",
    version: "1.0.0",
    enabled: false,
    component: "Rag",
    icon: bookOpenVariant,
  },

  // {
  //   id: 9,
  //   name: "live2d",
  //   description: "A Powerful Few-shot Voice Conversion and Text-to-Speech",
  //   version: "1.0.0",
  //   enabled: false,
  //   component: "WebReader",
  //   icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAY1BMVEX///8AAAD19fWMjIzj4+NBQUEiIiINDQ3m5uba2tqysrKqqqouLi7ExMTR0dH8/PxISEiZmZnLy8u5ubkUFBRhYWE7Ozvt7e14eHgnJydZWVlQUFBqamqEhIQaGhqSkpKhoaHiMf6YAAACDUlEQVRIib2WSYKDIBREkeAsalScp/ufskFAaRSVXnTt/NZLQAr4ABgEUViU8XdqSe45cx+ZfMwacOvYu85ZVXgCok9Lhu7Cq2nR/sdorPtx+sZlEaIGxTMrNCrYKtZkGNsljjC1Zvq4JmZQZ+qx8ZcpCuDN9JkwI8nxg9vEnyA+qYF5CxV0HPyGBF9mnX6B+iczKGTWDqmg019bswalRRmtbHmH2uPeSAWdahs9TUGKqY+trWtcXKyCNvrYgn4ykDegX9NE0PREND5BI9YMX4Ddhe8keAbjV0tyAb7Kzz+CGUTNCzCDzb7l4VgnFTMstyBsBzfx1Y/Vi/ducAvmR0HseLyyXVw/zTH3Klk4gk9L7vPHCfZKKUH/FYjOJWuQ/BWUZ8p7sEtEMbMEk1QUR0vQA6OoFragvBv8zBIEkSi3tiAYRD21BWWCZluQH/mbzxIEcjGRZwmG4o1rC/LrVMBWIPD/CmIj6N+DgJjA4QGEJjB+APfk6SA4gywxVbr3F7kBLHQwEIGZA/7c8MdEB8HnNyiP3/284TEg4Qncj2AOkmmhjRhOA3AoPQaugpk2x3spoIzkOzBUQLC+BGGDik4FeT5OrSwMtjZ5XaaRDHKLMSl9GLtoEsyaI+prR5Lfdr7lAaI7n65aHVb07N9Em2GtsW8vfbPbk/az0rY5DU29cJT7fpKTUfou+mtFPwwEHTPGCzJuAAAAAElFTkSuQmCC",
  // },
];
