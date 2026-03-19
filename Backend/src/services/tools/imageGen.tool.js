import { imagekit } from '../../middleware/upload.middleware.js'

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
      // Cloudflare se image generate karo
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
      
      if (!data.result || !data.result.image) {
        console.log("CF Error:", data)
        return null
      }

      const base64 = data.result.image

      // ImageKit pe upload karo
      const uploadResponse = await imagekit.upload({
        file: `data:image/jpeg;base64,${base64}`,
        fileName: `image_${Date.now()}.jpg`,
        folder: "/generated-images"
      })

      console.log("ImageKit URL:", uploadResponse.url)
      return uploadResponse.url

    } catch (err) {
      console.log("Image error:", err)
      return null
    }
  }
}

export default imageGenTool