import multer from 'multer'
import path from 'path'
import Imagekit from 'imagekit'

export const imagekit = new Imagekit({
    publicKey:process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINTS
})

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.txt', '.docx']
  const ext = path.extname(file.originalname).toLowerCase()
  if (allowed.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Only PDF, TXT, DOCX allowed'))
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
})
export default upload