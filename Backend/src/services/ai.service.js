import { ChatGroq } from "@langchain/groq";
import { ChatMistralAI } from '@langchain/mistralai'
import { HumanMessage, SystemMessage, AIMessage, ToolMessage } from "@langchain/core/messages"
import searchTool from './tools/search.tool.js'
import imageGenTool from './tools/imageGen.tool.js'

const groqModel = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY
});

const mistralModal = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY
})

const modelWithTools = groqModel.bindTools([searchTool, imageGenTool])

export async function generateResponse(messages) {
  try {
    const formattedMessages = [
      new SystemMessage(`You are a helpful AI assistant like Perplexity.
You MUST follow these rules strictly:
1. ALWAYS use tavily_search tool for ANY question about current events, news, sports, weather, scores, or anything that requires up-to-date information. Never answer from your own knowledge for such topics.
2. ALWAYS use image_generator tool when user asks to generate, create, or make an image.
3. Never say "my knowledge cutoff" - always use the search tool instead.
4. For general knowledge questions that do not need real-time data, answer directly.`),
      ...messages
        .filter(msg => msg.content)
        .map(msg => {
          if (msg.role === "user") return new HumanMessage(msg.content)
          return new AIMessage(msg.content)
        })
    ]

    const response = await modelWithTools.invoke(formattedMessages)
    console.log("Tool calls:", JSON.stringify(response.tool_calls))

    if (response.tool_calls && response.tool_calls.length > 0) {
      const toolCall = response.tool_calls[0]

      if (toolCall.name === "tavily_search") {
        const toolResult = await searchTool.invoke(toolCall.args)

        const finalResponse = await groqModel.invoke([
          ...formattedMessages,
          response,
          new ToolMessage({
            content: toolResult,
            tool_call_id: toolCall.id
          })
        ])
        return finalResponse.content

     } else if (toolCall.name === "image_generator") {
  console.log("Image tool called!", toolCall.args)
  const imageData = await imageGenTool.invoke(toolCall.args)
  console.log("Image data length:", imageData?.length) // ← add karo
  
  if (!imageData) return "Sorry, image generation failed."
  
  return `![generated image](${imageData})`
}
    }

    return response.content

  } catch (err) {
    console.log("generateResponse error:", err)
    throw err
  }
}

export async function generateMistralTitle(message) {
  const response = await mistralModal.invoke([
    new SystemMessage(`You are a helpful assistant that generates concise and descriptive titles for user queries. 
Given the following user query, create a title that captures the essence of the query in a clear and engaging way. 
The title should be no more than 10 words long and should accurately reflect the content of the query.
Generate title in 3-4 words only. Title should be catchy and engaging.
Return only the title text — no quotes, no asterisks, no markdown formatting.`),
    new HumanMessage(`Generate a title for a chat conversation based on the following first message: "${message}"`)
  ])
  console.log("Mistral raw response:", response);
  return response.content
}