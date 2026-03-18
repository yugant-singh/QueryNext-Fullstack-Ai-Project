import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
const searchTool = new TavilySearchResults({
  maxResults: 5,
  apiKey: process.env.TAVILY_API_KEY
});

export default searchTool