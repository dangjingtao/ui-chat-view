import { ChatOllama } from "@langchain/ollama";
// agent.ts

// IMPORTANT - Add your API keys here. Be careful not to publish them.
process.env.OPENAI_API_KEY = "1234";
const TAVILY_API_KEY = "xxxxxxxxxxxxxxx";

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

// Define the tools for the agent to use
const agentTools = [
  new TavilySearchResults({ maxResults: 3, apiKey: TAVILY_API_KEY }),
];
const agentModel = new ChatOllama({
  temperature: 0,
  model: "qwq:latest",
});

// Initialize memory to persist state between graph runs
const agentCheckpointer = new MemorySaver();
const agent = createReactAgent({
  llm: agentModel,
  tools: agentTools,
  checkpointSaver: agentCheckpointer,
});

// Now it's time to use!
const agentFinalState = await agent.invoke(
  { messages: [new HumanMessage("今天世界有什么新闻")] },
  { configurable: { thread_id: "42" } },
);

console.log(
  agentFinalState.messages[agentFinalState.messages.length - 1].content,
);

// const agentNextState = await agent.invoke(
//   { messages: [new HumanMessage("what about ny")] },
//   { configurable: { thread_id: "42" } },
// );

// console.log(
//   agentNextState.messages[agentNextState.messages.length - 1].content,
// );
