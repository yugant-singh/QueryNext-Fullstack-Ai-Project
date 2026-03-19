import fs from 'fs'
import path from 'path'

const imageGenTool = {
  type: "function",
  function: {
    name: "image_generator",
    description: "Generate an image based on a text prompt",
    parameters: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "The image description/prompt"
        }
      },
      required: ["prompt"]
    }
  },
  invoke: async ({ prompt }) => {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt })
        }
      )

      const data = await response.json()
      const base64 = data.result.image

      // File save karo
      const filename = `image_${Date.now()}.jpg`
      const folderPath = path.join(process.cwd(), 'public', 'images')

      // Folder banao agar nahi hai
      fs.mkdirSync(folderPath, { recursive: true })

      // Base64 ko file mein save karo
      fs.writeFileSync(path.join(folderPath, filename), Buffer.from(base64, 'base64'))

      console.log("Image saved:", filename)

      // URL return karo
      return `http://localhost:3000/images/${filename}`

    } catch (err) {
      console.log("Image error:", err)
      return null
    }
  }
}

export default imageGenTool