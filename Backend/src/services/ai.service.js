
import { ChatGroq } from "@langchain/groq";
import{ChatMistralAI} from '@langchain/mistralai'
import { HumanMessage, SystemMessage,AIMessage } from "@langchain/core/messages";



const groqModel = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY
});

const mistralModal = new ChatMistralAI({
  model:"mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY
})

export async function generateResponse(messages) {
  const formattedMessages = [
    new SystemMessage("You are a helpful AI assistant. Answer questions clearly and concisely."),
    ...messages
      .filter(msg => msg.content)
      .map(msg => {
        if (msg.role === "user") return new HumanMessage(msg.content)
        return new AIMessage(msg.content)
      })
  ]

  const response = await groqModel.invoke(formattedMessages)
  return response.content
}

export async function generateMistralTitle(message) {
  const response  = await mistralModal.invoke([
    new SystemMessage(`
You are a helpful assistant that generates concise and descriptive titles for user queries. Given the following user query, create a title that captures the essence of the query in a clear and engaging way. The title should be no more than 10 words long and should accurately reflect the content of the query.
user will provide you with first message and then you will generate title for that message.
in 3-4 words only.Title should be catchy and engaging. 
      `),

      new HumanMessage(`
        Generate a title for a chat conversation based on the following first message
        "${message}"
        `)
  ])
  console.log("Mistral raw response:", response);
  return response.content

}