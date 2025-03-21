import type { XPlugin } from "../types";
// @ts-ignore
import translateIcon from "~icons/mdi/translate";
// @ts-ignore
import networkIcon from "~icons/mdi/web-check";

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
    icon: "https://www.comflowy.com/logo.png",
    component: "ComfyUI",
  },
  {
    id: 3,
    name: "网页阅读器",
    icon: networkIcon,
    version: "1.0.0",
    description: "让你的大模型可以在网页上阅读任何公开的文本",
    enabled: true,
    component: "Translate",
  },
  {
    id: 4,
    name: "Notion API",
    description: "通过这个插件，你可以将你的聊天记录同步到你的 Notion API",
    version: "1.0.0",
    enabled: false,
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAY1BMVEX///8AAAD19fWMjIzj4+NBQUEiIiINDQ3m5uba2tqysrKqqqouLi7ExMTR0dH8/PxISEiZmZnLy8u5ubkUFBRhYWE7Ozvt7e14eHgnJydZWVlQUFBqamqEhIQaGhqSkpKhoaHiMf6YAAACDUlEQVRIib2WSYKDIBREkeAsalScp/ufskFAaRSVXnTt/NZLQAr4ABgEUViU8XdqSe45cx+ZfMwacOvYu85ZVXgCok9Lhu7Cq2nR/sdorPtx+sZlEaIGxTMrNCrYKtZkGNsljjC1Zvq4JmZQZ+qx8ZcpCuDN9JkwI8nxg9vEnyA+qYF5CxV0HPyGBF9mnX6B+iczKGTWDqmg019bswalRRmtbHmH2uPeSAWdahs9TUGKqY+trWtcXKyCNvrYgn4ykDegX9NE0PREND5BI9YMX4Ddhe8keAbjV0tyAb7Kzz+CGUTNCzCDzb7l4VgnFTMstyBsBzfx1Y/Vi/ducAvmR0HseLyyXVw/zTH3Klk4gk9L7vPHCfZKKUH/FYjOJWuQ/BWUZ8p7sEtEMbMEk1QUR0vQA6OoFragvBv8zBIEkSi3tiAYRD21BWWCZluQH/mbzxIEcjGRZwmG4o1rC/LrVMBWIPD/CmIj6N+DgJjA4QGEJjB+APfk6SA4gywxVbr3F7kBLHQwEIGZA/7c8MdEB8HnNyiP3/284TEg4Qncj2AOkmmhjRhOA3AoPQaugpk2x3spoIzkOzBUQLC+BGGDik4FeT5OrSwMtjZ5XaaRDHKLMSl9GLtoEsyaI+prR5Lfdr7lAaI7n65aHVb07N9Em2GtsW8vfbPbk/az0rY5DU29cJT7fpKTUfou+mtFPwwEHTPGCzJuAAAAAElFTkSuQmCC",
  },
];
