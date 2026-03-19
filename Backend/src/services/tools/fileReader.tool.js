import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import { imagekit } from '../../middleware/upload.middleware.js'

const fileReaderTool = {
  type: "function",
  function: {
    name: "file_reader",
    description: "Read and extract text from uploaded files like PDF, TXT",
    parameters: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "The extracted text content from the file"
        }
      },
      required: ["content"]
    }
  },
  invoke: async ({ fileBuffer, mimetype, filename }) => {
    try {
      // ImageKit pe upload karo
      const uploadResponse = await imagekit.upload({
        file: fileBuffer,
        fileName: filename,
        folder: "/documents"
      })

      let extractedText = ""

      if (mimetype === "application/pdf") {
        // PDF se text extract karo
        const uint8Array = new Uint8Array(fileBuffer)
        const loadingTask = pdfjsLib.getDocument({ data: uint8Array })
        const pdfDoc = await loadingTask.promise
        
        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i)
          const content = await page.getTextContent()
          const text = content.items.map(item => item.str).join(' ')
          extractedText += text + '\n'
        }
      } else if (mimetype === "text/plain") {
        extractedText = fileBuffer.toString("utf-8")
      }

      return {
        url: uploadResponse.url,
        text: extractedText.slice(0, 5000)
      }

    } catch (err) {
      console.log("File reader error:", err)
      return null
    }
  }
}

export default fileReaderTool