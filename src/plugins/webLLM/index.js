import { CreateMLCEngine } from "@mlc-ai/web-llm";

console.log("WebLLM loaded successfully!");

// async function main() {
//   // 初始化进度回调函数
//   const initProgressCallback = (report) => {
//     console.log(report.text); // 打印初始化进度
//   };

//   // 选择预构建的模型
//   const selectedModel = "Llama-3-8B-Instruct-q4f32_1";

//   // 创建引擎
//   const engine = await webllm.CreateMLCEngine(selectedModel, {
//     initProgressCallback: initProgressCallback,
//   });

//   // 创建聊天对话
//   const reply = await engine.chat.completions.create({
//     messages: [{ role: "user", content: "Tell me about Pittsburgh." }],
//   });

//   console.log(reply); // 打印模型回复
// }

// main();
