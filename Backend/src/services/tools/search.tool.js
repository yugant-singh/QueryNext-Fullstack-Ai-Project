import { tavily } from "@tavily/core";

const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

const searchTool = {
  type: "function",
  function: {
    name: "tavily_search",
    description: "Search the internet for current information and latest news",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query"
        }
      },
      required: ["query"]
    }
  },
  invoke: async ({ query }) => {
    const result = await client.search(query, { maxResults: 5 })
    return JSON.stringify(result.results)
  }
}

export default searchTool;