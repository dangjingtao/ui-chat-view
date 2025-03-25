import { TavilySearchResults } from "./baseTools/TavilySearch";
// const TAVILY_API_KEY = "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";

const tool = new TavilySearchResults({
  maxResults: 2,
  apiKey: "",
});

export default tool;
